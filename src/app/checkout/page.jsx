// src/app/checkout/page.jsx
"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const Checkout = () => {
    const router = useRouter();

    const handlePayment = () => {
        // Handle payment logic here
        alert('Payment processing...');
        // After successful payment, you could redirect to a confirmation page or clear the cart
        router.push('/confirmation'); // Navigate to a confirmation page (create this page)
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                <p>Please enter your payment details below:</p>
                {/* Add form fields for payment here */}
                <button onClick={handlePayment} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default Checkout;
