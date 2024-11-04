// Load the necessary modules
import { MongoClient } from 'mongodb';
// Connection URL
const url = 'mongodb://localhost:37017';
const client = new MongoClient(url);

// Database and collection names
const dbName = 'yourDatabaseName';
const sourceCollectionName = 'originalTweetsCollection';
const userCollectionName = 'Users';
const tweetsOnlyCollectionName = 'Tweets_Only';

async function run() {
    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');
        const userCollection = db.collection('Users');
        const tweetsOnlyCollection = db.collection('Tweets_Only');

        // Create a set to store unique user IDs
        const userIds = new Set();

        // Iterate through each document in the source collection
        const tweets = await collection.find().toArray();
        for (const tweet of tweets) {
            const user = tweet.user;

            if (user && !userIds.has(user.id)) {
                userIds.add(user.id);
                await userCollection.insertOne(user);
            }

            // Simplified way to insert tweet without user information
            tweet.userId = user.id;
            delete tweet.user;
            await tweetsOnlyCollection.insertOne(tweet);
        }

        console.log('Users and Tweets_Only collections created successfully');

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);