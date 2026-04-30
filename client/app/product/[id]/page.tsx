"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Share2, Star, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Pink");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  const product = {
    id: 1,
    name: "Floral Summer Dress",
    price: 2499,
    originalPrice: 3999,
    rating: 4.5,
    reviews: 128,
    category: "Dresses",
    brand: "StyleSakhi",
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Blue", hex: "#87CEEB" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    description: "Embrace the summer vibes with this beautiful floral dress. Perfect for beach outings, garden parties, or casual day wear. Made from premium breathable fabric that keeps you cool and comfortable all day long.",
    features: [
      "Premium cotton blend fabric",
      "Breathable and lightweight",
      "Machine washable",
      "Perfect fit with adjustable straps",
      "Vibrant colors that last",
    ],
    specifications: {
      "Material": "100% Cotton",
      "Pattern": "Floral Print",
      "Sleeve Type": "Sleeveless",
      "Occasion": "Casual, Party",
      "Care Instructions": "Machine wash cold",
    }
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const deliveryLabel = formatDeliveryFromNow(7);
  const shopProduct = {
    id: String(product.id),
    name: product.name,
    price: product.price,
    image: product.images[0],
    category: product.category,
    href: `/product/${product.id}`,
  };
  const productWishlisted = isWishlisted(shopProduct.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/gen-z" className="hover:text-gray-900">Gen-Z</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-white mb-4 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-sm font-bold">
                {discount}% OFF
              </div>
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white border-2 transition-all ${
                    selectedImage === index ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                {discount}% OFF
              </span>
            </div>

            <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
              Expected delivery by <span className="font-semibold">{deliveryLabel}</span>
            </p>

            {/* Color Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Color: <span className="font-normal text-gray-600">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? "border-gray-900 scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Size: <span className="font-normal text-gray-600">{selectedSize}</span>
              </p>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 font-semibold text-sm transition-all ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Quantity</p>
              <div className="flex items-center border-2 border-gray-300 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold border-x-2 border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(shopProduct, quantity)}
                className="flex-1 bg-teal-600 text-white py-4 font-bold text-sm tracking-wider hover:bg-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
              </button>
              <button
                onClick={() => toggleWishlist(shopProduct)}
                className={`px-6 py-4 border-2 transition-all ${
                  productWishlisted
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${productWishlisted ? "text-pink-500 fill-pink-500" : "text-gray-700"}`}
                />
              </button>
              <button className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 transition-all">
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-8 h-8 text-teal-600 mb-2" />
                <p className="text-xs font-semibold">Free Delivery</p>
                <p className="text-xs text-gray-600">On orders above ₹5000</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-8 h-8 text-teal-600 mb-2" />
                <p className="text-xs font-semibold">Easy Returns</p>
                <p className="text-xs text-gray-600">15 days return policy</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-teal-600 mb-2" />
                <p className="text-xs font-semibold">Secure Payment</p>
                <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-white p-8"
        >
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-teal-600 mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-3 border-b">
                    <span className="text-sm font-semibold text-gray-900 w-1/2">{key}</span>
                    <span className="text-sm text-gray-700 w-1/2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
