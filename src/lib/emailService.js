import { Resend } from 'resend';

// Lazy-initialized Resend client (initialized on first use, not at module load)
let resendClient = null;

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

function getResendClient() {
    // Re-check env var on each call to handle serverless cold starts
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is not set in environment variables');
        return null;
    }
    
    if (apiKey.startsWith('re_123')) {
        console.warn('⚠️ Using placeholder RESEND_API_KEY - emails will not be sent');
        return null;
    }
    
    // Only create client once per runtime (but check env each time)
    if (!resendClient) {
        resendClient = new Resend(apiKey);
        console.log('✅ Resend client initialized successfully');
    }
    
    return resendClient;
}

export const sendEmailCurrent = async (to, subject, html) => {
    try {
        console.log('📬 sendEmailCurrent called - To:', to, 'Subject:', subject);
        console.log('📬 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        console.log('📬 NODE_ENV:', process.env.NODE_ENV);
        
        const resend = getResendClient();
        console.log('📬 Resend client available:', !!resend);
        
        if (!resend) {
            // In development, allow proceeding without email
            if (isDevelopment) {
                console.warn("⚠️ [DEV MODE] Email would be sent to:", to);
                console.warn("⚠️ [DEV MODE] Subject:", subject);
                return { success: true, id: 'dev_mode_' + Date.now(), devMode: true };
            }
            console.error("❌ Cannot send email: RESEND_API_KEY missing or invalid");
            return { 
                success: false, 
                error: 'Email service not configured. Please contact support.' 
            };
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'CheezyBite <onboarding@resend.dev>';
        console.log('📬 Sending from:', fromEmail, 'to:', to);

        const data = await resend.emails.send({
            from: fromEmail,
            to: to,
            subject: subject,
            html: html,
        });

        console.log('📬 Resend API response:', JSON.stringify(data));

        // Resend returns { data: {...}, error: null } on success
        // or { data: null, error: {...} } on failure
        if (data.error) {
            console.error("📬 Resend Error:", JSON.stringify(data.error));
            
            // Common error: "You can only send testing emails to your own email address"
            // This happens with free tier + onboarding@resend.dev
            if (data.error.message?.includes('only send testing emails') || 
                data.error.message?.includes('not verified') ||
                data.error.statusCode === 403) {
                console.error("📬 Resend domain restriction - free tier can only send to verified email");
                
                // In development, allow proceeding
                if (isDevelopment) {
                    console.warn("⚠️ [DEV MODE] Bypassing Resend restriction for testing");
                    return { success: true, id: 'dev_bypass_' + Date.now(), devMode: true };
                }
            }
            
            return { success: false, error: data.error.message || 'Failed to send email' };
        }

        return { success: true, data: data.data };
    } catch (error) {
        console.error("📬 Email Service Error:", error.message || error);
        
        // In development, allow proceeding even on error
        if (isDevelopment) {
            console.warn("⚠️ [DEV MODE] Email failed but allowing to proceed for testing");
            return { success: true, id: 'dev_error_bypass_' + Date.now(), devMode: true };
        }
        
        return { success: false, error: error.message || 'Email service error' };
    }
};

export const sendOTP = async (email, otp) => {
    // In development, always log the OTP to console for testing
    if (isDevelopment) {
        console.log('');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║  🔐 [DEV MODE] OTP CODE FOR TESTING                        ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║  Email: ${email.padEnd(49)}║`);
        console.log(`║  OTP:   ${otp.padEnd(49)}║`);
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('');
    }
    
    const htmlKey = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF8c00;">CheezyBite Verification</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px; background: #eee; padding: 10px; text-align: center; border-radius: 8px;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
    </div>
    `;
    return sendEmailCurrent(email, 'Your CheezyBite Verification Code', htmlKey);
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const htmlKey = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF8c00;">Reset Your Password</h1>
        <p>You requested a password reset for your CheezyBite account.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="background: #FF8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
    </div>
    `;
    return sendEmailCurrent(email, 'Reset Your CheezyBite Password', htmlKey);
};
