// app/trackDetails/loading.js
import React from 'react';
import Spinner from '@/components/spinners/PageSpinner';

const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center text-white">
            <Spinner />  {/* Custom Spinner Component */}
        </div>
    );
};

export default Loading;
