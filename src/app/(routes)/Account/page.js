'use client'
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";
import { TrackCard } from "@/components/Track/TrackCard";

export default function Account() {
    const { state: authState } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');

    // Initialize formData with user data if available
    useEffect(() => {
        if (authState.user) {
            setFormData({ name: authState.user.name || '', email: authState.user.email || '' });
        }
    }, [authState.user]);

    // Fetch favorite tracks if the user has favorites
    useEffect(() => {
        if (authState.user && authState.user.favorites && authState.user.favorites.length > 0) {
            if (trackState.favoriteTracks.length === 0) {
                fetchFavoriteTracks(authState.user.favorites);
            }
        }
    }, [authState.user, trackState.favoriteTracks]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Example logic for form submission
        setMessage("Profile updated successfully!");
        // You can add actual logic for updating the profile if needed
    };

    return (
        <div className="mt-24 p-4">
            <h1 className="text-white text-center">Account</h1>
            {message && <div className="text-center text-green-500">{message}</div>}

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
                        disabled
                    />
                </label>
                <button
                    type="submit"
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Profile
                </button>
            </form>

            <div className="mt-8">
                <h2 className="text-white text-center">Your Favorite Tracks</h2>

                {trackState.favoriteTracks?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                        {trackState.favoriteTracks.map((track) => (
                            <TrackCard key={track.id} track={track} />
                        ))}
                    </div>
                ) : (
                    <p className="text-white text-center mt-4">You don't have any favorite tracks yet.</p>
                )}
            </div>
        </div>
    );
}
