// In backend/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://geniewordle-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

module.exports = { db, admin };