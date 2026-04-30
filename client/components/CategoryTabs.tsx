"use client";

import { useState, useEffect, useRef } from "react";

const categories = [
  { name: "Trending", slug: "trending" },
  { name: "Women Knitted Sweaters", slug: "knitted-sweaters" },
  { name: "Women Hoodies", slug: "hoodies" },
  { name: "Women Jackets", slug: "jackets" },
  { name: "Women T-Shirts", slug: "tshirts" },
  { name: "Women Shirts", slug: "shirts" },
  { name: "Women Jeans", slug: "jeans" },
  { name: "Women Pants", slug: "pants" },
  { name: "Women Cropped Tops", slug: "cropped-tops" },
];

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("hoodies");
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsOffsetTop, setTabsOffsetTop] = useState(0);

  useEffect(() => {
    if (tabsRef.current) {
      setTabsOffsetTop(tabsRef.current.offsetTop);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 80; // Navbar height
      const scrollPosition = window.scrollY;
      
      // Stick when scroll position reaches the tabs position minus navbar height
      if (tabsOffsetTop > 0) {
        setIsSticky(scrollPosition >= tabsOffsetTop - navbarHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabsOffsetTop]);

  return (
    <>
      <div
        ref={tabsRef}
        className={`w-full bg-white z-40 transition-all duration-500 ease-in-out ${
          isSticky ? "fixed top-[80px] shadow-lg animate-slideDown" : "relative"
        }`}
        style={isSticky ? { left: 0, right: 0 } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                  activeCategory === category.slug
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content jump when tabs become fixed */}
      {isSticky && <div style={{ height: "68px" }} />}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
