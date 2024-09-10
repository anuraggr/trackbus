import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getDatabase, ref, get } from 'firebase-admin/database';
import { NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com/',
});

export async function GET() {
  try {
    const db = getDatabase();
    const locationsRef = ref(db, 'locations');
    const snapshot = await get(locationsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Process and return data
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error retrieving data', details: error.message }, { status: 500 });
  }
}
