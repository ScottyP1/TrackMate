'use client'
import { useState, useEffect } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
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

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-1/2 justify-center mx-auto min-w-[300px] md:min-w-[880px] 2xl:min-w-[900px]">
            <FaSearchLocation
                className="absolute left-[30px] md:left-[325px] 2xl:left-[520px] text-white"
                size={30}
            />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on change
                className="flex-grow w-[300px] rounded-r-[0px] rounded-l-lg bg-gray-800 placeholder:text-md md:placeholder:text-lg text-white p-3 pl-12 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 border-r-0"
                placeholder="Enter track name or zip code"
                aria-label="Search for a track"
            />
            <select
                value={radius}
                onChange={(e) => setRadiusState(e.target.value)}
                className="w-[90px] md:w-[105px] h-[48px] rounded-l-[0px] bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 border-l-0 border-r-0"
                aria-label="Select radius"
            >
                <option value="">Select Radius</option>
                <option value="10">10 miles</option>
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
