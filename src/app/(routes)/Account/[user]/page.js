'use client';

import { useState, useEffect, useContext, useRef } from "react";
import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";
import { usePathname, useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { TrackCard } from "@/components/Track/TrackCard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile() {
    const { state: authState, fetchUserProfile } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const pathname = usePathname();
    const userIdFromUrl = pathname.split('/').pop();  // Assuming the URL is /account/[userId]

    const loggedInUserId = Cookies.get('userId');
    const initialFetchDone = useRef(false);  // Ref to track the initial fetch state

    // Redirect to /account if the user is viewing their own profile
    useEffect(() => {
        if (userIdFromUrl === loggedInUserId) {
            router.push('/Account');  // Redirect to your own account page
        }
    }, [userIdFromUrl, loggedInUserId, router]);

    // Fetch the user profile only if the URL's userId is different from the logged-in userId
    useEffect(() => {
        if (!initialFetchDone.current && userIdFromUrl !== loggedInUserId) {
            initialFetchDone.current = true; // Ensure this fetch only happens once
            fetchUserProfile(userIdFromUrl); // Fetch the other user's profile
        }
    }, [userIdFromUrl, loggedInUserId, fetchUserProfile]);

    // Set user data and fetch favorite tracks once the user profile is fetched
    useEffect(() => {
        if (authState.user && authState.user._id === userIdFromUrl && user !== authState.user) {
            setUser(authState.user);  // Only set the user if it's a new user profile
            if (authState.user.favorites?.length) {
                fetchFavoriteTracks(authState.user.favorites); // Fetch favorite tracks if available
            }
        }
    }, [authState.user, userIdFromUrl, fetchFavoriteTracks, user]);

    return (
        <div className="mt-24 p-4">
            {/* Toast Notifications Container */}
            <ToastContainer />

            {/* User Info Card */}
            {user ? (
                <div className="bg-black/[.8] p-6 rounded-lg shadow-lg mb-8">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 place-items-center">
                        {/* Avatar */}
                        <div className="relative flex flex-col items-center ">
                            <img
                                src={user.profileAvatar || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">{user.name}</h2>
                            <p className="text-gray-400 text-sm md:text-xl email-truncate">{user.email}</p>
                        </div>

                        {/* Fav Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Favorites</h2>
                            <p className="text-gray-400 text-sm md:text-xl">{user.favorites?.length || 0}</p>
                        </div>

                        {/* Posted Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Posted</h2>
                            <p className="text-gray-400 text-sm md:text-xl">0</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-white">Loading...</p>
            )}

            {/* Favorite Tracks Section */}
            {user && (
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Favorited Tracks</h1>

                    {trackState.favoriteTracks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {trackState.favoriteTracks.map((track) => (
                                <TrackCard key={track.id} track={track} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center mt-4">This user doesn't have any favorite tracks yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
