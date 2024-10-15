"use client"
import { useState } from 'react';
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const router = useRouter();

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.log(error.message);
        }
    };

    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
        }, auth);
    };

    const handlePhoneLogin = async () => {
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
            window.confirmationResult = confirmationResult;
            setShowOtpInput(true);
        } catch (error) {
            console.log(error.message);
        }
    };

    const verifyOtp = async () => {
        try {
            const confirmationResult = window.confirmationResult;
            await confirmationResult.confirm(otp);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Sign In</h1>

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Email"
                    className="border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 mt-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleEmailLogin} className="bg-blue-500 text-white px-4 py-2 mt-2">
                    Sign In with Email
                </button>
            </div>

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Phone number"
                    className="border p-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {showOtpInput && (
                    <input
                        type="text"
                        placeholder="OTP"
                        className="border p-2 mt-2"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                )}
                <button onClick={handlePhoneLogin} className="bg-green-500 text-white px-4 py-2 mt-2">
                    Send OTP
                </button>
                {showOtpInput && (
                    <button onClick={verifyOtp} className="bg-green-500 text-white px-4 py-2 mt-2">
                        Verify OTP
                    </button>
                )}
            </div>

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default SignIn;
