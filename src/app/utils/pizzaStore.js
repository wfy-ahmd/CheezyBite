import fs from 'fs';
import path from 'path';

export function getPizzas() {
    // 1. Read and Sort Images (Deterministic)
    const pizzaDir = path.join(process.cwd(), 'public/pizza');
    let images = [];
    try {
        const filenames = fs.readdirSync(pizzaDir);
        images = filenames
            .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .sort(); // Sort ensures stability across reloads
    } catch (e) {
        console.error("Error reading pizza directory:", e);
        // Fallback if directory fails
        images = ['default_pizza.jpg'];
    }

    // 2. Define Source of Truth Data
    const products = [
        {
            id: 'fire-pepper-chicken',
            name: 'Fire Pepper Chicken',
            description: 'Smoky grilled chicken, crushed pepper, and mozzarella on a soft hand-tossed base.',
            priceSm: 1400,
            priceMd: 1800,
            priceLg: 2400,
            rating: 4.8,
            ratingCount: 1200,
            tags: ['Popular', 'Spicy'],
            toppings: [
                { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
                { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
                { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
            ]
        },
        {
            id: 'classic-cheese-melt',
            name: 'Classic Cheese Melt',
            description: 'A rich blend of mozzarella and cheddar, baked until golden and stretchy.',
            priceSm: 1200,
            priceMd: 1600,
            priceLg: 2100,
            rating: 4.6,
            ratingCount: 980,
            tags: ['Cheesy'],
            toppings: [
                { image: '/parmesan.png', name: 'parmesan', price: 180 },
                { image: '/corn.png', name: 'corn', price: 120 },
            ]
        },
        {
            id: 'triple-cheese-burst',
            name: 'Triple Cheese Burst',
            description: 'Mozzarella, cream cheese, and parmesan layered for ultimate cheese lovers.',
            priceSm: 1600,
            priceMd: 2100,
            priceLg: 2800,
            rating: 4.7,
            ratingCount: 860,
            tags: ['Extra Cheesy', 'Popular'],
            toppings: [
                { image: '/parmesan.png', name: 'parmesan', price: 180 },
            ]
        },
        {
            id: 'garden-crunch',
            name: 'Garden Crunch',
            description: 'Fresh capsicum, onion, sweet corn, and olives with a light cheese finish.',
            priceSm: 1100,
            priceMd: 1500,
            priceLg: 1900,
            rating: 4.5,
            ratingCount: 720,
            tags: ['Veg'],
            toppings: [
                { image: '/corn.png', name: 'corn', price: 120 },
                { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
                { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
            ]
        },
        {
            id: 'sweet-heat-chicken',
            name: 'Sweet Heat Chicken',
            description: 'Spicy chicken balanced with a mild honey glaze and melted cheese.',
            priceSm: 1350,
            priceMd: 1750,
            priceLg: 2300,
            rating: 4.6,
            ratingCount: 640,
            tags: ['Sweet & Spicy'],
            toppings: [
                { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
                { image: '/corn.png', name: 'corn', price: 120 },
            ]
        },
        {
            id: 'street-bbq-chicken',
            name: 'Street BBQ Chicken',
            description: 'BBQ-marinated chicken, onions, and smoky sauce inspired by street flavors.',
            priceSm: 1450,
            priceMd: 1850,
            priceLg: 2500,
            rating: 4.7,
            ratingCount: 1000,
            tags: ['Popular'],
            toppings: [
                { image: '/corn.png', name: 'corn', price: 120 },
                { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
            ]
        }
    ];

    // 3. Map Images to Products (Index-Based)
    return products.map((product, index) => {
        // Use modulo to cycle through images if there are fewer images than products
        // If images array is empty, this needs a failsafe (handled by fallback above usually, but extra check good)
        const imageIndex = images.length > 0 ? index % images.length : 0;
        const assignedImage = images.length > 0 ? `/pizza/${images[imageIndex]}` : '/pizza/default_pizza.jpg';

        return {
            ...product,
            image: assignedImage
        };
    });
}

// Helper removed as we carry static data now
