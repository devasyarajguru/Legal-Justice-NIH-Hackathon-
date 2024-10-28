import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-bb59a.firebaseapp.com",
  projectId: "react-chat-bb59a",
  storageBucket: "react-chat-bb59a.appspot.com",
  messagingSenderId: "1080452552808",
  appId: "1:1080452552808:web:c8d84ca773429ae6ae43dd",
  measurementId: "G-2NWXCRN5RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Getting the auth , db storage from firebase
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

