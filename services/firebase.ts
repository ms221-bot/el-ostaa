
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// إعدادات Firebase المقدمة من العميل
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

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// تصدير مرجع قاعدة البيانات لاستخدامه في الصفحات
export const db = getDatabase(app);
