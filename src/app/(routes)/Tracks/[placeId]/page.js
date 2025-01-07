'use client';
import { useEffect, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Context as TrackContext } from '@/context/TrackContext';

import CommentsSection from '@/components/comments/CommentsSection';
import ImageCarosel from '@/components/ImageCarosel';
import NotFound from '@/app/not-found';
import { TrackCardSkeleton } from '@/components/Track/TrackCardSkeleton';

export default function TrackDetailsPage() {
    const { state, fetchTrackById, clearError } = useContext(TrackContext);
    const [isLoading, setIsLoading] = useState(true);
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
        if (state.track || state.errorMessage) {
            clearError();
        }
    }, [state.track]);

    const track = state.track;

    // Show error message if it exists
    if (state.errorMessage && !isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white">
                <p className="text-red-500">{state.errorMessage}</p>
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
                    </div>
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
