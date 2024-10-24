"use client"
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async (userId) => {
            setLoading(true);
            try {
                const q = query(collection(db, 'orders'), where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });
                setOrders(fetchedOrders);
            } catch (error) {
                setError('Error fetching orders: ' + error.message);
            }
            setLoading(false);
        };

        // Listen for authentication state change
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchOrders(user.uid);
            } else {
                router.push('/signin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-100">
                <h1 className="text-4xl font-bold mb-6">User Dashboard</h1>

                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 shadow-md rounded-lg">
                                <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                                <p className="mb-2"><strong>Status:</strong> {order.status}</p>
                                <p className="mb-2"><strong>Total:</strong> ${order.total}</p>
                                <p className="mb-4"><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

                                <div>
                                    <h3 className="font-semibold">Products:</h3>
                                    <ul className="list-disc list-inside">
                                        {order.products.map((product) => (
                                            <li key={product.productId}>
                                                {product.name} - Quantity: {product.quantity}, Price: ${product.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
