// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb1c-sq_SM0Q6oTpP6P_oG1PxF6taxyLo",
  authDomain: "iotsysml.firebaseapp.com",
  projectId: "iotsysml",
  storageBucket: "iotsysml.appspot.com",
  messagingSenderId: "931651298875",
  appId: "1:931651298875:web:edd91b9f0c787307e35e1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
