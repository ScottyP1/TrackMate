import { MapIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function About() {
    return (
        <div className="mx-auto mt-16 bg-gradient-to-b from-black/[.8] via-transparent to-transparent relative p-12 shadow-xl">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-6 tracking-tight animate-fade-in">
                    About Us
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-gray-300">
                    Welcome to TrackMate, your ultimate platform for discovering local tracks and connecting with fellow dirt bike enthusiasts. Whether you're seeking a Motocross Track, Private Track, or a scenic route, we make it simple and quick to find exactly what you’re looking for, right in your area.
                </p>

                {/* What We Do Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="flex flex-col items-center gap-6">
                        <MapIcon className="h-48 w-48 text-blue-500" />
                    </div>
                    <div className="flex flex-col items-start gap-6">
                        <h2 className="text-3xl font-semibold text-white mb-6">What We Do</h2>
                        <p className="text-lg text-gray-300">
                            We bring outdoor enthusiasts together by providing an easy way to locate tracks near you. Our app allows users to search for tracks based on their location and preferred activity—whether it's racing, practice, or just leisure. Finding your next ride is just a few clicks away.
                        </p>
                    </div>
                </div>

                {/* How We Help Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="flex flex-col items-center gap-6">
                        <UserGroupIcon className="h-48 w-48 text-green-500" />
                    </div>
                    <div className="flex flex-col items-start gap-6">
                        <h2 className="text-3xl font-semibold text-white mb-6">How We Help</h2>
                        <p className="text-lg text-gray-300">
                            As a member, you can explore a wide variety of tracks and share your experiences by leaving comments on track pages, helping others discover the best spots and prepare for their rides. Connect with fellow riders by adding them as friends and sending messages to stay in touch. Whether you’re swapping tips, sharing updates, or planning your next ride day together, our platform makes it easy to build a vibrant riding community.                        </p>
                    </div>
                </div>


                {/* Join Us Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-semibold text-white mb-6">Join Us</h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Ready to explore the best tracks near you? Download our App today to get started, or submit your own track and share your adventures with the community. Whether you're a seasoned adventurer or a beginner, TrackMate is the place to find new tracks and meet like-minded riders.
                    </p>

                </div>
            </div>
        </div>
    );
}
