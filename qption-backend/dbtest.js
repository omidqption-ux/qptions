import MongoClient from 'mongodb';

const uri = 'mongodb://qptionUser:22125854ZzAQ@localhost:27017/admin'; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        const databasesList = await client.db().admin().listDatabases();
        console.log('Databases:', databasesList.databases.map(db => db.name));
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
    } finally {
        await client.close();
    }
}

testConnection();