import React from 'react';
import { notFound } from 'next/navigation';
import PizzaClient from './PizzaClient';
import dbConnect from '@/lib/dbConnect';
import Pizza from '@/models/Pizza';
import Topping from '@/models/Topping';
import mongoose from 'mongoose';

async function getData(id) {
    try {
        await dbConnect();
        
        // Try to find by MongoDB ObjectId first, then by numeric id
        let pizza;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pizza = await Pizza.findById(id).lean();
        }
        if (!pizza) {
            pizza = await Pizza.findOne({ id: parseInt(id) }).lean();
        }
        
        if (!pizza) return null;

        const toppings = await Topping.find({ enabled: true }).lean();

        // Convert to plain objects with string IDs
        const activeToppings = toppings.map(t => ({ ...t, _id: t._id.toString() }));

        return {
            ...pizza,
            _id: pizza._id.toString(),
            toppings: activeToppings
        };

    } catch (error) {
        console.error('Error fetching pizza data:', error);
        return null;
    }
}

export default async function PizzaPage({ params }) {
    const { id } = await params;
    const pizza = await getData(id);

    if (!pizza) {
        notFound();
    }

    return <PizzaClient pizza={pizza} />;
}
