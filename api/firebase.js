const admin = require('firebase-admin');
const { getDatabase, ref, get } = require('firebase-admin/database');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://driverapp-47cd8-default-rtdb.firebaseio.com/',
});

exports.handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const db = getDatabase();
      const locationsRef = ref(db, 'locations');
      const snapshot = await get(locationsRef);

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
};
