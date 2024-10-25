"use client";
import { useRouter } from 'next/navigation';

const ConfirmationPage = () => {
    const router = useRouter();

    const handleGoToCart = () => {
        router.push('/cart');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>
                <button
                    onClick={handleGoToCart}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Go to Cart
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
