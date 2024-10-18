// "use client"
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth } from '../lib/firebase';
// import { useRouter } from 'next/navigation';
// import { FaShoppingCart } from 'react-icons/fa';
// import { useSelector } from 'react-redux';

// const Navbar = () => {

//     const cartItems = useSelector(state => state.cart.cartItems);

//     const [user, setUser] = useState(null);

//     const router = useRouter();

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUser(user);
//             } else {
//                 setUser(null);
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const handleSignOut = async () => {
//         await signOut(auth);
//         router.push("/signin");
//     };

//     return (
//         <nav className="bg-gray-800 p-4">
//             <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//                 <h1 className="text-white">My E-commerce App</h1>
//                 <div className="space-x-4 flex flex-col md:flex-row justify-center items-center">
//                     {user ? (
//                         <>
//                             <Link href="/" className="text-white">Home</Link>
//                             <Link href="/products" className="text-white">Products</Link>
//                             <span className="text-white">Welcome, {user.email}</span>
//                             <Link href="/cart" className="relative text-white">
//                                 <FaShoppingCart className="text-2xl" />
//                                 {cartItems.length > 0 && (
//                                     <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                                         {cartItems.length}
//                                     </span>
//                                 )}
//                             </Link>
//                             <button onClick={handleSignOut} className="text-white">
//                                 Sign Out
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link href="/" className="text-white">Home</Link>
//                             <Link href="/signin" className="text-white">
//                                 Sign In
//                             </Link>
//                             <Link href="/signup" className="text-white">
//                                 Sign Up
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase'; // Ensure db is imported from your Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Navbar = () => {

    const [user, setUser] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);

    const router = useRouter();

    const cartItems = useSelector(state => state.cart.cartItems);

    // Listen to authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchCartItemCount(currentUser.uid); // Fetch cart items for the logged-in user
            } else {
                setUser(null);
                setCartItemCount(0); // Reset cart count if no user is logged in
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch the cart item count from Firestore
    const fetchCartItemCount = async (userId) => {
        try {
            console.log("Fetching cart items for userId:", userId); // Debugging
            const cartCollection = collection(db, 'cart');
            const q = query(cartCollection, where('userId', '==', userId)); // Fetch only the logged-in user's cart items
            const cartSnapshot = await getDocs(q);

            if (!cartSnapshot.empty) {
                const cartItems = cartSnapshot.docs.map(doc => doc.data());
                console.log("Cart items fetched:", cartItems); // Debugging

                // Assuming each item has a `quantity` field
                const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
                setCartItemCount(itemCount);
            } else {
                console.log("No cart items found for user:", userId); // Debugging
                setCartItemCount(0); // No items found, set to 0
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItemCount(0); // Handle error by resetting cart count to 0
        }
    };

    // Handle user sign out
    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/signin');
    };

    // Listen for changes in Redux cartItems and update cartItemCount
    useEffect(() => {
        if (user) {
            // Calculate the item count directly from Redux state
            const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
            setCartItemCount(itemCount);
        }
    }, [cartItems, user]);

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-white">My E-commerce App</h1>
                <div className="space-x-4 flex flex-col md:flex-row justify-center items-center">
                    {user ? (
                        <>
                            <Link href="/" className="text-white">Home</Link>
                            <Link href="/products" className="text-white">Products</Link>
                            <span className="text-white">Welcome, {user.email}</span>
                            <Link href="/cart" className="relative text-white">
                                <FaShoppingCart className="text-2xl" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={handleSignOut} className="text-white">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/" className="text-white">Home</Link>
                            <Link href="/signin" className="text-white">
                                Sign In
                            </Link>
                            <Link href="/signup" className="text-white">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


