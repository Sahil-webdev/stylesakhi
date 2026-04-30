"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

const slides = [
  {
    image: "/ethnicwear.jpg",
    title: "Ethnic Wear Collection",
    subtitle: "Traditional elegance meets modern style"
  },
  {
    image: "/banner2.png",
    title: "Designer Collection",
    subtitle: "Exclusive designs for every occasion"
  },
  {
    image: "/banner3.png",
    title: "Festive Special",
    subtitle: "Celebrate in style"
  },
  {
    image: "/banner4.png",
    title: "Latest Trends",
    subtitle: "Discover what's new"
  },
];

export default function ExpoSlider() {
  return (
    <div className="w-full py-16 bg-[#FFC0CB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Featured Collections
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our curated selection
        </p>

        <div className="relative">
          <Swiper
            effect="creative"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.5}
            spaceBetween={30}
            loop={true}
            speed={800}
            creativeEffect={{
              prev: {
                translate: ["-120%", 0, -500],
                scale: 0.8,
                opacity: 0.6,
              },
              next: {
                translate: ["120%", 0, -500],
                scale: 0.8,
                opacity: 0.6,
              },
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[EffectCreative, Pagination, Autoplay]}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
                creativeEffect: {
                  prev: {
                    translate: ["-110%", 0, -300],
                    scale: 0.85,
                    opacity: 0.5,
                  },
                  next: {
                    translate: ["110%", 0, -300],
                    scale: 0.85,
                    opacity: 0.5,
                  },
                },
              },
              640: {
                slidesPerView: 1.3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },
            }}
            className="expo-slider !pb-16"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-white group cursor-grab active:cursor-grabbing transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl md:text-4xl font-bold mb-2 transform transition-all duration-500 group-hover:translate-y-[-8px]">
                      {slide.title}
                    </h3>
                    <p className="text-lg md:text-xl font-light opacity-90 transition-all duration-500 group-hover:opacity-100">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .expo-slider .swiper-slide {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }

        .expo-slider .swiper-slide-active {
          z-index: 2;
        }

        .expo-slider .swiper-pagination {
          bottom: 0 !important;
        }

        .expo-slider .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.4) !important;
          opacity: 0.6 !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease;
        }

        .expo-slider .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: #B91C1C !important;
          width: 28px !important;
          border-radius: 6px !important;
        }

        @media (max-width: 768px) {
          .expo-slider .swiper-slide {
            transform: scale(0.95);
          }

          .expo-slider .swiper-slide-active {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
