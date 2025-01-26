'use client';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import validator from 'validator';
import axiosInstance from '@/api/axios';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // Track the current step (1: email input, 2: code input)
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const validateEmail = () => {
        if (!email || !validator.isEmail(email)) {
            return 'Please enter a valid email address.';
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const emailError = validateEmail();
        if (emailError) {
            setError(emailError);
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post('/auth/PasswordResetRequest', { email });
            setMessage(res.data.message);
            setStep(2); // Move to the code input step
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!code) {
            setError('Please enter the verification code.');
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post('/auth/VerifyCode', { email, code });
            setMessage(res.data.message);

            // Redirect to the password reset page
            router.push(`/PasswordReset?code=${code}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-32 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8] p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
                    {step === 1 ? 'Password Recovery' : 'Verify Code'}
                </h1>
                <form onSubmit={step === 1 ? handleEmailSubmit : handleCodeSubmit} className="space-y-6">
                    {step === 1 && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={loading}
                            />
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <label htmlFor="code" className="block text-sm font-semibold text-white">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                placeholder="Enter the code sent to your email"
                                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={code}
                                onChange={handleCodeChange}
                                disabled={loading}
                            />
                        </div>
                    )}
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {message && <div className="text-green-500 text-center">{message}</div>}
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 relative flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin text-white absolute" size={24} />
                            ) : step === 1 ? (
                                'Send Reset Code'
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
