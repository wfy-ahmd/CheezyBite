/**
 * API Route: User Registration
 * POST /api/auth/register
 */

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import OtpSession from '@/models/OtpSession';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateUserRegistration } from '@/lib/validators';
import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '@/lib/apiResponse';
import { sendRegistrationOTP } from '@/lib/registrationEmailService';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();
        const { email, password, name, phone } = body;

        // Validate input
        const validation = validateUserRegistration(body);
        if (!validation.isValid) {
            return validationErrorResponse(validation.errors);
        }

        // Connect to database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return errorResponse('User with this email already exists', null, 409);
        }

        console.log('🔐 [REGISTRATION] Starting atomic registration for:', email);

        // ====================================================================
        // ATOMIC REGISTRATION: Generate and send OTP BEFORE creating user
        // This prevents dead-lock states where user exists but email failed
        // ====================================================================

        // Step 1: Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔐 [REGISTRATION] OTP generated for:', email);

        // Step 2: Hash OTP for storage
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);

        // Step 3: Send OTP email (CRITICAL - must succeed before user creation)
        console.log('📧 [REGISTRATION] Environment check:');
        console.log('📧   - RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
        console.log('📧   - RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'using default');
        console.log('📧   - NODE_ENV:', process.env.NODE_ENV);
        console.log('📧 [REGISTRATION] Attempting to send OTP email to:', email);

        const emailResult = await sendRegistrationOTP(email, otp);

        console.log('📧 [REGISTRATION] Email send result:', JSON.stringify(emailResult));
        console.log('📧   - Success:', emailResult.success);
        console.log('📧   - Error:', emailResult.error || 'none');
        console.log('📧   - Dev Mode:', emailResult.devMode || false);

        // Step 4: Check if email sending succeeded
        if (!emailResult.success) {
            console.error('❌ [REGISTRATION] OTP email failed - aborting user creation');
            console.error('❌ [REGISTRATION] Error details:', emailResult.error);
            console.error('❌ [REGISTRATION] Check Vercel env vars: RESEND_API_KEY must be set');
            return errorResponse(
                'Failed to send verification email. Please try again.',
                { error: emailResult.error },
                500
            );
        }

        console.log('✅ [REGISTRATION] OTP email sent successfully');
        if (emailResult.devMode) {
            console.log('⚠️  [REGISTRATION] Running in DEV MODE - email not actually sent');
        }

        // Step 5: Store OTP session (valid for 5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await OtpSession.create({
            email: email.toLowerCase(),
            purpose: 'signup',
            otpHash,
            expiresAt
        });
        console.log('✅ [REGISTRATION] OTP session created');

        // Step 6: Hash password
        const hashedPassword = await hashPassword(password);

        // Step 7: ONLY NOW create user (email already succeeded)
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            phone: phone || '',
            emailVerified: false,
            addresses: []
        });

        console.log('✅ [REGISTRATION] User created successfully:', user._id);

        // Step 8: Emit real-time event for admin dashboard (New Customer)
        // Non-blocking - don't fail registration if socket fails
        try {
            fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'}/internal/emit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_SECRET || 'super-secret-internal-key'
                },
                body: JSON.stringify({
                    event: 'customer-added',
                    room: 'customers',
                    data: {
                        customer: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            totalOrders: 0,
                            totalSpent: 0,
                            lastOrderDate: null,
                            status: 'New',
                            emailVerified: false,
                            createdAt: user.createdAt
                        }
                    }
                })
            }).catch(err => console.error('Socket emit error:', err.message));
        } catch (e) {
            // Ignore socket errors, don't block registration
        }

        console.log('✅ [REGISTRATION] Atomic registration complete - user created and OTP sent');

        return successResponse(
            {
                userId: user._id,
                email: user.email,
                requireVerification: true
            },
            'Account created. Please check your email for verification code.',
            201
        );

    } catch (error) {
        return serverErrorResponse(error);
    }
}
