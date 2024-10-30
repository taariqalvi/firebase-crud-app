importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDeqmyYZhnuZHh-hh7ZsS3NtyehRab_RNE",
    authDomain: "crud-practice-d5592.firebaseapp.com",
    projectId: "crud-practice-d5592",
    storageBucket: "crud-practice-d5592.appspot.com",
    messagingSenderId: "863074457405",
    appId: "1:863074457405:web:3753037df518d0945f9754",
    measurementId: "G-NZNPRWQDD5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png' // Optional, replace with your icon if available
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
