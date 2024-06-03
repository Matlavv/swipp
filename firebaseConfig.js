import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import {
  signOut as firebaseSignOut,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
const expoConfig = Constants.expoConfig || {};
const { extra } = expoConfig;

const {
  apiKey = "",
  authDomain = "",
  projectId = "",
  storageBucket = "",
  messagingSenderId = "",
  appId = "",
  measurementId = "",
} = extra || {};

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export const auth = firebase.auth();
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const signOut = firebaseSignOut;
