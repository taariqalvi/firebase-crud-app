import React, { useEffect } from 'react';

const PayPalButton = ({ onApprove, onError }) => {
    useEffect(() => {
        // Load PayPal SDK
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=your_paypal_client_id&currency=USD`;
        script.async = true;
        script.onload = () => {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: '49.99', // Set the payment amount dynamically
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const details = await actions.order.capture();
                    onApprove(details, data); // Call onApprove callback with payment details
                },
                onError: (err) => {
                    onError(err); // Call onError callback if payment fails
                },
            }).render('#paypal-button-container');
        };

        document.body.appendChild(script);
    }, []);

    return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
