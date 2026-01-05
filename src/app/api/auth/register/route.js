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

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user (Unverified initially)
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            phone: phone || '',
            emailVerified: false,
            addresses: []
        });

        // Emit real-time event for admin dashboard (New Customer)
        // We use a non-blocking fetch to the local socket server
        try {
            fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'}/internal/emit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_SECRET || 'super-secret-internal-key'
                },
                body: JSON.stringify({
                    event: 'customer-added', // Frontend listens for this
                    room: 'customers',       // Admin customers page listens to this room
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

        return successResponse(
            {
                userId: user._id,
                email: user.email,
                requireVerification: true
            },
            'Account created. Please verify your email.',
            201
        );

    } catch (error) {
        return serverErrorResponse(error);
    }
}
