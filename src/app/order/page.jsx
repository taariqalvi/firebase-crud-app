"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const Order = () => {
    const [zoom, setZoom] = useState(null);
    const [orderedItems, setOrderedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchCartItems(user.uid); // Fetch the cart items for the logged-in user
        }}, [user]);

    // Fetch ordered items (cart items) from Firestore
    const fetchCartItems = async (userId) => {
        try {
            const cartCollection = collection(db, 'cart');
            const q = query(cartCollection, where('userId', '==', userId));
            const cartSnapshot = await getDocs(q);

            if (!cartSnapshot.empty) {
                const items = cartSnapshot.docs.map(doc => doc.data());
                setOrderedItems(items);

                // Calculate the total price
                const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                setTotalPrice(total);
            } else {
                setOrderedItems([]);
                setTotalPrice(0); // No items found
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const handleZoom = (id) => {
        setZoom(id);
    };

    return (
        <div>
            <div className="container mx-auto p-4 mb-8">
                <h1 className="text-2xl font-bold mb-4">Your Order</h1>

                {orderedItems.length === 0 ? (
                    <p>Your order is empty.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {orderedItems.map(item => (
                                <div key={item.id} className="flex flex-col items-center border p-4 rounded shadow">
                                    <div
                                        className="relative cursor-zoom-in"
                                        onClick={() => handleZoom(item.id)}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={zoom === item.id ? 600 : 300}
                                            height={zoom === item.id ? 600 : 300}
                                            className={zoom === item.id ? "object-cover" : ""}
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold">{item.name}</h2>
                                    {/* <p>Price: ${item.price.toFixed(2)}</p> */}
                                    <p>Price: PKR {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                </div>
                            ))}
                        </div>

                        {/* Total Price Section */}
                        <div className="mt-8">
                            <h2 className="text-xl font-bold">Total Price: PKR {totalPrice.toFixed(2)}</h2>
                        </div>

                        {/* Checkout Button */}
                        <div className="mt-4">
                            <button
                                onClick={() => router.push('/checkout')}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Order;

// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { getAuth } from 'firebase/auth';
// import Navbar from '@/components/Navbar';

// const OrderPage = () => {
//     const [orderItems, setOrderItems] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     useEffect(() => {
//         const auth = getAuth();
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//             if (user) {
//                 setCurrentUser(user);
//             } else {
//                 router.push('/login');
//             }
//         });

//         return () => unsubscribe();
//     }, [router]);

//     useEffect(() => {
//         const fetchOrderItems = async () => {
//             const isBuyAll = searchParams.get('all') === 'true';
//             const productId = searchParams.get('productId');

//             if (currentUser) {
//                 let items = [];

//                 if (isBuyAll) {
//                     // Buy all items
//                     const cartCollection = collection(db, 'cart');
//                     const cartQuery = query(cartCollection, where('userId', '==', currentUser.uid));
//                     const cartSnapshot = await getDocs(cartQuery);
//                     items = cartSnapshot.docs.map(doc => doc.data());
//                 } else if (productId) {
//                     // Buy one item
//                     const cartCollection = collection(db, 'cart');
//                     const cartQuery = query(cartCollection, where('userId', '==', currentUser.uid), where('id', '==', productId));
//                     const cartSnapshot = await getDocs(cartQuery);
//                     items = cartSnapshot.docs.map(doc => doc.data());
//                 }

//                 setOrderItems(items);

//                 // Add order items to Firestore "orders" collection
//                 const ordersCollection = collection(db, 'orders');
//                 for (const item of items) {
//                     await addDoc(ordersCollection, {
//                         ...item,
//                         userId: currentUser.uid,
//                         orderDate: new Date(),
//                     });
//                 }
//             }
//         };

//         fetchOrderItems();
//     }, [currentUser, searchParams]);

//     return (
//         <div>
//             <Navbar />
//             <div className="container mx-auto p-4">
//                 <h1 className="text-2xl font-bold mb-4">Your Order</h1>
//                 {orderItems.length === 0 ? (
//                     <p>No items in your order.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                         {orderItems.map((item, index) => (
//                             <div key={index} className="border p-4 rounded shadow">
//                                 <img src={item.image} alt={item.name} className="h-32 w-32 object-cover" />
//                                 <h2 className="text-xl font-bold">{item.name}</h2>
//                                 <p>Price: PKR {item.price}</p>
//                                 <p>Quantity: {item.quantity}</p>
//                                 <p>Size: {item.size || 'N/A'}</p>
//                                 <p>Ordered on: {new Date().toDateString()}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OrderPage;
