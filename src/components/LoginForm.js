'use client';

import { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';  // Import from 'next/navigation'
import { Context as AuthContext } from '@/context/AuthContext';

export default function LoginForm() {
    const [data, setData] = useState({ email: '', password: '' });
    const { state, signIn, clearError } = useContext(AuthContext);  // Access state for error handling
    const router = useRouter(); // Use useRouter from 'next/navigation'

    useEffect(() => {
        clearError();
    }, []);

    // Redirect if the token is set
    useEffect(() => {
        if (state.token) {
            router.push('/'); // Redirect to homepage after successful login
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

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-black">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
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

                <div className="text-black">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Display error message if login fails */}
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
