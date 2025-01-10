'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Context as AuthContext } from '@/context/AuthContext';  // Ensure this is imported correctly for client-side use
import Cookies from 'js-cookie';

export const useFavorite = (trackId) => {
    const { state, updateFavorites } = useContext(AuthContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.user && state.user.favorites) {
            setIsFavorite(state.user.favorites.includes(trackId));
        }
    }, [state.user, trackId]);

    const handleFavoriteClick = async () => {
        const token = Cookies.get('authToken');
        const userEmail = Cookies.get('userEmail');

        if (!token) {
            router.push('/Login');  // Redirect to login if no token
            return;
        }

        try {
            const newFavorites = isFavorite
                ? state.user.favorites.filter(fav => fav !== trackId)
                : [...state.user.favorites, trackId];

            // Use the updateFavorites action to update the favorites
            await updateFavorites(userEmail, newFavorites);  // Update favorites in the context
            setIsFavorite(!isFavorite);  // Toggle the favorite status
        } catch (error) {
            console.error('Failed to update favorites', error);
        }
    };

    return { isFavorite, handleFavoriteClick };
};
