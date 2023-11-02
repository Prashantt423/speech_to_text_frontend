// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyComiR5pSJ5ARH6U7RsZiWWa-2848k6B0I",
  authDomain: "whisper-7d270.firebaseapp.com",
  projectId: "whisper-7d270",
  storageBucket: "whisper-7d270.appspot.com",
  messagingSenderId: "176676085713",
  appId: "1:176676085713:web:cdc8ef61c5ea1bbd510af0",
  measurementId: "G-LDRGT8WWX8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
