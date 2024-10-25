"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [sizes, setSizes] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user); // Set the user when logged in
            } else {
                setCurrentUser(null); // Reset if the user logs out
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!currentUser) return; // Ensure user is logged in

            const cartCollection = collection(db, 'cart');
            const cartQuery = query(cartCollection, where('userId', '==', currentUser.uid));
            const cartSnapshot = await getDocs(cartQuery);
            const items = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setCartItems(items);
            calculateTotalPrice(items);
        };

        fetchCartItems();
    }, [currentUser]);

    // Helper to calculate total price
    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'cart', id)); // Remove item from Firestore
            const updatedCartItems = cartItems.filter(item => item.id !== id);
            setCartItems(updatedCartItems); // Update UI after deletion
            calculateTotalPrice(updatedCartItems); // Recalculate total price
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Handle increment quantity
    const handleIncrement = async (id) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            try {
                const newQuantity = item.quantity + 1;
                const newPrice = parseFloat(item.price / item.quantity) * newQuantity; // Adjust individual price based on quantity

                await updateDoc(doc(db, 'cart', id), { quantity: newQuantity, price: newPrice }); // Update Firestore

                const updatedCartItems = cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity, price: newPrice } : item
                );

                setCartItems(updatedCartItems); // Update UI after increment
                calculateTotalPrice(updatedCartItems); // Recalculate total price
            } catch (error) {
                console.error('Error incrementing quantity:', error);
            }
        }
    };

    // Handle decrement quantity
    const handleDecrement = async (id) => {
        const item = cartItems.find(item => item.id === id);
        if (item && item.quantity > 1) {
            try {
                const newQuantity = item.quantity - 1;
                const newPrice = parseFloat(item.price / item.quantity) * newQuantity; // Adjust individual price based on quantity

                await updateDoc(doc(db, 'cart', id), { quantity: newQuantity, price: newPrice }); // Update Firestore

                const updatedCartItems = cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity, price: newPrice } : item
                );

                setCartItems(updatedCartItems); // Update UI after decrement
                calculateTotalPrice(updatedCartItems); // Recalculate total price
            } catch (error) {
                console.error('Error decrementing quantity:', error);
            }
        }
    };

    const handleSizeChange = (id, size) => {
        setSizes(prevSizes => ({ ...prevSizes, [id]: size }));
    };

    const handleBuy = (productId) => {
        router.push(`/order?productId=${productId}`);
    };

    const handleBuyAll = () => {
        // router.push('/order?all=true');
        router.push('/checkout');
    };


    return (
        <div>
            <div className="container mx-auto p-4 mb-8">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between gap-4 border p-4 mb-2 rounded shadow">
                                <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
                                <h2 className="text-xl font-bold">{item.name}</h2>
                                <p>Price: PKR {Number(item.price).toFixed(2)}</p>

                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleIncrement(item.id)}
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                    >
                                        +
                                    </button>
                                    <p className="mx-2">Quantity: {item.quantity}</p>
                                    <button
                                        onClick={() => handleDecrement(item.id)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        -
                                    </button>
                                </div>

                                <div>
                                    <label htmlFor={`size-${item.id}`}>Size:</label>
                                    <select
                                        id={`size-${item.id}`}
                                        value={sizes[item.id] || ''}
                                        onChange={(e) => handleSizeChange(item.id, e.target.value)}
                                        className="ml-2 border p-1"
                                    >
                                        <option value="">Select a size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>
                                <div className="">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <h3 className="text-xl font-bold">Total Price: PKR {totalPrice.toFixed(2)}</h3>
                    <button
                        onClick={handleBuyAll}
                        className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;