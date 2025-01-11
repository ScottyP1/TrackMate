'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Add the eye icon library for visibility toggle

import AvatarList from '@/components/AvatarList';
import validator from 'validator'; // Import validator for email validation and sanitization

export default function Register() {
    const { state, register, clearError } = useContext(AuthContext);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        profileAvatar: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect(() => {
        clearError();
    }, []);

    useEffect(() => {
        if (state.token) {
            router.push('/'); // Redirect to homepage after successful registration
        }
    }, [state.token, router]);

    // Handle changes to input fields
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle avatar selection
    const onSelect = (avatar) => {
        const cleanedPath = avatar.src
            .replace('/_next/static/media', '/Avatars')  // Replace the path part
            .split('.')
        setData((prevData) => ({ ...prevData, profileAvatar: `${cleanedPath[0]}.${cleanedPath[2]}` }));
    };
    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev); // Toggle password visibility
    };

    // Frontend validation and sanitization
    const validateForm = () => {
        const newErrors = {};

        // Validate name (trim and check for non-empty)
        if (!data.name.trim()) {
            newErrors.name = 'Name is required.';
        }

        // Validate email (trim and check if valid)
        const sanitizedEmail = validator.trim(data.email.toLowerCase());
        if (!sanitizedEmail || !validator.isEmail(sanitizedEmail)) {
            newErrors.email = 'Please enter a valid email.';
        }

        // Validate password (check length and basic strength)
        if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        // Validate avatar selection
        if (!data.profileAvatar) {
            newErrors.profileAvatar = 'Please select an avatar.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            return;
        }

        try {
            // Perform the registration action
            await register({
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(), // Ensure email is sanitized
                password: data.password,
                profileAvatar: data.profileAvatar, // Send selected avatar
            });
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="mt-24 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8] p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="text-black">
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
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="text-black">
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
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="text-black relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-white">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={passwordVisible ? 'text' : 'password'} // Toggle input type based on state
                            placeholder="Enter your password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12" // Added padding-right for icon
                            value={data.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-[43px] transform -translate-y-1/2"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? <HiEyeOff size={24} /> : <HiEye size={24} />}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Avatar Selection */}
                    <div>
                        <h1 className="text-white text-center mb-4">Select your Avatar</h1>
                        <AvatarList onSelect={onSelect} />
                        {errors.profileAvatar && <p className="text-red-500 text-sm">{errors.profileAvatar}</p>}
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
