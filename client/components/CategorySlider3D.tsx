"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Category {
  name: string;
  description: string;
  image: string;
  link: string;
}

export default function CategorySlider3D() {
  const categories: Category[] = [
    {
      name: "Women's Fashion",
      description: "Explore the latest trends in ethnic and western wear",
      image: "/women-hero-1.jpg",
      link: "/clothing",
    },
    {
      name: "Accessories",
      description: "Complete your look with our premium accessories",
      image: "/accessories-hero-1.jpg",
      link: "/accessories",
    },
    {
      name: "Exclusive Collection",
      description: "Discover our handpicked designer collections",
      image: "/collection-hero-1.jpg",
      link: "/classic",
    },
  ];

  // Duplicate slides for smooth infinite loop
  const allSlides = [...categories, ...categories];

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          Shop by Category
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          Discover your perfect style across our curated collections
        </p>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2.5,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="mySwiper pb-16"
        >
          {allSlides.map((category, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <Link href={category.link} className="block group">
                <div className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={95}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                    <h3 className="text-4xl font-bold mb-4 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                      {category.name}
                    </h3>
                    <p className="text-base text-white/90 mb-6">
                      {category.description}
                    </p>
                    <span className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full text-sm font-semibold group-hover:bg-[#B91C1C] group-hover:text-white transition-all duration-300 shadow-lg transform group-hover:scale-110">
                      Explore Now →
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper {
          width: 100%;
          padding: 80px 0;
        }

        .swiper-slide {
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .swiper-slide-active {
          opacity: 1;
          transform: scale(1.1);
          z-index: 2;
        }

        .swiper-slide-next,
        .swiper-slide-prev {
          opacity: 0.6;
        }

        .swiper-slide-shadow {
          background: rgba(0, 0, 0, 0.3);
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: #B91C1C;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(185, 28, 28, 0.4);
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #991b1b;
          transform: scale(1.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }

        .swiper-pagination-bullet {
          background: #B91C1C;
          width: 14px;
          height: 14px;
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 40px;
          border-radius: 8px;
          background: #B91C1C;
        }

        @media (max-width: 768px) {
          .swiper {
            padding: 40px 0;
          }
          
          .swiper-slide-active {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
