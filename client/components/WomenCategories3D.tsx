"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = [
  {
    name: "Saree",
    image: "/ethnicwear.jpg",
    link: "/women/saree"
  },
  {
    name: "Kurtis",
    image: "/ethnicwear.jpg",
    link: "/women/kurtis"
  },
  {
    name: "Shirt",
    image: "/ethnicwear.jpg",
    link: "/women/shirt"
  },
  {
    name: "T-Shirt",
    image: "/ethnicwear.jpg",
    link: "/women/tshirt"
  },
  {
    name: "Jeans",
    image: "/ethnicwear.jpg",
    link: "/women/jeans"
  },
  {
    name: "Pants",
    image: "/ethnicwear.jpg",
    link: "/women/pants"
  },
  {
    name: "Jackets",
    image: "/ethnicwear.jpg",
    link: "/women/jackets"
  },
];

export default function WomenCategories3D() {
  return (
    <div className="w-full py-20 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Shop by Category
        </h2>
        <p className="text-center text-gray-600 mb-16">
          Explore our exclusive collection
        </p>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          coverflowEffect={{
            rotate: 15,
            stretch: -40,
            depth: 300,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: false,
          }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          breakpoints={{
            320: {
              coverflowEffect: {
                rotate: 10,
                stretch: -30,
                depth: 200,
                modifier: 1,
              },
            },
            768: {
              coverflowEffect: {
                rotate: 15,
                stretch: -40,
                depth: 300,
                modifier: 1,
              },
            },
          }}
          className="!pb-20"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index} className="!w-[350px] md:!w-[450px]">
              <Link href={category.link}>
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] cursor-pointer group transition-all duration-500 hover:shadow-[0_25px_80px_rgba(0,0,0,0.4)] bg-white">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 350px, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop Now →
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #B91C1C !important;
          background: rgba(255, 255, 255, 0.95);
          width: 55px !important;
          height: 55px !important;
          border-radius: 50%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: all 0.4s ease;
          border: 3px solid rgba(185, 28, 28, 0.2);
          backdrop-filter: blur(10px);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 22px !important;
          font-weight: bold;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #B91C1C;
          color: white !important;
          transform: scale(1.2);
          box-shadow: 0 12px 32px rgba(185, 28, 28, 0.4);
          border-color: #B91C1C;
        }

        .swiper-button-next.swiper-button-disabled,
        .swiper-button-prev.swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed;
        }

        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.5) !important;
          opacity: 0.6 !important;
          width: 12px !important;
          height: 12px !important;
          border: 2px solid white;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: #B91C1C !important;
          width: 32px !important;
          border-radius: 8px !important;
        }

        .swiper-slide {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0.6;
        }

        .swiper-slide-active {
          opacity: 1 !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
