'use client';

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        trackName: '',
        trackAddress: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    // Handles form submission to Formspree
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://formspree.io/f/mlddynzb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Message sent! We'll get back to you shortly.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                    style: {
                        width: '600px'
                    }
                });
                setFormData({ trackName: '', trackAddress: '', email: '', message: '' });
            } else {
                toast.error('Failed to send the message. Please try again later.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                    style: {
                        width: '600px'
                    }
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "dark",
                style: {
                    width: '600px'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />

            <section className="mt-16 p-8 bg-gradient-to-b from-black/[.8] via-transparent to-transparent text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">Private Track Request</h1>
                <p className="text-lg text-blue-200 mb-8 animate-fade-in-delay-1">
                    We're here to help. Reach out with any questions or feedback!
                </p>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-black/[.7] rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="trackName" className="block text-white text-lg mb-2">Track Name</label>
                        <input
                            type="text"
                            id="trackName"
                            name="trackName"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, trackName: e.target.value })}
                            className="w-full p-3 bg-gray-900 text-white rounded-md border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="trackAddress" className="block text-white text-lg mb-2">Track Address</label>
                        <input
                            type="text"
                            id="trackAddress"
                            name="trackAddress"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, trackAddress: e.target.value })}
                            className="w-full p-3 bg-gray-900 text-white rounded-md border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white text-lg mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 bg-gray-900 text-white rounded-md border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block text-white text-lg mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-3 bg-gray-900 text-white rounded-md border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                            rows="6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-b from-blue-500 to-blue-900 text-white font-semibold rounded-full transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Sending...</span>
                        ) : (
                            <>
                                <span>Send Message</span>
                                <FaPaperPlane className="h-5 w-5 transform group-hover:translate-x-2 transition-all duration-300" />
                            </>
                        )}
                    </button>
                </form>
            </section>
        </>
    );
}
