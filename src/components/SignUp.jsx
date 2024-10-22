"use client";
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const SignUp = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [adminKey, setAdminKey] = useState(''); // Admin key input
    const [error, setError] = useState('');

    const ADMIN_KEY = 'mySecretAdminKey'; // Replace this with a real secure key

    // Function to add user to Firestore with either 'user' or 'admin' role
    const addUserToFirestore = async (user) => {
        try {
            const role = adminKey === ADMIN_KEY ? 'admin' : 'user'; // Check if admin key is correct
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: user.email,
                phone: phone,
                role: role, // Assign role based on key input
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding user to Firestore: ", error);
            setError("Failed to save user data.");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user to Firestore
            await addUserToFirestore(user);

            // Navigate to the home page after successful sign-up
            router.push('/');
        } catch (error) {
            setError(error.message); // Set error message
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4 w-full md:w-1/2">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSignUp} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
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
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Admin Key (optional)"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        className="border p-2 w-full"
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



// "use client"
// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { useRouter } from 'next/navigation';
// import { auth, db } from '../lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';
// import Navbar from '../components/Navbar';

// const SignUp = () => {
//     const router = useRouter();
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [phone, setPhone] = useState('');
//     const [error, setError] = useState('');

//     // Function to add user to Firestore
//     const addUserToFirestore = async (user) => {
//         try {
//             await setDoc(doc(db, 'users', user.uid), {
//                 uid: user.uid,
//                 name: name,
//                 email: user.email,
//                 phone: phone,
//                 createdAt: new Date(),
//                 // Add more fields if necessary
//             });
//         } catch (error) {
//             console.error("Error adding user to Firestore: ", error);
//             setError("Failed to save user data.");
//         }
//     };

//     const handleSignUp = async (e) => {
//         e.preventDefault();
//         setError(''); // Reset error message
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;

//             // Add user to Firestore
//             await addUserToFirestore(user);

//             // Navigate to the home page after successful sign-up
//             router.push('/');
//         } catch (error) {
//             setError(error.message); // Set error message
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="container mx-auto p-4 w-full md:w-1/2">
//                 <h1 className="text-3xl font-bold">Sign Up</h1>
//                 {error && <p className="text-red-500">{error}</p>}
//                 <form onSubmit={handleSignUp} className="mt-4 space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="border p-2 w-full"
//                         required
//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="border p-2 w-full"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="border p-2 w-full"
//                         required
//                     />
//                     <input
//                         type="tel"
//                         placeholder="Phone Number"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         className="border p-2 w-full"
//                         required
//                     />
//                     <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//                         Sign Up
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignUp;
