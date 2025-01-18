// components/Spinner.tsx
import React from 'react';

const PageSpinner = () => {
    return (
        <div className="flex justify-center items-center my-auto mx-auto">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-yellow-400 w-16 h-16"></div>
        </div>
    );
};

export default PageSpinner;
