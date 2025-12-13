import React, { useMemo } from 'react';

const VirtualCard = ({ cardData, isFlipped }) => {
    const { number, name, expiry } = cardData;

    // Brand Detection (Strict Sri Lanka Rules: Visa & Mastercard ONLY)
    const brand = useMemo(() => {
        const cleanNumber = number.replace(/\D/g, '');

        // Visa: Starts with 4
        if (cleanNumber.startsWith('4')) return 'VISA';

        // Mastercard: Starts with 51-55 OR 2221-2720
        const firstTwo = parseInt(cleanNumber.substring(0, 2), 10);
        const firstFour = parseInt(cleanNumber.substring(0, 4), 10);

        if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
            return 'MASTERCARD';
        }

        return null; // Neutral / Unknown
    }, [number]);

    // Format Masked Number for Display
    const displayedNumber = useMemo(() => {
        const raw = number.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) formatted += '  '; // Double space for wide tracking
            if (i < raw.length) {
                // Mask middle digits: 0-4 visible, 5-11 masked, 12-15 visible
                if (i >= 4 && i < 12) formatted += '•'; // Use bullet
                else formatted += raw[i];
            } else {
                formatted += '•'; // Middle dot for placeholders
            }
        }
        return formatted;
    }, [number]);

    return (
        <div className={`w-full max-w-[380px] mx-auto h-[220px] md:h-[200px] rounded-[24px] relative overflow-hidden transition-all duration-300 mb-6 shadow-2xl group ${isFlipped ? 'blur-sm opacity-80' : ''}`}>
            {/* 1. Base Dark Gradient (Deep Atmosphere) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black z-0"></div>

            {/* 2. The "Glass" Layer (Orange Glow + Blur) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-[50%] -left-[50%] w-[130%] h-[130%] bg-orange-600/30 blur-[80px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute -bottom-[50%] -right-[50%] w-[130%] h-[130%] bg-primary/20 blur-[80px] rounded-full mix-blend-screen"></div>
            </div>

            {/* 3. Glass Surface Texture & Border */}
            <div className="absolute inset-0 z-0 backdrop-blur-[2px] bg-white/5 border border-white/10 rounded-[24px]"></div>

            {/* 4. Glossy Shine (Top-Left) */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50 z-0 pointer-events-none"></div>

            <div className="relative p-6 h-full flex flex-col justify-between z-10">
                {/* Top Row: Logo & Contactless */}
                <div className="flex justify-between items-start">
                    <span className="font-bold text-ashWhite tracking-widest text-xs opacity-80 drop-shadow-md">CHEEZYBITE</span>
                    <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="none" />
                        <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" opacity=".3" />
                        {/* Simple "Wifi" waves shape for contactless feel */}
                        <path d="M12 6c3.31 0 6 2.69 6 6 0 1.33-.42 2.55-1.12 3.56l1.43 1.43C19.39 15.65 20 13.91 20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 1.91.61 3.65 1.69 4.99l1.43-1.43C6.42 14.55 6 13.33 6 12c0-3.31 2.69-6 6-6z" />
                    </svg>
                </div>

                {/* Middle: Number (Glass Text Effect) */}
                <div className="flex flex-col justify-center h-full pl-1">
                    <div className="text-[22px] md:text-[24px] font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-[0.14em] drop-shadow-lg filter whitespace-nowrap">
                        {displayedNumber}
                    </div>
                </div>

                {/* Bottom Row: Name, Date, Brand */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-semibold text-ashWhite/60 uppercase tracking-widest pl-1">Card Holder</div>
                        <div className="text-[13px] font-bold text-ashWhite uppercase tracking-widest truncate max-w-[180px] drop-shadow-md">
                            {name || 'YOUR NAME'}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col items-end mr-1">
                            <div className="text-[9px] font-semibold text-ashWhite/60 uppercase tracking-widest">Expires</div>
                            <div className="text-[13px] font-mono text-ashWhite tracking-widest drop-shadow-md">
                                {expiry || 'MM/YY'}
                            </div>
                        </div>

                        <div className="mt-1">
                            {brand === 'VISA' && (
                                <span className="text-white font-serif font-black italic text-3xl tracking-tighter drop-shadow-lg">VISA</span>
                            )}
                            {brand === 'MASTERCARD' && (
                                <div className="flex items-center relative w-12 opacity-90">
                                    <div className="w-8 h-8 bg-[#EB001B] rounded-full relative z-10 shadow-lg opacity-90 backdrop-blur-sm"></div>
                                    <div className="w-8 h-8 bg-[#F79E1B] rounded-full -ml-4 relative z-20 mix-blend-screen shadow-lg opacity-90 backdrop-blur-sm"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualCard;
