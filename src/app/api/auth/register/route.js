/**
 * API Route: User Registration
 * POST /api/auth/register
 */

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { validateUserRegistration } from '@/lib/validators';
import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '@/lib/apiResponse';

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

        console.log('🔐 [REGISTRATION] Starting direct registration for:', email);

        // ====================================================================
        // DIRECT REGISTRATION: No OTP verification required
        // Users are created as Active and verified immediately
        // ====================================================================

        // Step 1: Hash password
        const hashedPassword = await hashPassword(password);

        // Step 2: Create user immediately as Active and verified
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            phone: phone || '',
            emailVerified: true,        // Immediately verified (no OTP required)
            verifiedAt: new Date(),     // Set verification timestamp
            status: 'Active',           // Active status for admin panel
            addresses: []
        });

        console.log('✅ [REGISTRATION] User created successfully:', user._id);

        // Step 3: Emit real-time event for admin dashboard (New Customer - Active & Verified)
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
                            status: 'Active',           // Active immediately
                            emailVerified: true,         // Verified immediately
                            verifiedAt: user.verifiedAt,
                            createdAt: user.createdAt
                        }
                    }
                })
            }).catch(err => console.error('Socket emit error:', err.message));
        } catch (e) {
            // Ignore socket errors, don't block registration
        }

        console.log('✅ [REGISTRATION] Direct registration complete - user is Active and verified');

        return successResponse(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            'Account created successfully! You can now log in.',
            201
        );

    } catch (error) {
        return serverErrorResponse(error);
    }
}
