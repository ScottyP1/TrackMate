'use client';

import { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Add the eye icon library for visibility toggle

export default function LoginForm() {
    const [data, setData] = useState({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const { state, signIn, clearError } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        clearError();
    }, []);

    useEffect(() => {
        if (state.token) {
            router.push('/');
        }
    }, [state.token, router]);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        signIn({ email: data.email, password: data.password });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev); // Toggle password visibility
    };

    return (
        <div className="space-y-6">
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
                    />
                </div>

                <div className="text-black relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
                    <input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"  // Ensure padding-right for icon
                        value={data.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[43px] transform -translate-y-1/2"  // Adjust vertical centering
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? <HiEyeOff size={24} /> : <HiEye size={24} />}
                    </button>
                </div>

                {state.errorMessage && (
                    <div className="text-red-500 text-center">
                        {state.errorMessage}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
