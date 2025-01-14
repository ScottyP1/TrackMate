'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';  // Ensure this is imported correctly for client-side use
import Cookies from 'js-cookie';

export const useFavorite = (trackId) => {
    const { state, updateUser } = useContext(AuthContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.user && state.user.favorites) {
            setIsFavorite(state.user.favorites.includes(trackId));
        }
    }, [state.user, trackId]);

    const handleFavoriteClick = async () => {
        const token = Cookies.get('authToken');
        const email = Cookies.get('userEmail');

        if (!token) {
            router.push('/Login');  // Redirect to login if no token
            return;
        }

        try {
            const newFavorites = isFavorite
                ? state.user.favorites.filter(fav => fav !== trackId)
                : [...state.user.favorites, trackId];

            // Format updates as { favorites: [array of track IDs] }
            const updates = { favorites: newFavorites };

            // Call updateUser with the correctly formatted updates
            await updateUser({ email, updates });  // Send the updates as an object with the favorites array

            setIsFavorite(!isFavorite);  // Toggle the favorite status

        } catch (error) {
            console.error('Failed to update favorites', error);
        }
    };

    return { isFavorite, handleFavoriteClick };
};
