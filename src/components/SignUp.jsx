"use client"
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import Navbar from '../components/Navbar';

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/'); // Navigate to the home page after successful sign-up
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSignUp} className="mt-4 space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
