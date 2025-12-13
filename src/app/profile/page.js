'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, Package, Heart, LogOut, Edit2, Save, Phone, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ... imports
import { useCart } from '../context/CartContext';
import { RotateCw, CheckCircle, Clock } from 'lucide-react'; // Add icons

export default function ProfilePage() {
    const { user, logout, updateUser } = useUser();
    const { addToCart } = useCart(); // Get addToCart
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState([]); // Orders State

    // ... existing formData state ...

    // Fetch Orders
    useEffect(() => {
        if (!user) return;

        // Mock API call -> Read from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('cheezybite_orders') || '[]');
        // Sort by date desc (assuming ID is timestamp based or strict Date field if added)
        // For now, reverse to show newest first
        setOrders(storedOrders.reverse());
    }, [user]);

    const handleReorder = (order) => {
        order.items.forEach(item => {
            // Re-construct cart item structure if needed, or pass strict object
            // cartItem expects: { id, name, price, size, crust, toppings, additionalTopping, image }
            addToCart({
                ...item,
                price: item.price // ensure price is passed
            });
        });
        toast.success("Order items added to cart!", { icon: '🛒' });
        router.push('/cart');
    };

    // ... existing handleSave ...

    // ... inside return ...

    <h2 className="text-2xl font-bold text-ashWhite pt-4">Recent Orders</h2>

    {
        orders.length > 0 ? (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-softBlack rounded-2xl p-6 border border-cardBorder hover:border-primary/30 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-ashWhite text-lg">Order #{order.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${order.currentStage >= 4 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                        {order.currentStage >= 4 ? 'Delivered' : 'In Progress'}
                                    </span>
                                </div>
                                <p className="text-ashWhite/40 text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(parseInt(order.id)).toLocaleDateString()} • {new Date(parseInt(order.id)).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-ashWhite font-bold">Rs. {order.total.toLocaleString()}</div>
                                    <div className="text-xs text-ashWhite/40">{order.items.length} items</div>
                                </div>
                                <button
                                    onClick={() => handleReorder(order)}
                                    className="bg-white/5 hover:bg-primary hover:text-white text-ashWhite/60 p-3 rounded-xl transition-all border border-white/5 group-hover:border-primary/30"
                                    title="Re-order"
                                >
                                    <RotateCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Items Preview (First 2) */}
                        <div className="space-y-2 border-t border-white/5 pt-4">
                            {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm text-ashWhite/70">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                                        {item.amount}x {item.name} <span className="text-white/30 text-xs">({item.size})</span>
                                    </span>
                                </div>
                            ))}
                            {order.items.length > 2 && (
                                <p className="text-xs text-ashWhite/30 pl-3">+ {order.items.length - 2} more items...</p>
                            )}
                        </div>

                        {/* Link to Tracking */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                            {order.currentStage < 4 && (
                                <Link href={`/order/${order.id}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                    Track Order <Package className="w-3 h-3" />
                                </Link>
                            )}
                            {order.currentStage >= 4 && order.feedback && (
                                <div className="text-xs text-yellow-500 flex items-center gap-1">
                                    ★ Rated {order.feedback.rating}/5
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
        <div className="bg-softBlack rounded-2xl p-8 border border-cardBorder text-center">
            <Package className="w-12 h-12 text-ashWhite/20 mx-auto mb-4" />
            <h3 className="text-ashWhite font-bold">No orders yet</h3>
            <p className="text-ashWhite/50 text-sm mt-1">Simulate an order to see it here!</p>
        </div>
    )
    }

                </div >
            </div >
        </div >
    );
}
