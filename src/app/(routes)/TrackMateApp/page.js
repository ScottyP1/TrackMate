import { FaApple } from "react-icons/fa";

export default function TrackMateApp() {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 mt-12">
            <h1 className="text-4xl font-semibold mb-6 animate-fade-in text-center">
                Download Our Mobile App
            </h1>
            <p className="text-xl mb-8 text-center opacity-75 animate-fade-in-delay-1s">
                Stay up to date and receive updates and messages on the go. Our app keeps you connected with the latest features and notifications. Track your favorite tracks, send and receive messages from other riders, and get notified when a track from your favorites list post updates. Download it today to keep everything at your fingertips!
            </p>
            <div className="flex flex-wrap gap-4">
                <img src='./images/localTracksImg.png' width={400} height={300} className="rounded-xl" />
                <img src='./images/commentsImg.png' width={400} height={300} className="rounded-xl" />
                <img src='./images/designImg.png' width={400} height={300} className="rounded-xl" />
                <img src='./images/messageImg.png' width={400} height={300} className="rounded-xl" />
            </div>
            <button className="mt-6 bg-white border-2 border-black text-black font-semibold py-8 px-8 rounded-full shadow-lg transition transform hover:scale-105 duration-300 ease-in-out flex items-center gap-3">
                <FaApple color="black" size={30} />
                <span>Download On The App Store</span>
            </button>

        </div>
    );
}