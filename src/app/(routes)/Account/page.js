'use client';

import { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { redirect } from 'next/navigation';

import { TrackCard } from "@/components/Track/TrackCard";
import { TrackCardSkeleton } from "@/components/Track/TrackCardSkeleton";  // Import TrackCardSkeleton
import AvatarList from "@/components/AvatarList";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
    const { state: authState, updateUser, loadTokenAndUser } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const [formData, setFormData] = useState({ name: '', email: '', profileAvatar: '' });
    const [menu, setMenu] = useState(false);

    // Fetch favorite tracks if the user has favorites
    useEffect(() => {
        loadTokenAndUser();

        const token = Cookies.get('authToken');
        if (!token) {
            redirect('/');
        }
    }, []);

    useEffect(() => {
        if (authState.user) {
            setFormData({
                name: authState.user.name || '',
                email: authState.user.email || '',
                profileAvatar: authState.user.profileAvatar || '',
            });

            // Fetch favorite tracks if the user is loaded
            fetchFavoriteTracks(authState.user.favorites);
        }
    }, [authState.user.favorites]);  // Ensure this effect runs when authState.user changes

    const onSelect = (avatar) => {
        const cleanedPath = avatar.src
            .replace('/_next/static/media', '/Avatars')  // Replace the path part
            .split('.');
        setFormData((prevData) => ({ ...prevData, profileAvatar: `${cleanedPath[0]}.${cleanedPath[2]}` }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = formData.email;
        const updates = {
            name: formData.name,
            profileAvatar: formData.profileAvatar,
        };

        updateUser({ email, updates });  // Call your update function
        toast.success('Profile updated successfully!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark"
        });
        setMenu(false);  // Close the update form after submission
    };

    return (
        <div className="mt-24 p-4">
            {/* Toast Notifications Container */}
            <ToastContainer />
            {/* User Info Card */}
            {authState.user &&
                <div className="bg-black/[.8] p-6 rounded-lg shadow-lg mb-8">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 place-items-center">
                        {/* Avatar */}
                        <div className="relative flex flex-col items-center ">
                            <img
                                src={authstate.profileAvatar || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                            />
                            {/* Pencil Icon */}
                            <button
                                onClick={() => setMenu(!menu)}
                                className="absolute top-0 right-0 bg-gray-700 p-1 rounded-full text-white"
                                style={{ transform: 'translate(20%, -20%)' }}
                            >
                                <FaPen />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">{formData.name}</h2>
                            <p className="text-gray-400 text-sm md:text-xl email-truncate">{formData.email}</p>
                        </div>

                        {/* Fav Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Favorites</h2>
                            <p className="text-gray-400 text-sm md:text-xl">{authState.user?.favorites?.length}</p>
                        </div>

                        {/* Posted Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Posted</h2>
                            <p className="text-gray-400 text-sm md:text-xl">0</p>
                        </div>
                    </div>
                </div>
            }

            {/* Profile Update Form */}
            {menu &&
                <form onSubmit={handleSubmit} className="text-white bg-black/[.8] p-6 rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl mb-6">Select new avatar</h2>
                    <AvatarList selectedAvatar={formData.profileAvatar} onSelect={onSelect} classes='justify-self-center' />

                    <label className="block mt-4">
                        Name:
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="block w-full mt-2 p-2 bg-gray-900 text-white rounded"
                        />
                    </label>
                    <label className="block mt-4">
                        Email:
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="block w-full mt-2 p-2 bg-gray-900 text-gray-500 rounded"
                            disabled
                        />
                    </label>
                    <button
                        type="submit"
                        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => setMenu(false)}
                        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
                    >
                        Cancel
                    </button>
                </form>
            }

            {/* Favorite Tracks Section */}
            {authState.user &&
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Favorited Tracks</h1>

                    {trackState.loading ? (
                        // Show skeleton cards while loading
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array(4).fill(null).map((_, index) => (
                                <TrackCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : trackState.favoriteTracks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {trackState.favoriteTracks.map((track) => (
                                <TrackCard key={track.id} track={track} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center mt-4">You don't have any favorite tracks yet.</p>
                    )}
                </div>
            }
        </div>
    );
}
