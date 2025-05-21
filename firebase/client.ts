// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCUb6dvqTzleU19Eo6KXVlK0gAsRv4axwQ",
    authDomain: "interview-app-75b87.firebaseapp.com",
    projectId: "interview-app-75b87",
    storageBucket: "interview-app-75b87.firebasestorage.app",
    messagingSenderId: "375101173890",
    appId: "1:375101173890:web:633c32b9e54cb4fad9c49b",
    measurementId: "G-77BN64Q2CS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);