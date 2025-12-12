/**
 * useCartSync Hook - Cross-Tab Cart Synchronization
 * Syncs cart state across multiple browser tabs using storage events
 */

"use client"

import { useEffect, useRef } from 'react';

/**
 * Hook to sync cart across browser tabs
 * @param {Array} cart - Current cart state
 * @param {Function} setCart - Function to update cart state
 */
export function useCartSync(cart, setCart) {
    const isUpdatingRef = useRef(false);

    useEffect(() => {
        // Handler for storage events (fired when localStorage changes in another tab)
        const handleStorageChange = (e) => {
            // Only handle cart updates
            if (e.key !== 'cheezybite_cart') return;

            // Prevent infinite loops
            if (isUpdatingRef.current) return;

            try {
                const newCart = e.newValue ? JSON.parse(e.newValue) : [];

                // Only update if cart actually changed
                if (JSON.stringify(newCart) !== JSON.stringify(cart)) {
                    isUpdatingRef.current = true;
                    setCart(newCart);

                    // Reset flag after update
                    setTimeout(() => {
                        isUpdatingRef.current = false;
                    }, 100);
                }
            } catch (error) {
                console.error('Error syncing cart across tabs:', error);
            }
        };

        // Listen for storage events
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [cart, setCart]);
}

export default useCartSync;
