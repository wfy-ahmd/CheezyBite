const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars explicitly
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log('🔍 MongoDB Diagnostic Script');
console.log('============================');
console.log(`📂 Loading .env from: ${envPath}`);

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is MISSING in process.env');
    process.exit(1);
}

// Masked URI for safety
const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log(`🔗 URI found: ${maskedUri}`);

async function testConnection() {
    try {
        console.log('⏳ Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connection Sucessful!');
        console.log(`🗄️  Connected to database: ${mongoose.connection.name}`);
        console.log('Current Connection State:', mongoose.connection.readyState);
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('---------------------');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);

        if (error.message.includes('whitelisted')) {
            console.error('\n⚠️  DIAGNOSIS: IP NOT WHITELISTED');
            console.error('Please add your current IP to MongoDB Atlas Network Access.');
        }
    }
}

testConnection();
