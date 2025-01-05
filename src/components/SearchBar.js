'use client'
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
    const [zipCode, setZipCode] = useState('');
    const [radius, setRadius] = useState('10'); // State for radius

    const handleSubmit = (e) => {
        e.preventDefault();
        if (zipCode && radius) {
            onSearch(zipCode, Number(radius));  // Ensure it's being passed as a number
        }
    };


    return (
        <form onSubmit={handleSubmit} className="relative flex items-center w-full justify-center">
            <FaSearchLocation className="relative left-[10px] md:left-[30px] top-1/2 transform -translate-y-[3px] text-white" size={20} />
            <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="rounded-l-lg bg-blue-500 placeholder:text-md md:placeholder:text-lg text-white p-3 pl-10 w-full md:w-[500px] placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter zip code"
                aria-label="Search for a track"
            />
            <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className=" bg-blue-500 text-white p-3 w-[120px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Select radius"
            >s
                <option value="">Select Radius</option>
                <option defaultValue="10" value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
            </select>
            <button type="submit" className="bg-white text-blue-500 rounded-r-lg p-3 hover:bg-blue-100 transition-all">
                Go
            </button>
        </form>
    );
}
