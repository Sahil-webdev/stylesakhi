"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface BannerCarouselProps {
  banners: {
    image: string;
    desktopImage?: string;
    mobileImage?: string;
    alt: string;
    link?: string;
  }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isMobileView, setIsMobileView] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, nextSlide]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobileView(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (banners.length === 0) return null;

  const getBannerSrc = (banner: BannerCarouselProps["banners"][number]) => {
    const desktopImage = banner.desktopImage || banner.image;
    const mobileImage = banner.mobileImage || desktopImage;
    return isMobileView ? mobileImage : desktopImage;
  };

  return (
    <div
      className="group relative h-[70vh] h-[70svh] w-full overflow-hidden bg-black sm:h-auto sm:aspect-[16/8] md:aspect-[1232/420]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="relative min-w-full h-full"
          >
            {banner.link ? (
              <a className="block h-full w-full" href={banner.link}>
                <Image
                  src={getBannerSrc(banner)}
                  alt={banner.alt}
                  fill
                  sizes="100vw"
                  className="object-cover scale-[1.28] md:scale-100"
                  priority={index === 0}
                />
              </a>
            ) : (
              <Image
                src={getBannerSrc(banner)}
                alt={banner.alt}
                fill
                sizes="100vw"
                className="object-cover scale-[1.28] md:scale-100"
                priority={index === 0}
              />
            )}
          </div>
        ))}
      </div>

      {showArrows && banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7 text-gray-800" />
          </button>
        </>
      )}

      {showDots && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
