import React from 'react';
import MenuClient from './MenuClient';
import { getPizzas } from '../../utils/pizzaStore';

export const metadata = {
    title: 'Menu | CheezyBite',
    description: 'Explore our delicious pizza menu.',
};

// import { getPizzas } from '../../utils/pizzaStore';
import { headers } from 'next/headers';

async function getData() {
    try {
        // For server-side rendering, use VERCEL_URL in production or localhost in dev
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}/api`
            : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');

        const [pizzasRes, toppingsRes] = await Promise.all([
            fetch(`${baseUrl}/pizzas`, { cache: 'no-store' }),
            fetch(`${baseUrl}/toppings`, { cache: 'no-store' })
        ]);

        if (!pizzasRes.ok || !toppingsRes.ok) throw new Error('Failed to fetch menu data');

        const pizzasData = await pizzasRes.json();
        const toppingsData = await toppingsRes.json();

        const pizzas = pizzasData.success ? pizzasData.data : [];
        const toppings = toppingsData.success ? toppingsData.data : [];

        // Inject all active toppings into every pizza (Legacy Behavior: "Build your own" style)
        // Or if we want specific toppings per pizza, we would filter by pizza.toppingIds
        // Based on pizzaStore.js: "return pizzas.map(pizza => ({ ...pizza, toppings: activeToppings }));"
        // So we attach ALL enabled toppings to every pizza for customization.

        const activeToppings = toppings.filter(t => t.enabled);

        const pizzasWithToppings = pizzas.map(pizza => ({
            ...pizza,
            toppings: activeToppings
        }));

        return pizzasWithToppings;

    } catch (error) {
        console.error('Error fetching menu data:', error);
        return [];
    }
}

export default async function MenuPage() {
    const pizzas = await getData();
    return <MenuClient initialPizzas={pizzas} />;
}
