import { MongoClient } from 'mongodb';

async function run() {
    const uri = 'mongodb://localhost:37017'; 
    const client = new MongoClient(uri);

    try {
        const db = client.db('ieeevisTweets'); 
        const collection = db.collection('tweet'); 

        const count = await collection.countDocuments({
            retweeted_status: { $exists: false },
            in_reply_to_status_id: null
        });

        console.log(`Number of tweets that are not retweets or replies: ${count}`);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);