import Link from "next/link";
import { FaSearch, FaMapPin, FaMountain, FaRoute } from 'react-icons/fa'; // Updated icons
import { MdDirectionsBike } from 'react-icons/md'; // Modern bike icon
import { FaTruckPickup } from "react-icons/fa6";

export default function HowTo() {
    return (
        <div className="mt-24 text-center max-w-6xl mx-auto px-4 py-1 bg-black/[.5] rounded-lg ">
            <div className="mt-12">
                <h2 className="text-4xl font-semibold ">Have a private track?</h2>
                <p className="mx-2 text-xs ">Create an account or Login to submit your track for others to find</p>
                <Link href="Login">
                    <button className="px-6 py-3 bg-blue-600 mt-4 text-white font-bold rounded-full hover:bg-blue-700 transition-all">
                        Get Started
                    </button>
                </Link>
            </div>

            <h1 className="text-white text-4xl mt-24 tracking-[5px] underline">Lets Begin</h1>

            <div className="mt-12">
                <h1 className="text-3xl font-semibold ">Step 1</h1>
                <div className="flex justify-center items-center gap-4">
                    <p className="text-lg tracking-[3px]">Click the Link 'Tracks'</p>
                </div>
                <FaSearch className="text-4xl text-blue-500 mx-auto" /> {/* Search icon for Tracks */}
            </div>

            <div className="mt-12">
                <h1 className="text-3xl font-semibold">Step 2</h1>
                <div className="flex justify-center items-center gap-4">
                    <p className="text-lg tracking-[3px]">Enter Your Zip Code</p>
                </div>
                <FaMapPin className="text-5xl text-blue-500 mx-auto" /> {/* Pin icon for entering zip code */}
            </div>

            <div className="mt-12">
                <h1 className="text-3xl font-semibold ">Step 3</h1>
                <div className="flex justify-center items-center gap-4">
                    <p className="text-lg tracking-[3px]">Pick Your Desired Track</p>
                </div>
                <FaRoute className="text-6xl text-blue-500 mx-auto" /> {/* Mountain icon for selecting track */}
            </div>

            <div className="mt-12 mb-12">
                <h1 className="text-3xl font-semibold ">Step 4</h1>
                <div className="flex justify-center items-center gap-4">
                    <p className="text-lg tracking-[3px]">Load The Bike n Bark</p>
                </div>
                <FaTruckPickup className="text-6xl text-blue-500 mx-auto" /> {/* Bike icon for loading and riding */}
            </div>
        </div>
    );
}
