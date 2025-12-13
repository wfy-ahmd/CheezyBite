"use client";

import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldAlert, UserCheck, UserX, Clock, Shield } from 'lucide-react';

export default function AdminUsersPage() {
    const { admins, toggleAdminStatus, userRole } = useAdmin();

    // Only Sort of Redundant since Layout handles it, but good for safety
    if (userRole !== 'Super Admin') {
        return (
            <div className="flex items-center justify-center h-64 text-ashWhite/50">
                Access Denied
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ashWhite flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                        Admin Users
                    </h1>
                    <p className="text-ashWhite/60 mt-1">Manage system administrators and access control</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg text-sm text-ashWhite/70 border border-white/5">
                    Total Admins: <span className="text-ashWhite font-bold ml-1">{admins.length}</span>
                </div>
            </div>

            <div className="bg-charcoalBlack rounded-xl border border-cardBorder overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-cardBorder">
                                <th className="px-6 py-4 text-xs font-bold text-ashWhite/50 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-ashWhite/50 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-ashWhite/50 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-ashWhite/50 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-bold text-ashWhite/50 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cardBorder">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-ashWhite border border-cardBorder">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-ashWhite">{admin.username}</div>
                                                <div className="text-xs text-ashWhite/40">ID: {admin.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.role === 'Super Admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-md border border-primary/20">
                                                <ShieldAlert className="w-3 h-3" />
                                                Super Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-md border border-blue-500/20">
                                                <UserCheck className="w-3 h-3" />
                                                Manager
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.isActive ? (
                                            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-red-400 text-sm font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-ashWhite/60 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-ashWhite/30" />
                                            {admin.lastLogin
                                                ? new Date(admin.lastLogin).toLocaleString()
                                                : <span className="text-ashWhite/20">Never</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleAdminStatus(admin.id)}
                                            // Prevent disabling 'admin' or 'super admin' role in a real app, 
                                            // but specifically here let's prevent disabling the MAIN admin "1" to avoid lockouts.
                                            disabled={admin.id === 1}
                                            className={`
                                                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
                                                ${admin.isActive ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-red-500/80 hover:bg-red-500'}
                                                ${admin.id === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`
                                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                                    ${admin.isActive ? 'translate-x-5' : 'translate-x-0'}
                                                `}
                                            />
                                        </button>
                                        <div className="text-[10px] text-ashWhite/30 mt-1 mr-1">
                                            {admin.isActive ? 'Disable' : 'Enable'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <h4 className="font-semibold text-blue-400 mb-1">Security Note</h4>
                    <p className="text-ashWhite/60">
                        Disabling an admin will immediately prevent them from logging in.
                        Active sessions for disabled users will be invalidated upon their next page refresh or action.
                    </p>
                </div>
            </div>
        </div>
    );
}
