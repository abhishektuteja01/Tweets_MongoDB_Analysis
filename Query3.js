import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:37017";
const client = new MongoClient(uri);

async function run() {
    try{
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        const mosttweets = await collection.aggregate([
            { $group: { _id : "$user.screen_name", count: { $sum: 1 }}},
            { $sort: { count: -1 }},
            { $limit: 1}
        ]).toArray();

        if (mosttweets.length === 0) {
            console.log('No users found');
            return;
        }
        else {
            const { _id, count } = mosttweets[0];
            console.log(`User with the most Tweets is ${_id} with ${count} Tweets`);
        }
           
    } finally {
        await client.close();
    }
}

run().catch(console.dir);