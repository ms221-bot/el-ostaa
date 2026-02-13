
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlOkEXPcWF3nWjkTJZgMroaepfvyI10LE",
  authDomain: "el-ostaa.firebaseapp.com",
  databaseURL: "https://el-ostaa-default-rtdb.firebaseio.com",
  projectId: "el-ostaa",
  storageBucket: "el-ostaa.firebasestorage.app",
  messagingSenderId: "250991364158",
  appId: "1:250991364158:web:c3bb12256c33e716d3696f",
  measurementId: "G-4TP8C29R0X"
};

const app = initializeApp(firebaseConfig);

// أسماء واضحة لتجنب الخطأ e._checkNotDeleted
export const rtdb = getDatabase(app);
export const firestore = getFirestore(app);
