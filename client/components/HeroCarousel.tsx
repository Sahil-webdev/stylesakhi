"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HeroCarouselProps {
  category: "women" | "accessories" | "collection";
}

const carouselData = {
  women: [
    { image: "/banner4.png" },
    { image: "/banner2.png" },
    { image: "/banner3.png" },
    { image: "/banner4.png" },
    { image: "/banner5.png" },
    { image: "/banner6.png" },
  ],
  accessories: [
    { image: "/banner7.png" },
    { image: "/banner8.png" },
    { image: "/banner9.png" },
    { image: "/banner10.png" },
    { image: "/banner4.png" },
    { image: "/banner5.png" },
  ],
  collection: [
    { image: "/banner7.png" },
    { image: "/banner8.png" },
    { image: "/banner9.png" },
    { image: "/banner10.png" },
    { image: "/banner4.png" },
    { image: "/banner5.png" },
  ],
};

export default function HeroCarousel({ category }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = carouselData[category];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-[1265px] h-[431px] mx-auto overflow-hidden group bg-white">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={slide.image}
              alt="Banner"
              fill
              className="object-contain"
              priority={index === 0}
              quality={100}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
