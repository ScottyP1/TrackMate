export default function About() {
    return (
        <div className="max-w-4xl mt-24 mx-auto px-6 relative mb-12">
            {/* Top-left blue border */}
            <div className="absolute top-0 left-5 md:left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
            {/* Bottom-right blue border */}
            <div className="absolute bottom-0 right-5 md:right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>

            <h1 className="text-4xl font-semibold text-center mb-6">About Us</h1>
            <p className="text-lg mb-4">
                Welcome to TrackMate, your go-to platform for discovering local tracks and connecting with fellow enthusiasts.
                Whether you're looking for a Motocross Track, Private Track, or a scenic track, we help you find it quickly and easily, right in your area.
            </p>
            <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
            <p className="text-lg mb-4">
                We bring outdoor enthusiasts together by providing a simple way to locate tracks near you. Our app allows users to search for tracks based on their location and preferred activity—whether it's racing, practice, or just leisure. With a user-friendly interface, finding a track is just a few clicks away.
            </p>
            <h2 className="text-3xl font-semibold mb-4">How We Help</h2>
            <p className="text-lg mb-4">
                Not only can you discover tracks, but you can also connect with others by reading and leaving comments on track pages. Share your experience, tips, and thoughts with the community, helping others enjoy their adventures. You can even submit your own private track for others to find, expanding our community and helping everyone enjoy the outdoors together.
            </p>
            <h2 className="text-3xl font-semibold mb-4">Join Us</h2>
            <p className="text-lg">
                Ready to explore the best tracks near you? Sign up today to get started, or log in to submit your own track and share your experiences with others. Whether you're a seasoned adventurer or a beginner, there's always a new track to discover with TrackMate.
            </p>
        </div>
    );
}
