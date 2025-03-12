// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import for authentication
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv2U5ErHMmGUHvM8kwNDO650CxhBwNK9Y",
  authDomain: "major-project-d0c57.firebaseapp.com",
  projectId: "major-project-d0c57",
  storageBucket: "major-project-d0c57.firebasestorage.app",
  messagingSenderId: "863533584471",
  appId: "1:863533584471:web:446e5806bffe5e8fda1312",
  measurementId: "G-NNDX2RCNQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth

export { app, auth };