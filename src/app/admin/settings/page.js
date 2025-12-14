"use client";

import { useAdmin } from '../../context/AdminContext';
import AdminCard from '../../components/admin/AdminCard';
import { User, Lock, Bell, Moon, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { userRole } = useAdmin();

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            {/* Profile Settings */}
            <AdminCard title="Profile Settings" icon={User} variant="blue" className="bg-slate-900/40 border-slate-700/50 from-transparent to-transparent shadow-none">
                <div className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email Address</label>
                            <input
                                type="email"
                                defaultValue="admin@cheezybite.com"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                            />
                        </div>
                    </div>
                </div>
            </AdminCard>

            {/* Security */}
            <AdminCard title="Security" icon={Lock} variant="orange" className="bg-slate-900/40 border-slate-700/50 from-transparent to-transparent shadow-none">
                <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500/10 p-2 rounded-lg">
                                <Shield className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Secure your account with 2FA</p>
                            </div>
                        </div>
                        <button className="text-sm bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg hover:bg-orange-500/20 transition-colors">
                            Enable
                        </button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Change Password</label>
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/50 mb-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/50"
                        />
                    </div>
                </div>
            </AdminCard>

            {/* System Preferences */}
            <AdminCard title="System Preferences" icon={Moon} variant="purple" className="bg-slate-900/40 border-slate-700/50 from-transparent to-transparent shadow-none">
                <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-3 border-b border-white/5">
                        <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive emails for new orders</p>
                        </div>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <p className="text-white font-medium">Sound Alerts</p>
                            <p className="text-xs text-gray-500">Play sound when new order arrives</p>
                        </div>
                        <div className="w-10 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </AdminCard>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
