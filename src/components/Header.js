import { MapIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import AppStoreButton from "@/components/AppStoreButton";

export default function Header() {
    return (
        <>
            {/* Header Section */}
            <header className="relative text-center pt-24">
                <h1 className="flex justify-center items-center tracking-[12px] md:tracking-[px] font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl animate-fade-in relative inline-block animate-fade-in-delay-1">
                    <span className="ml-4">TRACK</span>
                    <span className="text-blue-500 shadow-glow ml-2">MATE</span>
                    <span className="text-[20px] md:text-[30px] text-blue-500 ml-1">MX</span>

                    {/* Corner Borders */}
                    <span className="absolute top-[-10px] left-[-10px] md:left-[300px] w-4 h-4 border-t-4 border-l-4 border-white"></span>
                    <span className="absolute top-[-10px] right-[-10px] md:right-[300px] w-4 h-4 border-t-4 border-r-4 border-white"></span>
                    <span className="absolute bottom-[-10px] left-[-10px] md:left-[300px] w-4 h-4 border-b-4 border-l-4 border-white"></span>
                    <span className="absolute bottom-[-10px] right-[-10px] md:right-[300px] w-4 h-4 border-b-4 border-r-4 border-white"></span>
                </h1>
                <h2 className="animate-fade-in tracking-[1px] md:tracking-[5px] text-white text-sm sm:text-lg md:text-2xl text-center mt-6 animate-fade-in-delay-2">
                    YOUR ULTIMATE DIRTBIKE COMPANION
                </h2>

                {/* Button - Get Started and Download on App Store */}
                <div className="flex justify-center gap-4 mt-8 animate-fade-in-delay-3">
                    <Link href="/HowTo">
                        <button
                            aria-label="Get Started with Trackmate"
                            className="animate-fade-in px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500"
                        >
                            Get Started
                        </button>
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="mt-20 md:mt-40 grid grid-cols-1 md:grid-cols-4 gap-12 animate-fade-in-delay-4">
                {/* Find Tracks */}
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2">
                        <Link href="/Tracks" aria-label="Find Motocross Tracks">
                            <MapIcon className="animate-fade-in h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125 transition-transform duration-300 ease-in-out" />
                        </Link>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2 animate-fade-in-delay-5">Find Tracks</h3>
                    <p className="text-md md:text-lg animate-fade-in-delay-5">Discover top motocross tracks near you!</p>
                </div>

                {/* Find Riders */}
                <div className="text-center col-span-2">
                    <div className="flex justify-center mb-2">
                        <UserGroupIcon className="animate-fade-in h-20 w-20 md:h-40 md:w-40 text-blue-500 hover:scale-125 transition-transform duration-300 ease-in-out" />
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold italic mb-2 animate-fade-in-delay-5">Find Riders</h3>
                    <p className="text-md md:text-lg animate-fade-in-delay-5">Connect with local riders and teams!</p>
                </div>
            </section>
        </>
    );
}
