import { MongoClient } from 'mongodb';

async function run() {
    const uri = 'mongodb://localhost:37017';
    const client = new MongoClient(uri);

    try {
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        const topRetweetedUsers = await collection.aggregate([
            { $group: { _id: "$user.screen_name", tweetCount: { $sum: 1 }, avgRetweets: { $avg: "$retweet_count" } } },
            { $match: { tweetCount: { $gt: 3 } } },
            { $project: {   _id: 1,
                            tweetCount: 1,
                            avgRetweets: { $round: ["$avgRetweets", 1] } // Rounds to 1 decimal place
                        }
            },
            { $sort: { avgRetweets: -1 } },
            { $limit: 10 }
        ]).toArray();

        console.log('Top 10 people with highest average retweets (with more than 3 tweets):');
        console.table(topRetweetedUsers);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);