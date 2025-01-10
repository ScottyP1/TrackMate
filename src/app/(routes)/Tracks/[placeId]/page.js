'use client';

import { useEffect, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Context as TrackContext } from '@/context/TrackContext';
import { Context as AuthContext } from '@/context/AuthContext';  // Add AuthContext here

import CommentsSection from '@/components/comments/CommentsSection';
import ImageCarosel from '@/components/ImageCarosel';
import NotFound from '@/app/not-found';
import { TrackCardSkeleton } from '@/components/Track/TrackCardSkeleton';

export default function TrackDetailsPage() {
    const { state: trackState, fetchTrackById, clearError } = useContext(TrackContext);
    const { state: authState, updateUser } = useContext(AuthContext);  // Accessing auth state and updateUser
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const pathname = usePathname();

    // Extract the placeId from the pathname (e.g., /Tracks/:placeId)
    const placeId = pathname ? pathname.split('/').pop() : null;

    useEffect(() => {
        if (placeId) {
            setIsLoading(true); // Start loading
            fetchTrackById(placeId).finally(() => setIsLoading(false)); // Stop loading after fetching
        }
    }, [placeId]);

    useEffect(() => {
        // Clear any previous errors when the track state changes
        if (trackState.track || trackState.errorMessage) {
            clearError();
        }
    }, [trackState.track]);

    useEffect(() => {
        // Check if the track is already in the user's favorites
        if (authState.user && authState.user.favorites) {
            setIsFavorite(authState.user.favorites.includes(placeId));
        }
    }, [authState.user, placeId]);

    const handleFavoriteClick = async () => {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');

        if (!token) {
            // Redirect to login if no token
            router.push('/Login');
            return;
        }

        try {
            const newFavorites = isFavorite
                ? authState.user.favorites.filter(fav => fav !== placeId)
                : [...authState.user.favorites, placeId];

            await updateUser({ email: userEmail, updates: { favorites: newFavorites } });
            setIsFavorite(!isFavorite);  // Toggle the favorite status
        } catch (error) {
            console.error('Failed to update favorites', error);
        }
    };

    const track = trackState.track;

    // Show error message if it exists
    if (trackState.errorMessage && !isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white">
                <p className="text-red-500">{trackState.errorMessage}</p>
            </div>
        );
    }

    // Show skeleton while loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
                <TrackCardSkeleton />
            </div>
        );
    }

    // Render the track details if available
    return (
        <div className="min-h-screen text-white flex flex-col items-center p-6 mt-12">
            {track ? (
                <div className="w-full max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl space-y-6">
                    {/* Track Logo and Name */}
                    <div className="flex flex-col items-center space-y-4">
                        {track.logo ? (
                            <img
                                src={track.logo}
                                alt="Track Logo"
                                className="rounded-full max-w-[600px] max-h-[100px]"
                            />
                        ) : (
                            <h1 className="text-5xl font-bold text-center">
                                {track.name}
                            </h1>
                        )}
                        <p className="text-center text-white text-xs md:text-xl">
                            {track.address}
                        </p>
                        <p className="text-center text-yellow-400 text-xl">
                            Rating: {track.rating || 'N/A'}
                        </p>

                        {/* Add to favorites button */}
                        <button
                            className={`mt-4 px-6 py-2 rounded-full ${isFavorite ? 'bg-red-500' : 'bg-gray-700'} text-white font-semibold`}
                            onClick={handleFavoriteClick}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>

                    {/* Image carousel */}
                    <ImageCarosel validImages={track.images?.filter((image) => image)} />
                    {/* Comments Section */}
                    <CommentsSection trackId={track.id} />
                </div>
            ) : (
                <NotFound />
            )}
        </div>
    );
}
