// src/firebase.js

// 1) Import the functions you actually use:
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";             // ← add this
import { getFirestore } from "firebase/firestore";   // ← and this


// 2) Paste the config object exactly as Google gave it to you:
const firebaseConfig = {
  apiKey: "AIzaSyCPzDeeBOC4dpQf9OK311aYr7-syavQsQ0",
  authDomain: "todo-auth-app-cd394.firebaseapp.com",
  projectId: "todo-auth-app-cd394",
  storageBucket: "todo-auth-app-cd394.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:6879679435061:web:abcdef123456",
};

// 3) Initialize Firebase itself:
const app = initializeApp(firebaseConfig);

// 5) Now that getAuth and getFirestore are imported, these exports will work:
export const auth = getAuth(app);
export const db   = getFirestore(app);
