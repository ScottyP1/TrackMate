'use client'
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [radius, setRadius] = useState('10'); // State for radius

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            onSearch(searchTerm, Number(radius));  // Pass searchTerm (which could be zip code or track name)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-1/2 justify-center mx-auto min-w-[300px] md:min-w-[880px]">
            <FaSearchLocation
                className="absolute left-[30px] md:left-[325px] 2xl:left-[530px] text-white"
                size={30}
            />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow w-[300px] rounded-r-[0px] rounded-l-lg bg-gray-800 placeholder:text-md md:placeholder:text-lg text-white p-3 pl-12 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 border-r-0"
                placeholder="Enter track name or zip code"
                aria-label="Search for a track"
            />
            <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-[90px] md:w-[105px] h-[48px] rounded-l-[0px] bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 border-l-0 border-r-0"
                aria-label="Select radius"
            >
                <option value="">Select Radius</option>
                <option defaultValue="10" value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
            </select>
            <button
                type="submit"
                className="bg-gray-800 text-white w-[100px] rounded-r-lg p-3 hover:bg-blue-100 transition-all focus:outline-none"
            >
                Go
            </button>
        </form>
    );
}
