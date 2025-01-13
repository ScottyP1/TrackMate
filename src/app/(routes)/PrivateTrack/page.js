'use client'

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation'

export default function PrivateTrack() {
    const [formData, setFormData] = useState({
        trackOwner: '',
        trackName: '',
        trackAddress: '',
    });

    useEffect(() => {
        // Set trackOwner from cookie if available
        const userEmail = Cookies.get('userEmail');
        const token = Cookies.get('authToken')
        if (!token) {
            redirect('/')
        }
        if (userEmail) {
            setFormData((prevData) => ({
                ...prevData,
                trackOwner: userEmail,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Build the email body from form data
        const body = `
            Track Owner: ${formData.trackOwner}
            Track Name: ${formData.trackName}
            Track Address: ${formData.trackAddress}
        `;

        // Truncate body if it's too long (optional)
        const truncatedBody = body.length > 2000 ? body.substring(0, 2000) : body;

        // Create the mailto link
        const mailtoLink = `mailto:codymoto122@gmail.com?subject=Private%20Track%20Submission&body=${encodeURIComponent(truncatedBody)}`;

        // Log the mailto link for debugging
        console.log('Generated mailto link:', mailtoLink);

        // Trigger the mailto link
        window.location.href = mailtoLink;
    };

    return (
        <div className="mt-24 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8] p-8 rounded-lg shadow-xl w-[400px] md:w-[80em]">
                <h1 className="text-3xl font-semibold text-white text-center mb-8">Private Track Submission</h1>

                <p className="text-white text-lg mb-6">
                    Please fill in the details below, and we'll get back to you as soon as possible!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="trackOwner" className="block text-white text-lg font-medium mb-2">Track Owner</label>
                        <input
                            id="trackOwner"
                            name="trackOwner"
                            type="text"
                            disabled
                            placeholder="Enter your email"
                            value={formData.trackOwner}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="trackName" className="block text-white text-lg font-medium mb-2">Track Name</label>
                        <input
                            id="trackName"
                            name="trackName"
                            type="text"
                            placeholder="Enter track name"
                            value={formData.trackName}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="trackAddress" className="block text-white text-lg font-medium mb-2">Track Address</label>
                        <input
                            id="trackAddress"
                            name="trackAddress"
                            type="text"
                            placeholder="Enter track address"
                            value={formData.trackAddress}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Submit Track
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
