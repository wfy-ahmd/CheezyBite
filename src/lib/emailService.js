import { Resend } from 'resend';

// Lazy-initialized Resend client (initialized on first use, not at module load)
let resendClient = null;

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
        
        const resend = getResendClient();
        console.log('📬 Resend client available:', !!resend);
        
        if (!resend) {
            // In production, this is a real error - don't pretend success
            console.error("❌ Cannot send email: RESEND_API_KEY missing or invalid");
            return { 
                success: false, 
                error: 'Email service not configured. Please contact support.' 
            };
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'CheezyBite <onboarding@resend.dev>';
        console.log('📬 Sending from:', fromEmail);

        const data = await resend.emails.send({
            from: fromEmail,
            to: to,
            subject: subject,
            html: html,
        });

        console.log('📬 Resend API response:', JSON.stringify(data));

        if (data.error) {
            console.error("📬 Resend Error:", data.error);
            return { success: false, error: data.error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("📬 Email Service Error:", error.message || error);
        return { success: false, error: error.message || error };
    }
};

export const sendOTP = async (email, otp) => {
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
