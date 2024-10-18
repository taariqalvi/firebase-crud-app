"use client";
import Navbar from '@/components/Navbar';
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
        } else {
            router.push('/signin'); // Redirect to signin if no user is logged in
        }
    }, [user]);

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
            <Navbar />
            <div className="container mx-auto p-4 mb-8">
                <h1 className="text-2xl font-bold mb-4">Your Order</h1>

                {orderedItems.length === 0 ? (
                    <p>Your order is empty.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                </div>
                            ))}
                        </div>

                        {/* Total Price Section */}
                        <div className="mt-8">
                            <h2 className="text-xl font-bold">Total Price: ${totalPrice.toFixed(2)}</h2>
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

