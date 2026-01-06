/**
 * ISOLATED Registration OTP Email Service
 * 
 * This service is SEPARATE from the main emailService.js
 * It uses RESEND_REGISTER_API_KEY exclusively for registration OTP emails
 * 
 * DO NOT use this service for:
 * - Order confirmation emails
 * - Password reset emails
 * - Any other email type
 */

import { Resend } from 'resend';

// Dedicated Resend client for registration OTP only
let registrationResendClient = null;
let cachedRegisterApiKey = null;

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get Resend client ONLY for registration OTP
 * This is isolated from main email service
 */
function getRegistrationResendClient() {
    // Get registration-specific API key from environment
    const apiKey = process.env.RESEND_REGISTER_API_KEY;

    if (!apiKey) {
        console.error('❌ [REGISTRATION] RESEND_REGISTER_API_KEY is not set in environment variables');
        console.error('❌ [REGISTRATION] Please add RESEND_REGISTER_API_KEY to your .env.local or Vercel environment');
        return null;
    }

    // Recreate client if API key changed
    if (!registrationResendClient || cachedRegisterApiKey !== apiKey) {
        registrationResendClient = new Resend(apiKey);
        cachedRegisterApiKey = apiKey;
        console.log('✅ [REGISTRATION] Resend client initialized for registration OTP');
    }

    return registrationResendClient;
}

/**
 * Send Registration OTP Email
 * This function is ONLY for customer registration OTP
 * 
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<{success: boolean, data?: any, error?: string, devMode?: boolean}>}
 */
export const sendRegistrationOTP = async (email, otp) => {
    try {
        console.log('📧 [REGISTRATION OTP] Preparing to send OTP to:', email);
        console.log('📧 [REGISTRATION OTP] RESEND_REGISTER_API_KEY exists:', !!process.env.RESEND_REGISTER_API_KEY);
        console.log('📧 [REGISTRATION OTP] NODE_ENV:', process.env.NODE_ENV);
        console.log('📧 [REGISTRATION OTP] VERCEL:', process.env.VERCEL || 'not set');

        // In development, log the OTP to console
        if (isDevelopment) {
            console.log('');
            console.log('╔════════════════════════════════════════════════════════════╗');
            console.log('║  🔐 [REGISTRATION OTP] DEV MODE                            ║');
            console.log('╠════════════════════════════════════════════════════════════╣');
            console.log(`║  Email: ${email.padEnd(49)}║`);
            console.log(`║  OTP:   ${otp.padEnd(49)}║`);
            console.log('╚════════════════════════════════════════════════════════════╝');
            console.log('');
        }

        const resend = getRegistrationResendClient();
        console.log('📧 [REGISTRATION OTP] Resend client available:', !!resend);

        if (!resend) {
            // In development, allow proceeding without email
            if (isDevelopment) {
                console.warn("⚠️ [REGISTRATION OTP DEV MODE] Email would be sent to:", email);
                return { success: true, id: 'dev_mode_' + Date.now(), devMode: true };
            }
            console.error("❌ [REGISTRATION OTP] Cannot send email: RESEND_REGISTER_API_KEY missing");
            return {
                success: false,
                error: 'Registration email service not configured. Please contact support.'
            };
        }

        // Email from address
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'CheezyBite <onboarding@resend.dev>';
        console.log('📧 [REGISTRATION OTP] Sending from:', fromEmail);

        // Build HTML email template
        const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF8c00;">CheezyBite Verification</h1>
            <p>Your verification code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; background: #eee; padding: 10px; text-align: center; border-radius: 8px;">${otp}</h2>
            <p>This code will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
        `;

        // Send email via Resend
        const data = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Your CheezyBite Verification Code',
            html: htmlContent,
        });

        console.log('📧 [REGISTRATION OTP] Resend API response:', JSON.stringify(data));

        // Check for errors
        if (data.error) {
            console.error("❌ [REGISTRATION OTP] Resend API Error:");
            console.error("   - Message:", data.error.message);
            console.error("   - Status Code:", data.error.statusCode);
            console.error("   - Name:", data.error.name);

            // Common errors
            if (data.error.message?.includes('only send testing emails') ||
                data.error.message?.includes('not verified') ||
                data.error.statusCode === 403) {
                console.error("⚠️ [REGISTRATION OTP] RESEND FREE TIER RESTRICTION");
                console.error("   - Using test domain onboarding@resend.dev");
                console.error("   - Can only send to your verified email");
                console.error("   - Solution: Verify custom domain in Resend");

                // In development, allow proceeding
                if (isDevelopment) {
                    console.warn("⚠️ [REGISTRATION OTP DEV MODE] Bypassing restriction");
                    return { success: true, id: 'dev_bypass_' + Date.now(), devMode: true };
                }
            }

            return { success: false, error: data.error.message || 'Failed to send registration email' };
        }

        console.log('✅ [REGISTRATION OTP] Email sent successfully!');
        return { success: true, data: data.data };

    } catch (error) {
        console.error("❌ [REGISTRATION OTP] Exception:", error.message || error);

        // In development, allow proceeding even on error
        if (isDevelopment) {
            console.warn("⚠️ [REGISTRATION OTP DEV MODE] Error but allowing to proceed");
            return { success: true, id: 'dev_error_bypass_' + Date.now(), devMode: true };
        }

        return { success: false, error: error.message || 'Registration email service error' };
    }
};
