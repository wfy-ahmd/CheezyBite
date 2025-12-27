const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars explicitly
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log('🔧 Fixing Broken Image Path...');
console.log('============================');

const uri = process.env.MONGODB_URI;

async function run() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Dynamic import of Pizza model
        const Pizza = (await import('../src/models/Pizza.js')).default;

        // Find the pizza with ID 17
        const result = await Pizza.updateOne(
            { id: 17 },
            { $set: { image: '/pizzas/pizza17.jpg' } }
        );

        if (result.matchedCount > 0) {
            console.log('✅ Success: Updated "Spicy Triple Tango" image to .jpg');
        } else {
            console.warn('⚠️ Warning: Pizza with ID 17 not found.');
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

run();
