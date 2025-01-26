'use client'
import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from 'next/navigation';

import { Context as AuthContext } from "@/context/AuthContext";
import { Context as TrackContext } from "@/context/TrackContext";
import { Context as InboxContext } from "@/context/InboxContext";

import { TrackCard } from "@/components/Track/TrackCard";
import PageSpinner from "@/components/spinners/PageSpinner";
import { TrackCardSkeleton } from "@/components/Track/TrackCardSkeleton";
import FriendCard from "@/components/FriendCard";

export default function UserProfile() {
    const { state: authState, fetchOtherUserProfile, updateUser } = useContext(AuthContext);
    const { state: trackState, fetchFavoriteTracks } = useContext(TrackContext);
    const { sendMessage } = useContext(InboxContext);

    const [user, setUser] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [isMessageFormVisible, setIsMessageFormVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedTab, setSelectedTab] = useState("favorites"); // Default tab to "favorites"
    const router = useRouter();

    const pathname = usePathname();
    const userIdFromUrl = pathname.split('/').pop();
    const loggedInUserId = authState.user?.id;

    // Fetch user profile
    useEffect(() => {
        if (userIdFromUrl === loggedInUserId) {
            router.push('/Account');
            return;
        }

        fetchOtherUserProfile(userIdFromUrl)
            .catch((error) => console.error("Error fetching user profile:", error));
    }, [userIdFromUrl]);

    useEffect(() => {
        const visitedUser = authState.visitedUser;
        if (visitedUser) {
            setUser(visitedUser);
        }

        if (visitedUser?.favorites?.length) {
            fetchFavoriteTracks(visitedUser.favorites, true);
        }
    }, [authState.visitedUser]);

    const isAlreadyFriendsWithLoggedInUser = authState.user?.friends?.includes(user?._id);

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        setIsSending(true);
        try {
            await sendMessage(authState.user.email, user.email, messageText);
            setMessageText('');
            router.push('/Inbox');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleAddFriend = async () => {
        if (!user || !authState.user?.email) return;

        if (isAlreadyFriendsWithLoggedInUser) {
            alert("You're already friends with this user.");
            return;
        }

        try {
            const updatedUser = {
                friends: [...authState.user.friends, user._id],
            };

            await updateUser({ email: authState.user.email, updates: updatedUser });

            setUser((prevUser) => ({
                ...prevUser,
                friends: [...prevUser.friends, authState.user.email], // Temporarily update the visited user's friend list for UI purposes
            }));

            alert("Friend added successfully!");
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleRemoveFriend = async () => {
        if (!user || !authState.user?.email) return;

        if (!isAlreadyFriendsWithLoggedInUser) {
            alert("You're not friends with this user.");
            return;
        }

        try {
            const updatedUser = {
                friends: authState.user.friends.filter(friendEmail => friendEmail !== user._id),
            };

            await updateUser({ email: authState.user.email, updates: updatedUser });

            setUser((prevUser) => ({
                ...prevUser,
                friends: prevUser.friends.filter(friendEmail => friendEmail !== authState.user.email),
            }));

            alert("Friend removed successfully!");
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return (
        <div className="mt-24 p-4">
            <div className="flex justify-center items-center w-full mb-4">
                <h2 className="text-white text-md md:text-2xl font-semibold mx-4">{user?.name}</h2>
                <div className="flex space-x-4">
                    {isAlreadyFriendsWithLoggedInUser ? (
                        <button
                            className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg"
                            onClick={handleRemoveFriend}
                        >
                            Remove Friend
                        </button>
                    ) : (
                        <button
                            className="bg-gradient-to-r from-green-600 to-teal-700 p-2 rounded-lg"
                            onClick={handleAddFriend}
                        >
                            Add Friend
                        </button>
                    )}
                </div>
            </div>

            {user ? (
                <div className="bg-black/[.8] p-6 rounded-lg shadow-lg mb-8">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 place-items-center">
                        <div className="relative flex flex-col items-center ">
                            <img
                                src={user.profileAvatar || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                            />
                            <div className="mt-4 text-white text-sm md:text-base text-center">
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg w-full sm:w-auto mb-2 sm:mb-0"
                                    onClick={() => setIsMessageFormVisible(true)}
                                >
                                    Message
                                </button>
                            </div>

                        </div>

                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedTab("friends")}>
                            <h2 className="text-white text-md md:text-2xl font-semibold">Friends</h2>
                            <p className="text-gray-400 text-sm md:text-xl">{user.friends?.length}</p>
                        </div>

                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedTab("favorites")}>
                            <h2 className="text-white text-md md:text-2xl font-semibold">Favorites</h2>
                            <p className="text-gray-400 text-sm md:text-xl">{user.favorites?.length || 0}</p>
                        </div>

                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedTab("owned")}>
                            <h2 className="text-white text-md md:text-2xl font-semibold">Owned</h2>
                            <p className="text-gray-400 text-sm md:text-xl">0</p>
                        </div>
                    </div>
                </div>
            ) : (
                <PageSpinner />
            )}

            {selectedTab === "favorites" && (
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

            {selectedTab === "friends" && (
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Friends List</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {user.friends?.length ? (
                            user.friends.map((friend, index) => (
                                <FriendCard
                                    key={index}
                                    friend={friend}
                                />))
                        ) : (
                            <p className="text-white text-center mt-4">This user doesn't have any friends yet.</p>
                        )}
                    </div>
                </div>
            )}

            {selectedTab === "owned" && (
                <div className="mt-8">
                    <h1 className="text-white text-center text-2xl mb-8">Owned Tracks</h1>
                    <p className="text-white text-center mt-4">This user hasn't owned any tracks yet.</p>
                </div>
            )}

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
        </div>
    );
}
