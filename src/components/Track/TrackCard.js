import Link from 'next/link';

export const TrackCard = ({ track }) => {
    // Helper function to filter valid image URLs
    const getValidImageUrl = (images) => {
        if (!images || images.length === 0) {
            return 'https://via.placeholder.com/300x300?text=No+Image';  // Default fallback if no images
        }


        // Return the first valid image or a fallback
        return images.length > 0 ? images[0] : 'https://via.placeholder.com/300x300?text=No+Image';
    };


    const imageUrl = getValidImageUrl(track.images);
    return (
        <Link href={`/Tracks/${track.placeId}`} className="block">
            <div className="bg-gray-800 rounded-md overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500 hover:-translate-y-4 transition-transform">
                <img
                    src={imageUrl}
                    alt={track.name || 'Track Image'}
                    className="object-cover aspect-square w-full h-[300px]"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                <div className="p-4">
                    <h2 className="text-white text-lg font-bold">{track.name}</h2>
                    <p className="text-gray-400 text-sm">{track.address}</p>
                    <p className="text-yellow-400 font-semibold">
                        Rating: {track.rating || 'N/A'}
                    </p>
                </div>
            </div>
        </Link>
    );
};
