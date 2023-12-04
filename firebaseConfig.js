// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);