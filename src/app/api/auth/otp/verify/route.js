import dbConnect from '@/lib/dbConnect';
import OtpSession from '@/models/OtpSession';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { errorResponse, successResponse, serverErrorResponse } from '@/lib/apiResponse';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, purpose, code } = await request.json();
        
        console.log('✅ OTP Verify - Email:', email, 'Purpose:', purpose);

        if (!email || !purpose || !code) {
            return errorResponse('Missing fields', null, 400);
        }

        // Find active, unconsumed session
        const session = await OtpSession.findOne({
            email,
            purpose,
            consumedAt: null,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 }); // Get latest

        if (!session) {
            return errorResponse('Invalid or expired OTP', null, 400);
        }

        if (session.attempts >= 5) {
            return errorResponse('Too many attempts. Request a new code.', null, 400);
        }

        // Verify Hash
        const isMatch = await bcrypt.compare(code, session.otpHash);

        if (!isMatch) {
            // Increment attempts
            session.attempts += 1;
            await session.save();
            return errorResponse('Invalid code', null, 400);
        }

        // Success: Mark Consumed
        session.consumedAt = new Date();
        await session.save();

        // If purpose was 'email_verification' or 'signup', update user status
        if (purpose === 'signup' || purpose === 'email_verification' || purpose === 'profile_update') {
            const updatedUser = await User.findOneAndUpdate(
                { email }, 
                { emailVerified: true, verifiedAt: new Date() },
                { new: true }
            ).select('-password -__v').lean();
            
            console.log('✅ User verified:', email);
            
            // Emit real-time event to update admin panel customer status
            if (updatedUser) {
                try {
                    fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'}/internal/emit`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-internal-secret': process.env.INTERNAL_SECRET || 'super-secret-internal-key'
                        },
                        body: JSON.stringify({
                            event: 'customer-updated',
                            room: 'customers',
                            data: {
                                customer: {
                                    _id: updatedUser._id,
                                    name: updatedUser.name,
                                    email: updatedUser.email,
                                    phone: updatedUser.phone,
                                    emailVerified: true,
                                    totalOrders: 0,
                                    totalSpent: 0,
                                    lastOrderDate: null,
                                    status: 'New', // Still 'New' until they place an order
                                    createdAt: updatedUser.createdAt
                                }
                            }
                        })
                    }).catch(err => console.error('Socket emit error:', err.message));
                } catch (e) {
                    // Ignore socket errors
                }
            }
        }

        return successResponse({ verified: true }, 'Verification successful');

    } catch (error) {
        console.error('✅ OTP Verify Error:', error);
        return serverErrorResponse(error);
    }
}
