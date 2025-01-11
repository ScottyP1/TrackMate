// app/trackDetails/loading.js
import React from 'react';
import TracksSpinner from '@/components/spinners/PageSpinner';

const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center text-white">
            <TracksSpinner />  {/* Custom Spinner Component */}
        </div>
    );
};

export default Loading;
