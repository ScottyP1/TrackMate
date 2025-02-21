// components/TrackCard.js
import { useFavorite } from '@/hooks/useFavorite';
import Link from 'next/link';
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

export const TrackCard = ({ track }) => {
    // const { isFavorite, handleFavoriteClick } = useFavorite(track.placeId);

    return (
        <div className="bg-gradient-to-br from-blue via-black/[.8] to-black/[.3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* Track Image */}
            <Link href={`/Tracks/${track.placeId}`} className="block">
                <img
                    src={track.images[0]}
                    alt={track.name || 'Track Image'}
                    className="object-cover aspect-square w-full h-[300px] transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
            </Link>

            <div className="p-4">
                {/* Track Name and Type */}
                <h2 className="text-white text-lg font-semibold flex justify-between items-center">
                    <span className="text-base">{track.name}</span>
                    {track.type && (
                        <span className="ml-4 text-sm font-medium text-blue-500 border border-blue-500 rounded-full px-2">
                            {track.type}
                        </span>
                    )}
                </h2>

                {/* Track Location */}
                <p className="text-gray-300 text-sm mt-1">{track.location}</p>

                {/* Rating and Favorite Button */}
                {/* <div className="text-yellow-300 font-semibold flex justify-between items-center mt-3">
                    <span>Rating: {track.rating || 'N/A'}</span> */}

                {/* Favorite Button (Larger for Mobile) */}
                {/* <button
                        className={`p-4 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-500'} hover:text-blue-300 transition-all focus:outline-none`}
                        onClick={handleFavoriteClick}
                        aria-label="Favorite Track"
                    > */}
                {/* {isFavorite ?
                            <MdFavorite size={30} />
                            : <MdOutlineFavoriteBorder size={30} />
                        } */}
                {/* </button>
                </div> */}
            </div>
        </div>
    );
};
