"use client";
import { useState, useEffect } from "react";
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import toast, { Toaster } from "react-hot-toast";

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

// Placeholder user image URL
const userImageUrl = "https://img.freepik.com/free-vector/notification-bell-red_78370-6897.jpg";

const showToast = (title, body, imageUrl) => {
    toast((t) => (
        <div
            className={`p-4 rounded shadow-md flex items-center gap-4 transition transform duration-500 ease-in-out ${t.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            style={{
                background: 'linear-gradient(45deg, #ff6b6b, #f5a623)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <img src={imageUrl} alt="User" className="w-10 h-10 rounded-full" />
            <div>
                <h3 className="font-bold">{title}</h3>
                <p>{body}</p>
            </div>
        </div>
    ), {
        duration: 6000,
        position: "top-center",
        style: {
            borderRadius: "8px",
            padding: "0",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        },
    });
};

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const savedMessages = localStorage.getItem("notifications");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        const setupMessaging = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('Service Worker registered with scope:', registration.scope);
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                    return;
                }
            }

            const messaging = initializeFirebaseMessaging();

            try {
                const token = await getToken(messaging, { vapidKey: 'BJCtPkShfUAQ4Jm0u7SiFLL2IvhodBpzKmNpfa4j4KdJ6sh7iZh8blgN9STUSJ2jDbQd4Hc4afIVHciHVeiJ3tY' });
                console.log('FCM Token:', token);
            } catch (error) {
                console.error('Failed to get token:', error);
                return;
            }

            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received: ", payload);

                const newMessage = {
                    title: payload.notification?.title || "New Notification",
                    body: payload.notification?.body || "You have a new message",
                    imageUrl: userImageUrl, // Add user image URL here
                    timestamp: new Date().toLocaleString(),
                };

                showToast(newMessage.title, newMessage.body, newMessage.imageUrl);

                setMessages((prevMessages) => {
                    const updatedMessages = [newMessage, ...prevMessages];
                    localStorage.setItem("notifications", JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
            });

            return () => {
                unsubscribe();
            };
        };

        setupMessaging();
    }, []);

    const handleDelete = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
        if (confirmDelete) {
            const updatedMessages = messages.filter((_, i) => i !== index);
            setMessages(updatedMessages);
            localStorage.setItem("notifications", JSON.stringify(updatedMessages));
        }
    };

    return (
        <div className="p-4 bg-gray-100 shadow-md w-full max-w-lg mx-auto">
            <Toaster />
            {/* <h2 className="text-xl font-semibold mb-4">Notifications</h2> */}
            {messages.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <ul>
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 mb-2 rounded shadow-sm border-l-4 border-blue-500 flex items-start gap-4"
                        >
                            <img src={msg.imageUrl} alt="User" className="w-10 h-10 rounded-full" />
                            <div className="flex-grow">
                                <h3 className="font-bold">{msg.title}</h3>
                                <p>{msg.body}</p>
                                <span className="text-sm text-gray-500">{msg.timestamp}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Messages;
