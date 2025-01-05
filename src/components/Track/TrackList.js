'use client';
import React, { useEffect, useContext } from 'react';
import { Context as TrackContext } from '@/context/TrackContext';
import { TrackCard } from './TrackCard';

export default function TrackList() {
    const { state, fetchTracks } = useContext(TrackContext);

    useEffect(() => {
        fetchTracks();
    }, []);

    return (
        <div className="border-2 border-white">
            {state.isLoading ? (
                <p className="text-gray-300">Loading...</p>
            ) : state.errorMessage ? (
                <p className="text-red-500">{state.errorMessage}</p>
            ) : (
                <ul>
                    {state.tracks.map((track, index) => (
                        <TrackCard
                            key={index}
                            track={{
                                id: track.place_id,
                                name: track.name,
                                address: track.address,
                                image: `https://via.placeholder.com/150`, // Replace with actual image URL if available
                                rating: track.rating
                            }}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

//results => name: name, address: formatted_address, maps: geometry=> location(lat, long), rating: rating