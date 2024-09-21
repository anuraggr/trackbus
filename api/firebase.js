import admin from 'firebase-admin';
import fs from 'fs';

const config = {
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "bus-mitra-driver",
    "private_key_id": "67e46df40c5c53c57859bfb5fa80472872d8ec1d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2VVJTwBUZdVeC\nqqGaCrXO9AzjSGFH4h1rLVzUhZ3G7FdQtX2WHaFa4oMs4qGgnqmmKB+rlbJ8vbVc\nc/FDom1tUfQ3EC//is7alYKtRgThN+VTggbosWgWCKJMImJOwuAMwVvZAtc6sUnK\nxdioi9hva2abiZWea75hgqmsdcnH5oBO7WlFMO/aHYOKznG2ItG9HlGdHo+pf9KY\npKjdluG8Y3N3FHAQ6gOXFWzqtAMr7mLh08Tu0PsGUUy+4/QTuoABQPLkyipPHoq/\nd8xgOyg6vKr5zuqmPUzGsfB584fONUfmx/UR8C+uvT4B40jWds+KST0HO9LwhjXL\nuNv8X6+HAgMBAAECggEABKxaoKHUgjaJDcs+EAitLIS939I7XSN+xYi72BnPSKNG\noz1Uq3/GYq7AXnu+al4msNxW8VSA5uZhmPIYVtEKrX4WpR5iKVrVseURgwdqQ82h\nFo0+4a/sffdIBNOIhCzOOUm8foS/lmce//7zw7WcjB6G/Jg7fkkLmofwrJEMj/5/\nrqlx9p2uUFaOUopNgCofB6U2MseL4f90F15X7LI4kv4D8RFXrWpB9VKrxsohrx4f\nKx0ZdTCIdTZUEiR0hlJSvDKhegopT+w8b55HI1/PZmiRjEhaZMwdClZT1cAX7fer\nqlIFB7SEzxzWBEdqkMbQMs6HoL8b0dsyxAxop51tgQKBgQDyQN3vHzT37lUHeKe7\nNnr4aqUlutHdyqFvdxY+peuXc1oq76DupuDwnrU5aFGkMGB8WCgbJ6o2J5hJORAh\nnB6O155uBphNE+QY3swqTq8wt/z52uWo2NcCFcUcnAhNY2mMJkj7w8xFCFLr1lH8\nVJv8oe4tu/2LfIROVRNqWGXq0QKBgQDArgQAlKoOacLBUb2weTXul8VL1FZopLCs\nI9OxuuXx/WoXSiF/5Yi+LMndIIN2UtdGjDCtNW7mdVJHsBh3IRjA0lULkrz/QXRN\n2dXi7Jn4wfNvWu7nmztWl2ByRmsyGMLeXAR/mx9y76TqkWZQVroz6mDdvY6KchWa\nCNZPQRpa1wKBgCLccNOTYxT2qCfOFh0bxvBusFtQmhjXqwmWUo4rZE7EG8qn9znA\nrAgUXrHnMDB3gbsDGKpnt9fZNNH8szSS+dbGcpcUveABp8ZocWr5Lb7OC0qNVJVK\ntw4mwdnPHma8kpjHfaM1VvTsMLqdeejc6CGfz92m+uKSxZtcJNId7HSxAoGBAL9u\nJFvPWAVp3izjYWrrgkHCWCq2lALzXPQpxDFYVwzNkZIB/LZs/iazqPshSntMYsWc\nkuADrmMZPN4sfqIdJ9KrJgORjmSsSzjtrCsAlxkm2Q1Rcvp4p8OoMhJXFDl5kGIL\nWgzNubkfjuHeA6DeCbF6szKbGftCzWN0VDf5no2RAoGBALK9bSomhnTmm6KMyqnA\nqlCEo8DuDtuJtvEgP+LDD2t5bzxAnYx7wUBpyiZC4mZ7kxlofHRatve+/5M8oswK\nNtgjUD7vRxNclTRDLPpzR9w2uxmXjCZ+F0crWlJ3j2258FT/S/Vwk9XIpTput/CG\nEt0TyKiXdbMs2XaH8UcRVI+s\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-8ll54@bus-mitra-driver.iam.gserviceaccount.com",
    "client_id": "109824232522646175406",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8ll54%40bus-mitra-driver.iam.gserviceaccount.com",
  }),
  databaseURL: 'https://bus-mitra-driver-default-rtdb.firebaseio.com/',
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp(config);
}

const db = admin.database(); // Initialize database reference

// API Handler
export default async function handler(req, res) {
  const { busNumber } = req.query;

  if (!busNumber) {
    return res.status(400).json({ error: 'Bus number is required' });
  }

  try {
    const snapshot = await db.ref(`/locations/${busNumber}`).once('value');
    const data = snapshot.val();

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Bus not found' });
    }
  } catch (error) {
    console.error('Error fetching bus location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
