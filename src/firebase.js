// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG-pTWJ-JxYzwRnbK7ODyQN7vLPtG-4DQ",
  authDomain: "firestore-a5a96.firebaseapp.com",
  projectId: "firestore-a5a96",
  storageBucket: "firestore-a5a96.firebasestorage.app",
  messagingSenderId: "927260580639",
  appId: "1:927260580639:web:7662479c52a14efefbee2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
