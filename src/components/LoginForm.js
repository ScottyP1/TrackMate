'use client';

import { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa'; // Spinner for loader
import validator from 'validator';

export default function LoginForm() {
    const [data, setData] = useState({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const { state, signIn, clearError } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        clearError();
        if (state.token) {
            router.push('/Tracks');
        }
    }, [state.token]);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        if (!data.email || !validator.isEmail(data.email)) {
            return "Please enter a valid email address.";
        }
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const formError = validateForm();
        if (formError) {
            setError(formError);
            return;
        }
        await signIn({ email: data.email, password: data.password });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    return (
        <div className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-black">
                    <label htmlFor="email" className="block text-sm font-semibold text-white">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.email}
                        onChange={handleChange}
                        disabled={state.loading}
                    />
                </div>

                <div className="text-black relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
                    <input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                        value={data.password}
                        onChange={handleChange}
                        disabled={state.loading}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[43px] transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                        aria-label="Toggle password visibility"
                    >
                        {passwordVisible ? <HiEyeOff size={24} /> : <HiEye size={24} />}
                    </button>
                </div>

                {state.errorMessage || error ? (
                    <div className="text-red-500 text-center">
                        {state.errorMessage || error}
                    </div>
                ) : null}

                <div>
                    <button
                        type="submit"
                        className={`w-full py-3 min-h-[50px] bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 relative flex justify-center items-center ${state.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={state.loading}
                    >
                        {state.loading ? (
                            <FaSpinner className="animate-spin text-white absolute" size={24} />
                        ) : (
                            'Login'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
