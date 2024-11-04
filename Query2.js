import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:37017";
const client = new MongoClient(uri);

async function run() { 
    try {
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        const topUsers = await collection.aggregate([
            { $group: { _id: "$user.screen_name", followers: { $max: "$user.followers_count" } } },
            { $sort: { followers: -1 } },
            { $limit: 10 }
        ]).toArray();

        console.log('Top 10 screen names by followers:');
        console.table(topUsers);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);