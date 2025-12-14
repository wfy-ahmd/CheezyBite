"use client";

import { useAdmin } from '../../context/AdminContext';
import AdminCard from '../../components/admin/AdminCard';
import { Bell, ShoppingBag, AlertTriangle, CheckCircle, Info, Star } from 'lucide-react';

export default function NotificationsPage() {
    // Mock notifications for now - in a real app these would come from the backend/context
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'Order #O-7821 has been placed by Ruwan Perera.',
            time: '2 mins ago',
            read: false,
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            id: 2,
            type: 'review',
            title: 'New 5-Star Rating',
            message: 'Fatima Rimzan left a 5-star review on "Cheezy Bliss".',
            time: '1 hour ago',
            read: true,
            icon: Star,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            id: 3,
            type: 'alert',
            title: 'Low Stock Alert',
            message: 'Topping "Olives" is running low on inventory.',
            time: '3 hours ago',
            read: true,
            icon: AlertTriangle,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            id: 4,
            type: 'system',
            title: 'System Update',
            message: 'Dashboard successfully updated to v2.5.0.',
            time: 'Yesterday',
            read: true,
            icon: Info,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            id: 5,
            type: 'success',
            title: 'Goal Reached',
            message: 'Congratulations! You reached 100 orders this week.',
            time: '2 days ago',
            read: true,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        }
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400 text-sm">You have 1 unread notification</p>
                </div>
                <button className="text-sm text-primary hover:text-primaryHover transition-colors">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`
                            relative flex items-start gap-4 p-4 rounded-xl border transition-all
                            ${notif.read ? 'bg-slate-900/40 border-slate-700/30' : 'bg-slate-800/60 border-primary/30 shadow-lg shadow-primary/5'}
                        `}
                    >
                        {/* Unread Indicator */}
                        {!notif.read && (
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        )}

                        <div className={`p-3 rounded-lg ${notif.bg}`}>
                            <notif.icon className={`w-6 h-6 ${notif.color}`} />
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-semibold ${notif.read ? 'text-gray-200' : 'text-white'}`}>
                                {notif.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <button className="text-sm text-gray-500 hover:text-white transition-colors">
                    View older notifications
                </button>
            </div>
        </div>
    );
}
