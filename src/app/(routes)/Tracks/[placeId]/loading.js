// app/trackDetails/loading.js
import React from 'react';
import PageSpinner from '@/components/spinners/PageSpinner';

const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center text-white">
            <PageSpinner />  {/* Custom Spinner Component */}
        </div>
    );
};

export default Loading;
