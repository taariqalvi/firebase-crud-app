import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDeqmyYZhnuZHh-hh7ZsS3NtyehRab_RNE",
    authDomain: "crud-practice-d5592.firebaseapp.com",
    projectId: "crud-practice-d5592",
    storageBucket: "crud-practice-d5592.appspot.com",
    messagingSenderId: "863074457405",
    appId: "1:863074457405:web:3753037df518d0945f9754",
    measurementId: "G-NZNPRWQDD5"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and register the service worker
export const initializeFirebaseMessaging = async () => {
    const messaging = getMessaging(app);

    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js"
            );
            messaging.useServiceWorker(registration);
            console.log("Service Worker registered:", registration);
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    }

    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // Customize the notification display here
    });

    return messaging;
};


export default app;