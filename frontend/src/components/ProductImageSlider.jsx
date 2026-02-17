import { API_URL } from "../utils/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import "swiper/css";

export default function ProductImageSlider({ images }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* MAIN SLIDER */}
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        onSwiper={setSwiperRef}                 // 🔴 get swiper instance
        onSlideChange={(swiper) =>
          setActiveIndex(swiper.activeIndex)
        }
        grabCursor
        className="mb-4"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${API_URL}/uploads/${img}`}
              className="w-full h-96 object-contain rounded"
              alt="product"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* THUMBNAILS */}
      <div className="flex gap-2 justify-center mt-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={`${API_URL}/uploads/${img}`}
            onClick={() => {
              if (swiperRef) {
                swiperRef.slideTo(index);       // 🔴 THIS WAS MISSING
              }
            }}
            className={`w-16 h-16 object-cover cursor-pointer border ${
              activeIndex === index
                ? "border-black"
                : "border-gray-300"
            }`}
            alt="thumbnail"
          />
        ))}
      </div>
    </div>
  );
}
