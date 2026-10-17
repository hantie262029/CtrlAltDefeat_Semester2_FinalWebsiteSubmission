// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// Our web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyD9XO88gdJ6wno3YS0IwJ8FldHi4l3tTaM",
    authDomain: "claogin-a79bf.firebaseapp.com",
    projectId: "claogin-a79bf",
    storageBucket: "claogin-a79bf.firebasestorage.app",
    messagingSenderId: "601728524397",
    appId: "1:601728524397:web:62820ac13be252b6f75f64",
};

// Initialize firebase using config
let app = initializeApp(firebaseConfig);

// Get authentication service for app
let auth = getAuth(app);

// Export "auth" so firebaseJS.js can use it
export {auth};
