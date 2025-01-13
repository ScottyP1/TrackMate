'use client';
import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Cookies from "js-cookie";

import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";

import { TrackCard } from "@/components/Track/TrackCard";
import PageSpinner from "@/components/spinners/PageSpinner";

export default function UserProfile() {
    const { state: authState, fetchOtherUserProfile } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const [user, setUser] = useState(null);  // State to hold the visited user
    const router = useRouter();

    const pathname = usePathname();
    const userIdFromUrl = pathname.split('/').pop();
    const loggedInUserId = Cookies.get('userId');

    // This useEffect handles user profile fetch and redirect logic
    useEffect(() => {
        // Prevent redirect and fetch if we're visiting our own profile
        if (userIdFromUrl === loggedInUserId) {
            router.push('/Account');
            return;
        }

        // Fetch user profile only once
        fetchOtherUserProfile(userIdFromUrl)
            .catch((error) => {
                console.error("Error fetching user profile:", error);
            });
    }, []);

    // This useEffect will update the user data only if the visitedUser data changes
    useEffect(() => {
        const visitedUser = authState.visitedUser;
        if (visitedUser) {
            setUser(visitedUser);
        }

        // Fetch the visited user's favorite tracks if any
        if (visitedUser?.favorites?.length) {
            fetchFavoriteTracks(visitedUser.favorites, true);  // Pass `true` to indicate it's the visited user's favorites
        }
    }, [authState.visitedUser]);

    return (
        <div className="mt-24 p-4">
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
                <PageSpinner />
            )}

            {/* Favorite Tracks Section */}
            {user && (
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Favorited Tracks</h1>

                    {trackState.visitedUserFavoriteTracks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {trackState.visitedUserFavoriteTracks.map((track) => (
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
