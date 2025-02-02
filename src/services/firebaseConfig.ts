// src/services/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPMUr_fD5h0S4L1yIny7ob4jm-aSDb7vA",
  authDomain: "gymexerciselogger-fb.firebaseapp.com",
  projectId: "gymexerciselogger-fb",
  storageBucket: "gymexerciselogger-fb.firebasestorage.app",
  messagingSenderId: "367435954102",
  appId: "1:367435954102:web:700a31e3b709ff46677317"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);