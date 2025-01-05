import React from 'react';

export const TrackCardSkeleton = () => {
    return (
        <div className="bg-gray-800 rounded-md overflow-hidden shadow-lg animate-pulse">
            <div className="bg-gray-700 aspect-square w-[500px] h-[300px]"></div>
            <div className="p-4 space-y-2">
                <div className="bg-gray-700 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-700 h-5 w-1/4 rounded"></div>
            </div>
        </div>
    );
};
