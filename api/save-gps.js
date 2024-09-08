import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI; // Store this in Vercel environment variables
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a MongoDB client and connect
client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
clientPromise = client.connect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { lat, lon, bus_id, acc } = req.query;

    if (!lat || !lon || !bus_id || !acc) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('trackbus'); // Replace with your MongoDB database name
      const collection = db.collection('buses'); // Replace with your collection name

      // Update or insert bus data
      await collection.updateOne(
        { bus_id: bus_id }, // Filter by bus_id
        { $set: { lat: parseFloat(lat), lng: parseFloat(lon), accuracy: parseFloat(acc) } }, // Set new values
        { upsert: true } // If the bus_id doesn't exist, insert a new document
      );

      return res.status(200).json({ message: 'GPS data saved successfully' });
    } catch (error) {
      console.error('Failed to save data:', error);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
