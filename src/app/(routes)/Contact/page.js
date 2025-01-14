import Link from "next/link";
import { FaSearch, FaMapPin, FaRoute, FaTruckPickup } from 'react-icons/fa';

export default function Contact() {
    return (
        <div className="bg-gradient-to-br from-black to-blue-600 text-white py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
                {/* Introduction Section */}
                <h2 className="text-4xl font-semibold mb-4 text-gradient bg-clip-text">Have a Private Track?</h2>
                <p className="text-lg mb-8">Create an account or login to submit your track for others to find.</p>
                <Link href="/Login">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                        Get Started
                    </button>
                </Link>
            </div>


        </div>
    );
}
