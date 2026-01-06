import { Resend } from 'resend';

// Lazy-initialized Resend client (initialized on first use, not at module load)
let resendClient = null;
let cachedApiKey = null;

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

function getResendClient() {
    // Get API key from environment
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is not set in environment variables');
        console.error('❌ Please add RESEND_API_KEY to your .env.local or Vercel environment');
        return null;
    }

    if (apiKey.startsWith('re_123')) {
        console.warn('⚠️ Using placeholder RESEND_API_KEY - emails will not be sent');
        return null;
    }

    // Recreate client if API key changed (handles env var updates)
    if (!resendClient || cachedApiKey !== apiKey) {
        resendClient = new Resend(apiKey);
        cachedApiKey = apiKey;
        console.log('✅ Resend client initialized successfully');
    }

    return resendClient;
}

export const sendEmailCurrent = async (to, subject, html) => {
    try {
        console.log('📬 sendEmailCurrent called - To:', to, 'Subject:', subject);
        console.log('📬 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        console.log('📬 NODE_ENV:', process.env.NODE_ENV);
        console.log('📬 VERCEL:', process.env.VERCEL || 'not set');
        console.log('📬 VERCEL_ENV:', process.env.VERCEL_ENV || 'not set');

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
            console.error("📬 Resend API Error Details:");
            console.error("   - Message:", data.error.message);
            console.error("   - Status Code:", data.error.statusCode);
            console.error("   - Name:", data.error.name);
            console.error("   - Full Error:", JSON.stringify(data.error));

            // Common error: "You can only send testing emails to your own email address"
            // This happens with free tier + onboarding@resend.dev
            if (data.error.message?.includes('only send testing emails') ||
                data.error.message?.includes('not verified') ||
                data.error.statusCode === 403) {
                console.error("📬 ⚠️ RESEND FREE TIER RESTRICTION DETECTED");
                console.error("   - You're using onboarding@resend.dev (test domain)");
                console.error("   - Free tier can only send to YOUR verified email");
                console.error("   - Solution: Set RESEND_FROM_EMAIL to your verified email in Vercel env vars");

                // In development, allow proceeding
                if (isDevelopment) {
                    console.warn("⚠️ [DEV MODE] Bypassing Resend restriction for testing");
                    return { success: true, id: 'dev_bypass_' + Date.now(), devMode: true };
                }
            }

            // Rate limit errors
            if (data.error.statusCode === 429 || data.error.message?.includes('rate limit')) {
                console.error("📬 ⚠️ RATE LIMIT EXCEEDED");
                console.error("   - Resend free tier has limits");
                console.error("   - Wait before trying again or upgrade plan");
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

export const sendOrderConfirmationEmail = async (recipientEmail, orderDetails) => {
    const { orderId, items, total, address, estimatedDeliveryTime } = orderDetails;

    // Build items list HTML
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.name} (${item.size}, ${item.crust})
                ${item.additionalTopping && item.additionalTopping.length > 0
            ? `<br><small style="color: #666;">+ ${item.additionalTopping.map(t => t.name).join(', ')}</small>`
            : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.amount}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
    `).join('');

    const deliveryTime = estimatedDeliveryTime
        ? new Date(estimatedDeliveryTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '30-45 minutes';

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #FF8c00; margin: 0 0 10px;">Order Confirmed! 🍕</h1>
            <p style="color: #666; margin: 0 0 20px;">Thank you for your order from CheezyBite!</p>
            
            <div style="background: #fff7ed; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
                <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #FF8c00;">${orderId}</p>
            </div>

            <h2 style="color: #333; font-size: 18px; margin: 20px 0 10px;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 10px; text-align: left; font-size: 14px; font-weight: 600;">Item</th>
                        <th style="padding: 10px; text-align: center; font-size: 14px; font-weight: 600;">Qty</th>
                        <th style="padding: 10px; text-align: right; font-size: 14px; font-weight: 600;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
                        <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #FF8c00;">$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <h2 style="color: #333; font-size: 18px; margin: 20px 0 10px;">Delivery Information</h2>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0 0 5px; font-weight: 600;">${address?.label || 'Delivery Address'}</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${address?.street || ''}</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${address?.area ? address.area + ', ' : ''}${address?.city || ''}</p>
                <p style="margin: 10px 0 0; color: #666; font-size: 14px;">📞 ${address?.phone || ''}</p>
            </div>

            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2e7d32;">⏱️ Estimated Delivery</p>
                <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #1b5e20;">${deliveryTime}</p>
            </div>

            <p style="color: #999; font-size: 12px; margin: 20px 0 0; text-align: center;">
                We're preparing your delicious pizzas! You'll receive updates as your order progresses.
            </p>
        </div>
        
        <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            © CheezyBite - Your favorite pizza delivered hot and fresh
        </p>
    </div>
    `;

    return sendEmailCurrent(recipientEmail, `Order Confirmed - ${orderId}`, htmlContent);
};

