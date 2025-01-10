'use client'

import { useState, useEffect, useContext } from 'react';
import { Context as AuthContext } from '@/context/AuthContext';  // Ensure this is imported correctly for client-side use
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export const TrackCard = ({ track }) => {
    const { state, updateUser } = useContext(AuthContext);  // Use the client-side context
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.user && state.user.favorites) {
            setIsFavorite(state.user.favorites.includes(track.placeId));
        }
    }, [state.user, track.placeId]);

    const handleFavoriteClick = async () => {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');

        if (!token) {
            router.push('/Login'); // Redirect to login if no token
            return;
        }

        try {
            const newFavorites = isFavorite
                ? state.user.favorites.filter(fav => fav !== track.placeId)
                : [...state.user.favorites, track.placeId];

            await updateUser({ email: userEmail, updates: { favorites: newFavorites } });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to update favorites', error);
        }
    };

    return (
        <div className="bg-gray-800 rounded-md overflow-hidden shadow-lg lg:hover:shadow-2xl lg:hover:shadow-blue-500">
            <Link href={`/Tracks/${track.placeId}`} className="block">
                <img
                    src={track.images[0]}
                    alt={track.name || 'Track Image'}
                    className="object-cover aspect-square w-full h-[300px]"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
            </Link>
            <div className="p-4">
                <h2 className="text-white text-lg font-bold">{track.name}</h2>
                <p className="text-gray-400 text-sm">{track.address}</p>
                <div className="text-yellow-400 font-semibold flex justify-between items-center">
                    <span>Rating: {track.rating || 'N/A'}</span>
                    <span
                        className={`cursor-pointer ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </span>
                </div>

            </div>
        </div>
    );
};
