"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { Context as AuthContext } from "@/context/AuthContext";

export default function Account() {
    const { state, fetchUser, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');
    const router = useRouter(); // Use the new router hook

    useEffect(() => {
        if (state.userEmail && !state.user) {
            fetchUser(state.userEmail);
        } else if (state.user) {
            setFormData({ name: state.user.name, email: state.user.email });
        }
    }, [state.userEmail, state.user]);

    useEffect(() => {
        if (!state.user && !state.loading) {
            router.push('/Login'); // Redirect to the login page if the user is not logged in
        }
    }, [state.user, state.loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ email: state.userEmail, updates: formData });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile.');
        }
    };

    if (state.loading) {
        return <div className="mt-24 text-white text-center">Loading...</div>;
    }

    if (state.errorMessage) {
        return <div className="mt-24 text-red-500">{state.errorMessage}</div>;
    }

    return (
        <div className="mt-24">
            <h1 className="text-white text-center">Account</h1>
            <div className="text-center text-green-500">{message}</div>
            <form onSubmit={handleSubmit} className="text-white">
                <label className="block">
                    Name:
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full mt-2 p-2 bg-gray-800 text-white"
                    />
                </label>
                <label className="block mt-4">
                    Email:
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full mt-2 p-2 bg-gray-800 text-white"
                        disabled // Email should not be editable
                    />
                </label>
                <button
                    type="submit"
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}
