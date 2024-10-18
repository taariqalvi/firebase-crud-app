"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js'; // Stripe SDK for card payments
import PayPalButton from '@/components/PayPalButton'; // Assume this is a custom component wrapping PayPal SDK

// Load Stripe (Replace with your Stripe public key)
const stripePromise = loadStripe('your_stripe_public_key');

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStripePayment = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: 'your_stripe_price_id', // Replace with the actual Stripe price ID
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: `${window.location.origin}/confirmation`,
            cancelUrl: `${window.location.origin}/checkout`,
        });

        if (error) {
            console.error('Stripe payment error:', error);
            setLoading(false);
        }
    };

    const handlePayPalPayment = (details, data) => {
        // Logic to handle PayPal payment success
        console.log('PayPal transaction completed by', details.payer.name.given_name);
        router.push('/confirmation'); // Navigate to confirmation page after successful payment
    };

    const handlePayment = () => {
        if (paymentMethod === 'stripe') {
            handleStripePayment();
        } else if (paymentMethod === 'paypal') {
            // PayPal button component handles payment directly, so no need for extra logic here
            return;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>

                {/* Payment Method Selection */}
                <div className="mb-4">
                    <label className="text-xl font-semibold">Select Payment Method:</label>
                    <div className="flex space-x-4 mt-2">
                        <button
                            className={`px-4 py-2 rounded border ${paymentMethod === 'stripe' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                            onClick={() => setPaymentMethod('stripe')}
                        >
                            Credit/Debit Card
                        </button>
                        <button
                            className={`px-4 py-2 rounded border ${paymentMethod === 'paypal' ? 'bg-yellow-500 text-white' : 'bg-white text-black'}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            PayPal
                        </button>
                    </div>
                </div>

                {/* Stripe Payment Form */}
                {paymentMethod === 'stripe' && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Pay with Credit/Debit Card</h2>
                        <p className="text-gray-600 mb-4">You will be redirected to Stripe's secure checkout.</p>
                        <button
                            onClick={handlePayment}
                            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Pay with Card'}
                        </button>
                    </div>
                )}

                {/* PayPal Payment */}
                {paymentMethod === 'paypal' && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Pay with PayPal</h2>
                        <p className="text-gray-600 mb-4">You will be redirected to PayPal for payment.</p>
                        <PayPalButton
                            onApprove={handlePayPalPayment}
                            onError={(err) => console.error('PayPal Error:', err)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
