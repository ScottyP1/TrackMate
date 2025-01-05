import SearchBar from "./SearchBar";
import { MapIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <h1 className="tracking-[12px] md:tracking-[px] font-bold text-white text-5xl md:text-8xl pt-24 text-center animate-fade-in">
                TRACK<span className="text-blue-500 shadow-glow">MATE</span>
            </h1>
            <h2 className="tracking-[1px] md:tracking-[5px] text-white text-sm md:text-2xl text-center mt-2">
                YOUR ULTIMATE DIRTBIKE COMPANION
            </h2>
            <div className="text-center mt-8">
                <Link href='/HowTo'>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all">
                        Get Started
                    </button>
                </Link>
            </div>

            <div className="mt-20 md:mt-40 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2 ">
                        <Link href='/Tracks'>
                            <MapIcon className="h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125" />
                        </Link>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2 ">Find Tracks</h3>
                    <p className="text-md md:text-lg">Discover top motocross tracks near you!</p>
                </div>
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2">
                        <UserGroupIcon className="h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125" />
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2">Find Riders</h3>
                    <p className="text-md md:text-lg">Connect with local riders and teams!</p>
                </div>
                {/* Search Input */}
                {/* <div className='flex relative col-span-2'>
                    <SearchBar />
                </div> */}
            </div>
        </>
    );
}
