"use client";

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { authService } from '../../services/authService';
import Link from 'next/link';
import toast from 'react-hot-toast';

const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        position: 'relative',
        inset: 'auto',
        border: 'none',
        background: 'none',
        padding: 0,
        overflow: 'visible'
    }
};

if (typeof window !== 'undefined') {
    Modal.setAppElement('body');
}

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loginWithGoogle } = useUser();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            // LOGIN FLOW
            const result = await login(formData.email, formData.password);
            if (result.success) {
                if (onSuccess) onSuccess();
                onClose();
            } else if (result.requireVerification) {
                // Still has unverified account (legacy) - redirect to login
                toast.error('Please verify your email first');
            }
        } else {
            // SIGNUP FLOW - Direct registration
            try {
                const result = await register(formData.name, formData.email, formData.password, formData.phone);

                if (result.success) {
                    // User is created and active - switch to login
                    setIsLogin(true);
                    toast.success('Please log in with your credentials');
                }
            } catch (error) {
                // Handle "User already exists" (409)
                if (error.status === 409 || error.message?.includes('already exists')) {
                    toast.success("Account already exists. Please log in.", { icon: '👋' });
                    setIsLogin(true);
                } else {
                    console.error("Registration failed", error);
                    toast.error(error.message || "Registration failed");
                }
            }
        }
        setIsLoading(false);
    };




    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            contentLabel="Auth Modal"
            className="outline-none"
        >
            <div className="bg-softBlack w-[90vw] max-w-md p-8 rounded-2xl border border-cardBorder shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-ashWhite/40 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-ashWhite mb-1">
                        {isLogin ? 'Login Required' : 'Join CheezyBite'}
                    </h2>
                    <p className="text-ashWhite/60 text-sm">
                        {isLogin ? 'Please log in to place your order' : 'Create an account to continue'}
                    </p>
                </div>

                {/* Social Auth and Divider */}
                <div className="space-y-4 mb-6">
                    <button
                        onClick={async () => {
                            const success = await loginWithGoogle();
                            if (success) {
                                if (onSuccess) onSuccess();
                                onClose();
                            }
                        }}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-cardBorder"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-softBlack px-2 text-ashWhite/40">Or continue with email</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ashWhite/50 w-5 h-5" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full bg-charcoalBlack border border-cardBorder rounded-xl pl-12 pr-4 py-3 text-ashWhite focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    )}
                    {!isLogin && (
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ashWhite/50 w-5 h-5" />
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                placeholder="Phone Number (07XXXXXXXX)"
                                pattern="^(\+94|0)7\d{8}$"
                                title="Please enter a valid Sri Lankan phone number (07XXXXXXXX or +947XXXXXXXX)"
                                className="w-full bg-charcoalBlack border border-cardBorder rounded-xl pl-12 pr-4 py-3 text-ashWhite focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ashWhite/50 w-5 h-5" />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-charcoalBlack border border-cardBorder rounded-xl pl-12 pr-4 py-3 text-ashWhite focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ashWhite/50 w-5 h-5" />
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full bg-charcoalBlack border border-cardBorder rounded-xl pl-12 pr-4 py-3 text-ashWhite focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>

                    {isLogin && (
                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                onClick={onClose}
                                className="text-sm text-ashWhite/60 hover:text-primary transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button disabled={isLoading} type="submit" className="w-full btn btn-lg bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
                        {isLoading ? 'Processing...' : (isLogin ? 'Login & Continue' : 'Sign Up & Continue')}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="text-center mt-6 text-ashWhite/70 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;
