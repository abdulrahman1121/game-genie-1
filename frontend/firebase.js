import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyD_aYwJ5z2PPiGMgWpK7RULqtQCVnVMmO8",
  authDomain: "geniewordle.firebaseapp.com",
  databaseURL: "https://geniewordle-default-rtdb.firebaseio.com",
  projectId: "geniewordle",
  storageBucket: "geniewordle.firebasestorage.app",
  messagingSenderId: "488615969313",
  appId: "1:488615969313:web:8c9e6cbe0474195b7b1960",
  measurementId: "G-PHZ10T7ZWX"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Use Firestore for your game