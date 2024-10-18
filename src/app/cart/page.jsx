"use client";
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [sizes, setSizes] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchCartItems = async () => {
            const cartCollection = collection(db, 'cart');
            const cartSnapshot = await getDocs(cartCollection);
            const items = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCartItems(items);
            calculateTotalPrice(items); // Calculate initial total price
        };

        fetchCartItems();
    }, []);

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
                await updateDoc(doc(db, 'cart', id), { quantity: newQuantity }); // Update Firestore
                const updatedCartItems = cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
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
                await updateDoc(doc(db, 'cart', id), { quantity: newQuantity }); // Update Firestore
                const updatedCartItems = cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
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

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4 mb-8">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="border p-4 rounded shadow">
                                <img src={item.image} alt={item.name} className="h-32 w-32 object-cover" />
                                <h2 className="text-xl font-bold">{item.name}</h2>
                                <p>Price: ${item.price.toFixed(2)}</p>
                                <p>Quantity: {item.quantity}</p>
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
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleIncrement(item.id)}
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleDecrement(item.id)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded ml-2"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleBuy(item.id)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded ml-2"
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
                <div className="mt-4">
                    <h3 className="text-xl font-bold">Total Price: ${totalPrice.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default Cart;
