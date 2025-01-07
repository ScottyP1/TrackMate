import SearchBar from "./SearchBar";
import { MapIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <h1 className="tracking-[12px] md:tracking-[px] font-bold text-white text-5xl md:text-8xl pt-24 text-center animate-fade-in relative inline-block animate-fade-in-delay-1">
                TRACK<span className="text-blue-500 shadow-glow">MATE</span>
                <span className="absolute top-[90px] left-[-10px] md:left-[-20px] w-4 h-4 border-t-4 border-l-4 border-white"></span>
                <span className="absolute top-[90px] right-[-10px] md:right-[-20px] w-4 h-4 border-t-4 border-r-4 border-white"></span>
                <span className="absolute bottom-[-10px] left-[-10px] md:left-[-20px] w-4 h-4 border-b-4 border-l-4 border-white"></span>
                <span className="absolute bottom-[-10px] right-[-10px] md:right-[-20px] w-4 h-4 border-b-4 border-r-4 border-white"></span>
            </h1>
            <h2 className="animate-fade-in tracking-[1px] md:tracking-[5px] text-white text-sm md:text-2xl text-center mt-6 animate-fade-in-delay-2">
                YOUR ULTIMATE DIRTBIKE COMPANION
            </h2>
            <div className="text-center mt-8 animate-fade-in-delay-3">
                <Link href='/HowTo'>
                    <button className="animate-fade-in px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all">
                        Get Started
                    </button>
                </Link>
            </div>

            <div className="mt-20 md:mt-40 grid grid-cols-1 md:grid-cols-4 gap-12 animate-fade-in-delay-4">
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2 ">
                        <Link href='/Tracks'>
                            <MapIcon className="animate-fade-in h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125" />
                        </Link>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2 animate-fade-in-delay-5">Find Tracks</h3>
                    <p className="text-md md:text-lg animate-fade-in-delay-5">Discover top motocross tracks near you!</p>
                </div>
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2">
                        <UserGroupIcon className="animate-fade-in h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125" />
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2 animate-fade-in-delay-5">Find Riders</h3>
                    <p className="text-md md:text-lg animate-fade-in-delay-5">Connect with local riders and teams!</p>
                </div>
            </div>
        </>
    );
}
