import { MapIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default function Header() {
    return (
        <>
            {/* Header Section */}
            <header className="relative text-center pt-24 bg-gradient-to-b from-black via-transparent to-transparent">
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
                <h2 className="animate-fade-in tracking-[1px] md:tracking-[5px] text-blue-200 text-sm sm:text-lg md:text-2xl text-center mt-6 animate-fade-in-delay-2">
                    YOUR ULTIMATE DIRTBIKE COMPANION
                </h2>

                {/* Button - Get Started and Download on App Store */}
                {/* Button Section */}
                <div className="flex justify-center gap-6 mt-8 animate-fade-in-delay-3">
                    {/* Get Started Button */}
                    <Link href="/Register">
                        <button
                            aria-label="Get Started with Trackmate"
                            className="px-6 py-3 bg-gradient-to-b from-blue-500 to-blue-900 text-white font-semibold rounded-full transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                        >
                            <span>Get Started</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.293 10.707a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 1.414L10.586 9H3a1 1 0 000 2h7.586l-1.293 1.293a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Link>

                    {/* Learn More Button */}
                    <Link href="/About">
                        <button
                            aria-label="Learn More About Trackmate"
                            className="px-6 py-3 bg-gradient-to-b from-black/[.5] to-black text-white font-semibold rounded-full border-2 border-blue-500 hover:border-blue-600 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                        >
                            <span>Learn More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.293 10.707a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 1.414L10.586 9H3a1 1 0 000 2h7.586l-1.293 1.293a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Link>
                </div>

            </header>

            {/* Features Section */}
            <section className="mt-20 md:mt-40 grid grid-cols-1 md:grid-cols-2 gap-12 xl:px-64 animate-fade-in-delay-4">
                {/* Find Tracks */}
                <Link href="/Tracks" aria-label="Find Motocross Tracks">
                    <div className="text-center group relative bg-gradient-to-b from-black/[.7] via-transparent to-black shadow-2xl rounded-lg border border-blue-500 p-6 transition-all transform hover:translate-y-[-5px] hover:shadow-2xl hover:border-blue-500 duration-300 flex justify-center items-center">
                        <div className="flex flex-col items-center justify-center">
                            {/* Icon and Title Row */}
                            <div className="flex items-center justify-center mb-2">
                                <MapIcon className="h-16 w-16 md:h-24 md:w-24 text-blue-600 group-hover:text-blue-800 transition-all duration-300" />
                                <h3 className="text-2xl font-semibold text-white ml-4 group-hover:text-blue-500 transition-all duration-300">Find Tracks</h3>
                            </div>
                            {/* Description */}
                            <p className="text-md text-blue-200 group-hover:text-gray-800 transition-all duration-300">
                                Explore top motocross tracks near you and plan your next ride!
                            </p>
                        </div>
                    </div>
                </Link>


                {/* Find Riders */}
                <Link href="/Tracks" aria-label="Find Local Riders">
                    <div className="text-center group relative bg-gradient-to-b from-black/[.7] via-transparent to-black shadow-2xl rounded-lg border border-green-500 p-6 transition-all transform hover:translate-y-[-5px] hover:shadow-2xl hover:border-green-500 duration-300 flex justify-center items-center">
                        <div className="flex flex-col items-center justify-center">
                            {/* Icon and Title Row */}
                            <div className="flex items-center justify-center mb-2">
                                <UserGroupIcon className="h-16 w-16 md:h-24 md:w-24 text-green-600 group-hover:text-green-700 transition-all duration-300" />
                                <h3 className="text-2xl font-semibold text-white ml-4 group-hover:text-green-500 transition-all duration-300">Find Riders</h3>
                            </div>
                            {/* Description */}
                            <p className="text-md text-blue-200 group-hover:text-gray-800 transition-all duration-300">
                                Connect with local riders and teams in your area to ride together.
                            </p>
                        </div>
                    </div>
                </Link>

            </section>
        </>
    );
}
