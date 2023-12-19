import firebase from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN3tkrUuf6AY8QRLLHMVc4ZZ72zf1cd54",
  authDomain: "swipp-b74be.firebaseapp.com",
  projectId: "swipp-b74be",
  storageBucket: "swipp-b74be.appspot.com",
  messagingSenderId: "147022767859",
  appId: "1:147022767859:web:185aecccdf9c031f99b986",
  measurementId: "G-11Q86C19N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export const auth = firebase.auth();
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});