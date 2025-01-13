// components/TrackCard.js
import { useFavorite } from '@/hooks/useFavorite';
import Link from 'next/link';

import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

export const TrackCard = ({ track }) => {
    const { isFavorite, handleFavoriteClick } = useFavorite(track.placeId);

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
                <h2 className="text-white text-lg font-bold">{track.name} {track.type && <span className='border-2 border-blue-500 text-blue-500 rounded-full px-1 text-sm ml-4'>{track.type}</span>}</h2>
                <p className="text-gray-400 text-sm">{track.address}</p>
                <div className="text-yellow-400 font-semibold flex justify-between items-center">
                    <span>Rating: {track.rating || 'N/A'}</span>
                    <button
                        className={`p-3 rounded-full ${isFavorite ? 'bg-blue-500' : 'bg-gray-700'} text-white font-semibold`}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ?
                            <MdFavorite size={20} />
                            : <MdOutlineFavoriteBorder size={20} />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};
