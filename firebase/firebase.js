// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBP5n6yMb9t1qmY0wB4pwAnldoCbkZjg3s",
    authDomain: "expense-tracker-cmo.firebaseapp.com",
    projectId: "expense-tracker-cmo",
    storageBucket: "expense-tracker-cmo.firebasestorage.app",
    messagingSenderId: "263951921711",
    appId: "1:263951921711:web:1d485e1ca4f7a9fcccccda",
    measurementId: "G-5MYHHNJ7DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
const auth = getAuth(app);

//Export the auth object to use in other files
export { auth };