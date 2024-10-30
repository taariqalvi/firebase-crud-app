"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js'; // Stripe SDK for card payments
import PayPalButton from '@/components/PayPalButton'; // Assume this is a custom component wrapping PayPal SDK

// Load Stripe (Replace with your Stripe public key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY);

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // async function handleCheckout(cartItems) {
    //     setLoading(true);
    //     const stripe = await stripePromise;

    //     // Create a checkout session
    //     const response = await fetch('/api/create-checkout-session', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ cartItems }),
    //     });

    //     const session = await response.json();

    //     // Redirect to checkout
    //     const result = await stripe.redirectToCheckout({ sessionId: session.id });
    //     if (result.error) {
    //         console.error(result.error.message);
    //         setLoading(false);
    //     }
    // }

    const handleStripePayment = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: 'price_1QDlxGCBAY0IsMbaqCChqYGZ', // Replace with the actual Stripe price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
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
            // handleCheckout();
        } else if (paymentMethod === 'paypal') {
            // PayPal button component handles payment directly, so no need for extra logic here
            return;
        }
    };

    return (
        <div>
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
