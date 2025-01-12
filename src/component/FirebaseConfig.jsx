// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDOzZqrBCLZYe49waH9ahhsxZDwsEL10-k",
  authDomain: "dht11-d5cba.firebaseapp.com",
  databaseURL: "https://dht11-d5cba-default-rtdb.firebaseio.com",
  projectId: "dht11-d5cba",
  storageBucket: "dht11-d5cba.appspot.com",
  messagingSenderId: "822104026737",
  appId: "1:822104026737:web:dee669430efec4dfb135d0",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth, Firestore, và Realtime Database
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb, firestore};
