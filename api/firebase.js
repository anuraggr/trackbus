import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase, ref, get } from 'firebase-admin/database';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://driverapp-47cd8-default-rtdb.firebaseio.com/',
});

export async function GET() {
  try {
    const db = getDatabase();
    const locationsRef = ref(db, 'locations');
    const snapshot = await get(locationsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'No data found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error retrieving data', details: error.message }), { status: 500 });
  }
}
