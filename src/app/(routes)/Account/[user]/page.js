'use client';

import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from 'next/navigation';

import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";
import { Context as InboxContext } from "@/context/InboxContext";  // Import InboxContext

import { TrackCard } from "@/components/Track/TrackCard";
import PageSpinner from "@/components/spinners/PageSpinner";
import { TrackCardSkeleton } from "@/components/Track/TrackCardSkeleton";

export default function UserProfile() {
    const { state: authState, fetchOtherUserProfile } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const { sendMessage } = useContext(InboxContext);  // Access sendMessage from InboxContext

    const [user, setUser] = useState(null);  // State to hold the visited user
    const [messageText, setMessageText] = useState("");  // State to hold the composed message
    const [isMessageFormVisible, setIsMessageFormVisible] = useState(false);  // Toggle to show message form
    const [isSending, setIsSending] = useState(false);  // State for handling message sending status
    const router = useRouter();

    const pathname = usePathname();
    const userIdFromUrl = pathname.split('/').pop(); // Extract user ID from the URL path
    const loggedInUserId = authState.user?.id;

    // Fetch user profile and handle redirect logic
    useEffect(() => {
        // Prevent user from messaging themselves
        if (userIdFromUrl === loggedInUserId) {
            router.push('/Account');
            return;
        }

        // Fetch other user's profile (for the visited user)
        fetchOtherUserProfile(userIdFromUrl)
            .catch((error) => {
                console.error("Error fetching user profile:", error);
            });
    }, [userIdFromUrl]);

    // Update visited user data and fetch their favorite tracks
    useEffect(() => {
        const visitedUser = authState.visitedUser;
        if (visitedUser) {
            setUser(visitedUser); // Update user data with the visited user
        }

        // Fetch the visited user's favorite tracks if any
        if (visitedUser?.favorites?.length) {
            fetchFavoriteTracks(visitedUser.favorites, true);  // Fetch their favorites
        }
    }, [authState.visitedUser]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!messageText.trim()) return; // Don't send empty messages

        setIsSending(true);
        try {
            // Send message using sendMessage from InboxContext
            await sendMessage(authState.user.email, user.email, messageText);
            setMessageText('');  // Clear the input after sending the message
            router.push('/Inbox');  // Optionally redirect to inbox after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

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
                            {/* Message Block */}
                            <div className="mt-4 text-white text-sm md:text-base text-center">
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg"
                                    onClick={() => setIsMessageFormVisible(true)}  // Toggle form visibility
                                >
                                    Message
                                </button>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">{user.name}</h2>
                            {/* <p className="text-gray-400 text-sm md:text-xl email-truncate">{user.email}</p> */}
                        </div>

                        {/* Fav Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Favorites</h2>
                            <p className="text-gray-400 text-sm md:text-xl">{user.favorites?.length || 0}</p>
                        </div>

                        {/* Posted Tracks */}
                        <div className="flex flex-col items-center ">
                            <h2 className="text-white text-md md:text-2xl font-semibold">Owned</h2>
                            <p className="text-gray-400 text-sm md:text-xl">0</p>
                        </div>
                    </div>
                </div>
            ) : (
                <PageSpinner />
            )}

            {/* Message Form (Visible when the 'Message' button is clicked) */}
            {isMessageFormVisible && user && (
                <div className="mt-4 w-full">
                    <textarea
                        className="w-full p-2 rounded-lg bg-black/[.8] color-white"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows="4"
                    />
                    <button
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg"
                        onClick={handleSendMessage}
                        disabled={isSending}
                    >
                        {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            )}

            {/* Favorite Tracks Section */}
            {user && (
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Favorited Tracks</h1>
                    {trackState.loading && <TrackCardSkeleton />}
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
