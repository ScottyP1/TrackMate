import { Swiper, SwiperSlide } from 'swiper/react';

export default function ImageCarosel(validImages) {
    return (
        <div className="images mt-6 glow-effect">
            {validImages.validImages?.length > 0 ? (
                <Swiper
                    spaceBetween={10} // Space between slides
                    slidesPerView={1} // Show one slide at a time
                    loop={true} // Enable infinite loop
                    pagination={{ clickable: true }} // Enable pagination dots
                    navigation // Enable next/prev buttons
                    className="swiper-container"
                >
                    {validImages.validImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="object-cover w-full h-[400px] rounded-md shadow-lg"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <img
                    src="https://via.placeholder.com/600x400?text=No+Image"
                    alt="No Image"
                    className="object-cover w-full h-[400px] rounded-md shadow-lg"
                />
            )}
        </div>
    )
}