"use client";
import { useState, useEffect } from "react";
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDeqmyYZhnuZHh-hh7ZsS3NtyehRab_RNE",
    authDomain: "crud-practice-d5592.firebaseapp.com",
    projectId: "crud-practice-d5592",
    storageBucket: "crud-practice-d5592.appspot.com",
    messagingSenderId: "863074457405",
    appId: "1:863074457405:web:3753037df518d0945f9754",
    measurementId: "G-NZNPRWQDD5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

const initializeFirebaseMessaging = () => {
    const messaging = getMessaging(app);
    return messaging;
};

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const setupMessaging = async () => {
            // Register the service worker
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('Service Worker registered with scope:', registration.scope);
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                    return; // Exit if the service worker registration fails
                }
            }

            const messaging = initializeFirebaseMessaging();

            // Get the registration token
            try {
                const token = await getToken(messaging, { vapidKey: 'BJCtPkShfUAQ4Jm0u7SiFLL2IvhodBpzKmNpfa4j4KdJ6sh7iZh8blgN9STUSJ2jDbQd4Hc4afIVHciHVeiJ3tY' });
                console.log('FCM Token:', token);
            } catch (error) {
                console.error('Failed to get token:', error);
                return; // Exit if getting the token fails
            }

            // Listen for incoming messages
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received: ", payload);

                const newMessage = {
                    title: payload.notification?.title || "New Notification",
                    body: payload.notification?.body || "You have a new message",
                    timestamp: new Date().toLocaleString(),
                };

                // Add new message to the messages array
                setMessages((prevMessages) => [newMessage, ...prevMessages]);
            });

            // Cleanup function to unsubscribe from messages on component unmount
            return () => {
                unsubscribe();
            };
        };

        setupMessaging();
    }, []);

    return (
        <div className="p-4 bg-gray-100 rounded shadow-md w-full max-w-lg mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {messages.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <ul>
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 mb-2 rounded shadow-sm border-l-4 border-blue-500"
                        >
                            <h3 className="font-bold">{msg.title}</h3>
                            <p>{msg.body}</p>
                            <span className="text-sm text-gray-500">{msg.timestamp}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Messages;
