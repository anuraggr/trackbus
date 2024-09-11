import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase, ref, get } from 'firebase-admin/database';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://driverapp-47cd8-default-rtdb.firebaseio.com/',
});

export async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = getDatabase();
      const locationsRef = ref(db, 'locations');
      const snapshot = await get(locationsRef);  // Fetch the data directly from the reference

      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'No data found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving data', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
