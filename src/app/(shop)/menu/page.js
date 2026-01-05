import React from 'react';
import MenuClient from './MenuClient';
import dbConnect from '@/lib/dbConnect';
import Pizza from '@/models/Pizza';
import Topping from '@/models/Topping';

export const metadata = {
    title: 'Menu | CheezyBite',
    description: 'Explore our delicious pizza menu.',
};

async function getData() {
    try {
        await dbConnect();
        
        // Fetch directly from database - no HTTP calls needed
        const [pizzas, toppings] = await Promise.all([
            Pizza.find({ enabled: true }).sort({ createdAt: -1 }).lean(),
            Topping.find({ enabled: true }).lean()
        ]);

        // Convert MongoDB documents to plain objects with string IDs
        const activeToppings = toppings.map(t => ({ ...t, _id: t._id.toString() }));

        const pizzasWithToppings = pizzas.map(pizza => ({
            ...pizza,
            _id: pizza._id.toString(),
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
