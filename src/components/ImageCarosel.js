import React, { useState } from 'react';

export default function ImageCarousel({ validImages }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const openFullscreen = (index) => {
        setCurrentIndex(index);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
        );
    };

    return (
        <div>
            {/* Normal Carousel */}
            <div className="relative overflow-hidden w-full mx-auto mt-6 max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl">
                <div
                    className="flex transition-transform duration-500"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {validImages.map((image, index) => (
                        <div
                            key={index}
                            className="min-w-full flex items-center justify-center"
                        >
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-full object-cover cursor-pointer rounded-md h-[300px] md:h-[400px] lg:h-[600px]"
                                onClick={() => openFullscreen(index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                >
                    &#8592;
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                >
                    &#8594;
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {validImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full ${index === currentIndex
                                ? 'bg-white'
                                : 'bg-gray-400'
                                }`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Fullscreen Viewer */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black flex items-center justify-center z-50"
                    onClick={closeFullscreen} // Close on clicking background
                >
                    <div
                        className="relative w-full h-full"
                        onClick={(e) => e.stopPropagation()} // Prevent background click from closing
                    >
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-4 right-4 text-white text-2xl bg-black/50 p-2 rounded-full"
                        >
                            ✖
                        </button>
                        <img
                            src={validImages[currentIndex]}
                            alt={`Fullscreen Image ${currentIndex + 1}`}
                            className="object-contain w-full h-full max-h-screen"
                        />
                        {/* Navigation for Fullscreen */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                        >
                            &#8594;
                        </button>

                        {/* Pagination Dots for Fullscreen */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {validImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full ${index === currentIndex
                                        ? 'bg-white'
                                        : 'bg-gray-400'
                                        }`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
