'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa'; // Spinner for loader
import axiosInstance from '@/api/axios';

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code'); // Get the reset token from the URL

    const validatePassword = () => {
        if (!newPassword || newPassword.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (newPassword !== confirmPassword) {
            return 'Passwords do not match.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const passwordError = validatePassword();
        if (passwordError) {
            setError(passwordError);
            return;
        }
        setLoading(true);

        try {
            const res = await axiosInstance.post('/auth/PasswordReset', {
                code,
                newPassword,
            });
            setMessage(res.data.message);
            router.push('/Login')
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-32 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8] p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-white">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type='text'
                            placeholder="Enter your new password"
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="text"
                            placeholder="Confirm your new password"
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {message && <div className="text-green-500 text-center">{message}</div>}
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 min-h-[50px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 relative flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin text-white absolute" size={24} />
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
