'use client';

import { useState, useEffect } from 'react';
import { FaSearchLocation, FaTimesCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [radius, setRadiusState] = useState('10');

    useEffect(() => {
        const currentSearchTerm = Cookies.get('searchTerm');
        setSearchTerm(currentSearchTerm || '');
    }, []);

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const isZipCode = /^\d{5}$/.test(searchTerm);
        if (searchTerm && radius) {
            if (isZipCode) {
                // If it's a ZIP code, pass it along with the radius
                onSearch(searchTerm, Number(radius));
            } else {
                // If it's not a ZIP code, treat it as a track name
                onSearch(searchTerm, Number(radius));
            }
        } else {
            alert("Please enter a search term and select a radius.");
        }
    };

    // Clear search input
    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row items-center w-full md:w-2/3  justify-center mx-auto min-w-[280px] p-4 bg-gray-900 rounded-lg shadow-lg space-y-4 md:space-y-0 md:space-x-4">

            {/* Search Icon */}
            <FaSearchLocation
                className="absolute left-6 top-[57px] lg:left-10 lg:top-1/2 transform -translate-y-1/2 text-white"
                size={30}
            />

            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Enter track name or zip code"}
                className="flex-grow rounded-lg bg-gray-800 text-white p-3 pl-12 w-full placeholder:text-md placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-80 transition-all"
                placeholder="Enter track name or zip code"
                aria-label="Search for a track"
            />

            {/* Radius Dropdown */}
            <select
                value={radius}
                onChange={(e) => setRadiusState(e.target.value)}
                className="w-full md:w-[120px] h-[48px] rounded-lg bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-80 transition-all"
                aria-label="Select radius"
            >
                <option value="">Radius</option>
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
            </select>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full md:w-[100px] h-[48px] rounded-lg p-3 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-80"
            >
                Go
            </button>
        </form>
    );
}
