"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";

export default function ClassicPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isWishlisted, toggleWishlist } = useShop();

  // Hero Images - Calm, Traditional, Graceful
  const heroImages = [
    "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ];

  // Very slow carousel - 8 seconds (though only 1 image for static feel)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Categories - Traditional & Familiar
  const categories = [
    { id: "sarees", name: "Sarees", image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "kurtis", name: "Kurtis & Sets", image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "dupattas", name: "Dupattas", image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "blouses", name: "Blouses", image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "footwear", name: "Traditional Footwear", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  // By Occasion - Classic Feature
  const byOccasion = [
    { id: "daily", name: "Daily Wear", image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "festive", name: "Festive Wear", image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "pooja", name: "Pooja Special", image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "family", name: "Family Function", image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  // Clothing Products - Traditional Items
  const clothingProducts = [
    { id: "c1", name: "Cotton Saree", price: 1899, image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c2", name: "Silk Kurti", price: 1299, image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c3", name: "Printed Dupatta", price: 699, image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c4", name: "Designer Blouse", price: 899, image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c5", name: "Festive Saree", price: 2499, image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c6", name: "Kurti Set", price: 1599, image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c7", name: "Chanderi Saree", price: 2199, image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c8", name: "Cotton Kurti", price: 999, image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c9", name: "Banarasi Dupatta", price: 1299, image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c10", name: "Embroidered Blouse", price: 1099, image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c11", name: "Party Wear Saree", price: 2899, image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "c12", name: "Anarkali Kurti", price: 1799, image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  // Accessories - Supporting Role
  const accessories = [
    { id: "a1", name: "Gold Bangles", price: 1499, image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "a2", name: "Traditional Earrings", price: 899, image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "a3", name: "Ethnic Handbag", price: 1199, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "a4", name: "Silver Anklets", price: 799, image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "a5", name: "Beaded Necklace", price: 1099, image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: "a6", name: "Juttis", price: 1299, image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  const toShopProduct = (
    item: { id: string; name: string; price: number; image: string },
    category: string
  ): ShopProduct => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category,
      href: "/classic",
    };
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-[#F9F6F1]">
        {/* Hero Section - Calm & Traditional */}
        <section className="relative h-[65vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentSlide]}
                alt="Classic Fashion"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Soft Respectful Line */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-white text-lg font-light tracking-wide"
              style={{ fontFamily: 'serif' }}
            >
              tradition meets comfort
            </motion.p>
          </div>
        </section>

        {/* Categories Section - Simple & Clear */}
        <section className="py-16 px-8 bg-[#F5F1EA]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center mb-10 text-[#4A3728]" style={{ fontFamily: 'serif' }}>
              Shop by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href="/women">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-56 overflow-hidden border border-[#D4C5B0] bg-white cursor-pointer group"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3 text-center">
                      <h3 className="text-[#4A3728] font-medium" style={{ fontFamily: 'serif' }}>{category.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* By Occasion - Classic Feature */}
        <section className="py-16 px-8 bg-[#EDE7DD]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center mb-4 text-[#4A3728]" style={{ fontFamily: 'serif' }}>
              By Occasion
            </h2>
            <p className="text-center text-[#6B5D4F] mb-10 text-lg">
              Choose what suits your moment
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {byOccasion.map((occasion) => (
                <Link key={occasion.id} href="/women">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-48 overflow-hidden border-2 border-[#A67B5B] bg-white cursor-pointer group"
                  >
                    <Image
                      src={occasion.image}
                      alt={occasion.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                      <h3 className="text-white font-medium text-lg" style={{ fontFamily: 'serif' }}>
                        {occasion.name}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Clothing Section - Main Focus */}
        <section className="py-16 px-8 bg-[#F5F1EA]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center mb-10 text-[#4A3728]" style={{ fontFamily: 'serif' }}>
              Our Collection
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clothingProducts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-[#D4C5B0] overflow-hidden group relative"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(toShopProduct(item, "Clothing"))}
                    className="absolute top-3 right-3 z-10 bg-white/95 p-2 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted(item.id) ? "fill-[#8B4513] text-[#8B4513]" : "text-[#6B5D4F] hover:text-[#8B4513]"
                      }`}
                    />
                  </motion.button>

                  <div className="relative w-full aspect-[3/4] bg-[#FAF8F5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 bg-white">
                    <h3 className="text-base font-medium text-[#4A3728] mb-2" style={{ fontFamily: 'serif' }}>
                      {item.name}
                    </h3>
                    <p className="text-lg font-semibold text-[#8B4513]">₹{item.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Accessories Section - Supporting Role */}
        <section className="py-16 px-8 bg-[#EDE7DD]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center mb-10 text-[#4A3728]" style={{ fontFamily: 'serif' }}>
              Complete Your Look
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {accessories.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-[#D4C5B0] overflow-hidden group relative"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(toShopProduct(item, "Accessories"))}
                    className="absolute top-2 right-2 z-10 bg-white/95 p-1.5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted(item.id) ? "fill-[#8B4513] text-[#8B4513]" : "text-[#6B5D4F] hover:text-[#8B4513]"
                      }`}
                    />
                  </motion.button>

                  <div className="relative w-full aspect-square bg-[#FAF8F5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3 bg-white">
                    <h3 className="text-sm font-medium text-[#4A3728] mb-1" style={{ fontFamily: 'serif' }}>
                      {item.name}
                    </h3>
                    <p className="text-base font-semibold text-[#8B4513]">₹{item.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
