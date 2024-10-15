// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

// Ensure all required environment variables are correctly set
const firebaseConfig = {
  apiKey: "AIzaSyB5WUclyQKKSkSQQ7pUO8mzDnHjm7upPbc",
  authDomain: "next-ecommerce-ede73.firebaseapp.com",
  projectId: "next-ecommerce-ede73",
  storageBucket: "next-ecommerce-ede73.appspot.com",
  messagingSenderId: "1063213411006",
  appId: "1:1063213411006:web:c1e02156709f0fae28ccef"
};

// Initialize Firebase if not already initialized
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
export const auth = getAuth(app);