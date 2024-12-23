"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from 'react-otp-input';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Function to check user role from Firestore
    const checkUserRole = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    router.push('/admin-dashboard'); // Redirect to admin dashboard
                } else {
                    router.push('/user-dashboard'); // Redirect to user dashboard
                }
            } else {
                setError('User role not found');
            }
        } catch (error) {
            setError('Error fetching user role: ' + error.message);
        }
    };

    const handleEmailLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Check role after login
            await checkUserRole(user);
            router.push('/');
        } catch (error) {
            setError(error.message);
        }
    };

    const setUpRecaptcha = () => {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                    size: 'invisible',
                    callback: (response) => {
                        console.log('Recaptcha verified');
                    },
                    'expired-callback': () => {
                        console.log('Recaptcha expired, please try again.');
                    }
                }, auth);
            }
        } catch (error) {
            console.log('Error setting up recaptcha: ', error);
        }
    };

    const handlePhoneLogin = async () => {
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        if (phone) {
            try {
                const formattedPhone = `+${phone}`; // Ensures that phone has `+` and country code
                const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
                window.confirmationResult = confirmationResult;
                setShowOtpInput(true);
            } catch (error) {
                setError(error.message);
            }
        } else {
            setError('Please enter a valid phone number');
        }
    };

    const verifyOtp = async () => {
        try {
            const confirmationResult = window.confirmationResult;
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            // Check role after login
            await checkUserRole(user);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Sign In</h1>

            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Email Sign In</h2>
                    <input
                        type="text"
                        placeholder="Email"
                        className="border p-3 w-full rounded-md mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-3 w-full rounded-md mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleEmailLogin}
                        className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600"
                    >
                        Sign In with Email
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Phone Sign In</h2>
                    <PhoneInput
                        country={'us'}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        containerStyle={{ marginBottom: '10px' }}
                    />
                    {showOtpInput && (
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            isInputNum={true}
                            separator={<span>-</span>}
                            inputStyle="border p-3 w-full rounded-md text-center mb-3"
                        />
                    )}
                    <button
                        onClick={handlePhoneLogin}
                        className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600 mb-3"
                    >
                        Send OTP
                    </button>
                    {showOtpInput && (
                        <button
                            onClick={verifyOtp}
                            className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600"
                        >
                            Verify OTP
                        </button>
                    )}
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
};

export default SignIn;



// "use client"
// import { useState } from 'react';
// import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import { auth } from '../lib/firebase';
// import { useRouter } from 'next/navigation';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import OtpInput from 'react-otp-input';
// // import { auth } from '@/lib/firebase';

// const SignIn = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [phone, setPhone] = useState('');
//     const [otp, setOtp] = useState('');
//     const [showOtpInput, setShowOtpInput] = useState(false);
//     const [error, setError] = useState('');

//     const router = useRouter();

//     const handleEmailLogin = async () => {
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             router.push('/');
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     const setUpRecaptcha = () => {
//         try {
//             if (!window.recaptchaVerifier) {
//                 window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
//                     size: 'invisible',
//                     callback: (response) => {
//                         console.log('Recaptcha verified');
//                     },
//                     'expired-callback': () => {
//                         console.log('Recaptcha expired, please try again.');
//                     }
//                 }, auth);
//             }
//         } catch (error) {
//             console.log('Error setting up recaptcha: ', error);
//         }
//     };

//     const handlePhoneLogin = async () => {
//         setUpRecaptcha();
//         const appVerifier = window.recaptchaVerifier;

//         if (phone) {
//             try {
//                 const formattedPhone = `+${phone}`; // Ensures that phone has `+` and country code
//                 const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
//                 window.confirmationResult = confirmationResult;
//                 setShowOtpInput(true);
//             } catch (error) {
//                 setError(error.message);
//             }
//         } else {
//             setError('Please enter a valid phone number');
//         }
//     };

//     const verifyOtp = async () => {
//         try {
//             const confirmationResult = window.confirmationResult;
//             await confirmationResult.confirm(otp);
//             router.push('/');
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <h1 className="text-4xl font-bold mb-6">Sign In</h1>

//             <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
//                 <div className="mb-6">
//                     <h2 className="text-2xl font-semibold mb-4">Email Sign In</h2>
//                     <input
//                         type="text"
//                         placeholder="Email"
//                         className="border p-3 w-full rounded-md mb-3"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         className="border p-3 w-full rounded-md mb-3"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button
//                         onClick={handleEmailLogin}
//                         className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600"
//                     >
//                         Sign In with Email
//                     </button>
//                 </div>

//                 <div className="mb-6">
//                     <h2 className="text-2xl font-semibold mb-4">Phone Sign In</h2>
//                     <PhoneInput
//                         country={'us'}
//                         value={phone}
//                         onChange={(phone) => setPhone(phone)}
//                         // inputStyle={{ width: '100%', padding: '10px' }}
//                         containerStyle={{ marginBottom: '10px' }}
//                     />
//                     {showOtpInput && (
//                         <OtpInput
//                             value={otp}
//                             onChange={setOtp}
//                             numInputs={6}
//                             isInputNum={true}
//                             separator={<span>-</span>}
//                             inputStyle="border p-3 w-full rounded-md text-center mb-3"
//                         />
//                     )}
//                     <button
//                         onClick={handlePhoneLogin}
//                         className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600 mb-3"
//                     >
//                         Send OTP
//                     </button>
//                     {showOtpInput && (
//                         <button
//                             onClick={verifyOtp}
//                             className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600"
//                         >
//                             Verify OTP
//                         </button>
//                     )}
//                 </div>

//                 {error && <p className="text-red-500 text-center mt-4">{error}</p>}

//                 <div id="recaptcha-container"></div>
//             </div>
//         </div>
//     );
// };

// export default SignIn;