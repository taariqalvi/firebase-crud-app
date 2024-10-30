// "use client";
// import { useRouter, useSearchParams } from 'next/navigation';

// const SuccessPage = () => {
//     const searchParams = useSearchParams();
//     const sessionId = searchParams.get('session_id');

//     const router = useRouter();

//     const handleGoToCart = () => {
//         router.push('/cart');
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-green-200">

//             <div className="bg-gray-200 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
//                 <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
//                 <p className="text-lg text-gray-700 mb-6">
//                     Thank you for your purchase. Your payment has been processed successfully.
//                 </p>
//                 <div className="my-2 overflow-x-scroll">{sessionId && <p>Session ID: {sessionId}</p>}</div>
//                 <button
//                     onClick={handleGoToCart}
//                     className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
//                 >
//                     Go to Cart
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SuccessPage;


"use client";
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const addOrderToFirestore = async () => {
            const user = auth.currentUser;
            if (!user || !sessionId) return;

            // Fetch session data from your backend API (to get order details)
            const response = await fetch(`/api/success?session_id=${sessionId}`);
            const sessionData = await response.json();

            // Construct order data to save in Firestore
            const orderData = {
                userId: user.uid,
                items: sessionData.cartItems, // Ensure cartItems were stored in the session
                totalAmount: sessionData.amount_total,
                timestamp: new Date(),
            };

            // Save to Firestore 'orders' collection
            await setDoc(doc(db, 'orders', sessionId), orderData);
        };

        addOrderToFirestore();
    }, [sessionId, auth]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p>Thank you for your purchase. Your order has been saved.</p>
        </div>
    );
};

export default SuccessPage;
