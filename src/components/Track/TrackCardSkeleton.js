import React from 'react';

export const TrackCardSkeleton = () => {
    return (
        // This grid configuration matches the original track card layout, ensuring consistent sizing
        <div className="bg-gray-800 rounded-md overflow-hidden shadow-lg animate-pulse lg:hover:shadow-2xl lg:hover:shadow-blue-500">
            {/* Placeholder for track image */}
            <div className="bg-gray-700 aspect-square w-full h-[300px]"></div>

            {/* Container for text and additional elements */}
            <div className="p-4 space-y-4">
                {/* Placeholder for track name */}
                <div className="bg-gray-700 h-6 w-3/4 rounded"></div>

                {/* Placeholder for track address */}
                <div className="bg-gray-700 h-4 w-1/2 rounded"></div>

                {/* Placeholder for rating and favorite icon */}
                <div className="flex justify-between items-center">
                    <div className="bg-gray-700 h-5 w-1/4 rounded"></div>
                    <div className="bg-gray-700 h-6 w-6 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};
