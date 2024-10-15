"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

const Navbar = () => {

    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/signin");
    };

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
                            <button onClick={handleSignOut} className="text-white">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
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
