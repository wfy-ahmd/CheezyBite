/**
 * API Route: Admin Customer Details
 * GET /api/admin/customers/:id - Get customer details with order history
 */

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';
import { authenticate, isAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/apiResponse';

export async function GET(request, { params }) {
    try {
        // Authenticate admin
        const authData = await authenticate(request);
        if (!authData || authData.type !== 'admin') {
            return unauthorizedResponse();
        }

        if (!isAdmin(authData)) {
            return forbiddenResponse();
        }

        await dbConnect();

        const { id } = params;

        // Get customer details (exclude password)
        const customer = await User.findById(id).select('-password -__v').lean();

        if (!customer) {
            return notFoundResponse('Customer');
        }

        // Get customer's orders
        const orders = await Order.find({ userId: id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

        // Get default address
        const defaultAddress = customer.addresses?.find(addr => addr.isDefault) || customer.addresses?.[0] || null;

        return successResponse({
            customer: {
                ...customer,
                totalOrders,
                totalSpent,
                lastOrderDate,
                status: totalOrders === 0 ? 'New' : 'Active'
            },
            defaultAddress,
            recentOrders: orders.slice(0, 10),
            allOrders: orders
        }, 'Customer details fetched successfully');

    } catch (error) {
        console.error('GET /api/admin/customers/:id error:', error);
        return serverErrorResponse(error);
    }
}
// Update a customer
export async function PUT(request, { params }) {
    try {
        const authData = await authenticate(request);
        if (!authData || authData.type !== 'admin' || !isAdmin(authData)) {
            return unauthorizedResponse();
        }

        await dbConnect();
        const { id } = params;
        const body = await request.json();

        // Prevent updating sensitive fields
        delete body.password;
        delete body.email; // Usually email updates require verification, blocking for now to be safe
        delete body._id;

        const updatedCustomer = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).select('-password -__v').lean();

        if (!updatedCustomer) {
            return notFoundResponse('Customer');
        }

        // Recalculate stats for the updated object (to keep UI consistent)
        // We need to fetch orders again or just keep existing stats if not updating them
        // For simplicity, we assume stats don't change on profile update
        // But we need to make sure we return the structure expected by the UI
        const orders = await Order.find({ userId: id }).select('total createdAt').lean();
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

        const completeCustomer = {
            ...updatedCustomer,
            totalOrders,
            totalSpent,
            lastOrderDate,
            status: totalOrders === 0 ? 'New' : 'Active'
        };

        // Emit update event
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
                    data: { customer: completeCustomer }
                })
            }).catch(err => console.error('Socket emit error:', err.message));
        } catch (e) { /* Ignore */ }

        return successResponse(completeCustomer, 'Customer updated successfully');

    } catch (error) {
        console.error('PUT /api/admin/customers/:id error:', error);
        return serverErrorResponse(error);
    }
}

// Delete a customer
export async function DELETE(request, { params }) {
    try {
        const authData = await authenticate(request);
        if (!authData || authData.type !== 'admin' || !isAdmin(authData)) {
            return unauthorizedResponse();
        }

        await dbConnect();
        const { id } = params;

        const deletedCustomer = await User.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return notFoundResponse('Customer');
        }

        // Emit delete event
        try {
            fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'}/internal/emit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_SECRET || 'super-secret-internal-key'
                },
                body: JSON.stringify({
                    event: 'customer-deleted',
                    room: 'customers',
                    data: { customerId: id }
                })
            }).catch(err => console.error('Socket emit error:', err.message));
        } catch (e) { /* Ignore */ }

        return successResponse({ _id: id }, 'Customer deleted successfully');

    } catch (error) {
        console.error('DELETE /api/admin/customers/:id error:', error);
        return serverErrorResponse(error);
    }
}
