'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';

import AvatarList from '@/components/AvatarList';

export default function Register() {
    const { state, register, clearError } = useContext(AuthContext);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        profileAvatar: '',
    });
    const router = useRouter();

    useEffect(() => {
        clearError();
    }, []);

    useEffect(() => {
        if (state.token) {
            router.push('/'); // Redirect to homepage after successful registration
        }
    }, [state.token, router]);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSelect = (avatar) => {
        setData((prevData) => ({ ...prevData, profileAvatar: avatar.src })); // Save the image path directly
    };


    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await register({
                name: data.name,
                email: data.email,
                password: data.password,
                profileAvatar: data.profileAvatar, // Send selected avatar
            });
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="mt-24 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8]  p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-6 ">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-white">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.name}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-white">
                            Email
                        </label>
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
                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-white">
                            Password
                        </label>
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
                    {/* Avatar Selection */}
                    <div>
                        <h1 className="text-white text-center mb-4">Select your Avatar</h1>
                        <AvatarList onSelect={onSelect} />
                    </div>
                    {/* Error Message */}
                    <div>
                        {state.errorMessage && (
                            <h1 className="text-red-500 text-center text-xl m-4">{state.errorMessage}</h1>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                <p className="text-white text-sm mt-2">
                    Already have an account? Click{' '}
                    <a href="/Login" className="text-blue-600 hover:underline">
                        here
                    </a>{' '}
                    to Login
                </p>
            </div>
        </div>
    );
}
