const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is used, will check package.json

// Load env vars explicitly
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log('🔐 Login Verification Script');
console.log('==========================');

const uri = process.env.MONGODB_URI;

async function run() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Dynamic import of User model
        const User = (await import('../src/models/User.js')).default;

        const testEmail = 'test@cheezybite.lk';
        const testPass = 'test123';

        console.log(`\nTesting Login for: ${testEmail}`);

        const user = await User.findOne({ email: testEmail });

        if (!user) {
            console.error('❌ User NOT FOUND in database');
            process.exit(1);
        }

        console.log(`✅ User found: ${user._id}`);
        console.log(`   Stored Hash: ${user.password.substring(0, 20)}...`);

        console.log(`   Comparing password: '${testPass}'`);
        const isMatch = await bcrypt.compare(testPass, user.password);

        if (isMatch) {
            console.log('✅ Password MATCHES!');
            console.log('   Login logic is CORRECT.');
        } else {
            console.error('❌ Password DOES NOT MATCH!');
            console.error('   The seeded password hash is incorrect.');
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

run();
