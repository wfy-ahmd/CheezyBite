const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://localhost:27017/cheezybite';

async function run() {
    try {
        console.log('🔌 Connecting to LOCAL MongoDB...');
        const conn = await mongoose.connect(LOCAL_URI);
        console.log('✅ Connected to Localhost');

        // Dynamic import to avoid schema issues, but simpler to just use raw mongo driver via mongoose
        // actually, using models is better for structure
        const User = (await import('../src/models/User.js')).default;
        const Order = (await import('../src/models/Order.js')).default;

        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();

        console.log(`\n📊 Local Database Stats:`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Orders: ${orderCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Failed to connect to local DB:', error.message);
    }
}

run();
