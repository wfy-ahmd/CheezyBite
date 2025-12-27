const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars explicitly
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log('🔄 MongoDB Migration Script: Local -> Atlas');
console.log('=========================================');

const LOCAL_URI = 'mongodb://localhost:27017/cheezybite';
const ATLAS_URI = process.env.MONGODB_URI;

if (!ATLAS_URI) {
    console.error('❌ MONGODB_URI missing in .env.local');
    process.exit(1);
}

// Simple schema definitions to avoid model dependency issues
const userSchema = new mongoose.Schema({}, { strict: false });
const orderSchema = new mongoose.Schema({}, { strict: false });

async function run() {
    let localConn, atlasConn;

    try {
        // 1. Connect to Local DB
        console.log('🔌 Connecting to LOCAL DB...');
        localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connected to Local');

        const LocalUser = localConn.model('User', userSchema);
        const LocalOrder = localConn.model('Order', orderSchema);

        console.log('📥 Fetching local data...');
        const users = await LocalUser.find({});
        const orders = await LocalOrder.find({});

        console.log(`   - Found ${users.length} users`);
        console.log(`   - Found ${orders.length} orders`);

        await localConn.close();
        console.log('🔌 Disconnected from Local');

        // 2. Connect to Atlas DB
        console.log('\n🔌 Connecting to ATLAS DB...');
        atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connected to Atlas');

        const AtlasUser = atlasConn.model('User', userSchema);
        const AtlasOrder = atlasConn.model('Order', orderSchema);

        // 3. Migrate Users
        console.log('\n🚀 Migrating Users...');
        let importedUsers = 0;
        for (const user of users) {
            const exists = await AtlasUser.findOne({ _id: user._id });
            if (!exists) {
                await AtlasUser.create(user);
                importedUsers++;
            }
        }
        console.log(`✅ Imported ${importedUsers} new users (Skipped ${users.length - importedUsers})`);

        // 4. Migrate Orders
        console.log('\n🚀 Migrating Orders...');
        let importedOrders = 0;
        for (const order of orders) {
            const exists = await AtlasOrder.findOne({ _id: order._id });
            if (!exists) {
                await AtlasOrder.create(order);
                importedOrders++;
            }
        }
        console.log(`✅ Imported ${importedOrders} new orders (Skipped ${orders.length - importedOrders})`);

        console.log('\n🎉 Migration Complete!');

    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        if (localConn) await localConn.close();
        if (atlasConn) await atlasConn.close();
    }
}

run();
