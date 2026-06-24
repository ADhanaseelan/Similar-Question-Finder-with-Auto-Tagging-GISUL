import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRNAIf3s94UdrmTuLKqyNnA3bezzvxb3w",
  authDomain: "auto-tagging-2ceba.firebaseapp.com",
  databaseURL: "https://auto-tagging-2ceba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auto-tagging-2ceba",
  storageBucket: "auto-tagging-2ceba.firebasestorage.app",
  messagingSenderId: "460084508955",
  appId: "1:460084508955:web:edddb07e2643dc9708bbbe",
  measurementId: "G-9QBC5GD2Q1"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const db = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
