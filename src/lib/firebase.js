import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDeqmyYZhnuZHh-hh7ZsS3NtyehRab_RNE",
    authDomain: "crud-practice-d5592.firebaseapp.com",
    projectId: "crud-practice-d5592",
    storageBucket: "crud-practice-d5592.appspot.com",
    messagingSenderId: "863074457405",
    appId: "1:863074457405:web:3753037df518d0945f9754",
    measurementId: "G-NZNPRWQDD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };