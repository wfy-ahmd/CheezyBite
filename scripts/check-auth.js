const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars explicitly
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log('🔍 Auth Diagnostic Script');
console.log('========================');

const uri = process.env.MONGODB_URI;

// Import models dynamically to avoid import issues
async function run() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // We need to define schema/model if not loading from file, 
        // to avoid issues with dependencies in the project structure
        // But better to use the project structure if possible.
        // Let's rely on basic Mongoose commands without Models if possible,
        // or just use dynamic imports like seed.js

        const User = (await import('../src/models/User.js')).default;
        const Admin = (await import('../src/models/Admin.js')).default;

        const users = await User.find({});
        const admins = await Admin.find({});

        console.log(`\n👥 Users found: ${users.length}`);
        users.forEach(u => {
            console.log(` - [${u._id}] ${u.email} (Verified: ${u.emailVerified}, Role: ${u.role})`);
        });

        console.log(`\n🛡️  Admins found: ${admins.length}`);
        admins.forEach(a => {
            console.log(` - [${a._id}] ${a.username} (Role: ${a.role})`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

run();
