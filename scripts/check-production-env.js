/**
 * Production Environment Checker
 * Verifies that production database seeding was successful
 * Run: node scripts/check-production-env.js
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const dbConnect = (await import('../src/lib/dbConnect.js')).default;
const Pizza = (await import('../src/models/Pizza.js')).default;
const Topping = (await import('../src/models/Topping.js')).default;
const Admin = (await import('../src/models/Admin.js')).default;
const Offer = (await import('../src/models/Offer.js')).default;
const User = (await import('../src/models/User.js')).default;

async function checkProduction() {
    try {
        console.log('🔍 Checking Production Database...\n');

        // Verify MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not set in .env.local');
            process.exit(1);
        }

        console.log('📡 Connecting to MongoDB...');
        console.log(`   URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);

        await dbConnect();
        console.log('✅ Connected successfully!\n');

        // Check collections
        console.log('📊 Collection Status:\n');

        const pizzaCount = await Pizza.countDocuments();
        console.log(`   🍕 Pizzas: ${pizzaCount} ${pizzaCount === 25 ? '✅' : '❌ (Expected 25)'}`);

        const toppingCount = await Topping.countDocuments();
        console.log(`   🧀 Toppings: ${toppingCount} ${toppingCount === 8 ? '✅' : '❌ (Expected 8)'}`);

        const adminCount = await Admin.countDocuments();
        console.log(`   👤 Admins: ${adminCount} ${adminCount >= 2 ? '✅' : '❌ (Expected 2)'}`);

        const offerCount = await Offer.countDocuments();
        console.log(`   🎟️  Offers: ${offerCount} ${offerCount >= 4 ? '✅' : '❌ (Expected 4)'}`);

        const userCount = await User.countDocuments();
        console.log(`   👥 Users: ${userCount}\n`);

        // Overall status
        if (pizzaCount === 25 && toppingCount === 8 && adminCount >= 2 && offerCount >= 4) {
            console.log('🎉 Production database is properly seeded!');
            console.log('✅ Your website should now show pizzas.\n');
        } else {
            console.log('⚠️  Database is missing data. Run: npm run seed\n');
        }

        // Sample data check
        if (pizzaCount > 0) {
            const samplePizza = await Pizza.findOne().lean();
            console.log('📋 Sample Pizza:');
            console.log(`   Name: ${samplePizza.name}`);
            console.log(`   Price (Sm/Md/Lg): Rs.${samplePizza.priceSm}/Rs.${samplePizza.priceMd}/Rs.${samplePizza.priceLg}`);
            console.log(`   Enabled: ${samplePizza.enabled ? '✅' : '❌'}`);
            console.log(`   Category: ${samplePizza.category}\n`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.name === 'MongoServerError') {
            console.error('\n💡 Common fixes:');
            console.error('   1. Check your MONGODB_URI in .env.local');
            console.error('   2. Verify your IP is whitelisted in MongoDB Atlas');
            console.error('   3. Check username/password are correct\n');
        }
        process.exit(1);
    }
}

checkProduction();
