'use client';
import { useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Context as TrackContext } from '@/context/TrackContext';

import CommentsSection from '@/components/comments/CommentsSection';
import ImageCarosel from '@/components/ImageCarosel';
import NotFound from '@/app/not-found';

export default function TrackDetailsPage() {
    const { state, fetchTrackById, clearError } = useContext(TrackContext);
    const pathname = usePathname();

    // Extract the placeId from the pathname (e.g., /Tracks/:placeId)
    const placeId = pathname ? pathname.split('/').pop() : null;

    useEffect(() => {
        if (placeId) {
            fetchTrackById(placeId); // Fetch the specific track by placeId
        }
    }, [placeId]);

    useEffect(() => {
        // Clear any previous errors when the track state changes
        if (state.track || state.errorMessage) {
            clearError();
        }
    }, [state.track]);


    const track = state.track;


    if (state.errorMessage) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white">
                <p className="text-red-500">{state.errorMessage}</p>
            </div>
        );
    }

    // Filter invalid images (assuming invalid images are URLs that do not load properly)
    const validImages = track?.images?.filter((image) => image);

    // Render the track details if available
    return (
        <div className="track-details min-h-screen text-white flex flex-col items-center p-6 mt-12">
            {track ? (
                <div className="w-full max-w-4xl space-y-6">
                    {/* Track Logo and Name */}
                    <div className="flex flex-col items-center space-y-4">
                        {track.logo && (
                            <img src={track.logo} alt="Track Logo" className="rounded-full shadow-lg" />
                        )}
                        <h1 className="text-5xl font-bold text-center ">{track.name}</h1>
                        <p className="text-center text-white text-sm md:text-xl">{track.address}</p>
                        <p className="text-center text-yellow-400 text-xl">
                            Rating: {track.rating || 'N/A'}
                        </p>
                    </div>

                    <ImageCarosel validImages={validImages} />

                    {/* Comments Section */}
                    <CommentsSection trackId={track.id} />
                </div>
            ) : (
                <NotFound />
            )}
        </div>
    );
}
