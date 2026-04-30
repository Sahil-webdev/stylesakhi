"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  actualPrice: number;
  salePrice: number;
}

export default function ProductCard({ id, image, title, actualPrice, salePrice }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const discount = Math.round(((actualPrice - salePrice) / actualPrice) * 100);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
            isLiked
              ? "bg-red-500 text-white shadow-lg scale-110"
              : "bg-white/80 text-gray-700 hover:bg-white hover:scale-110"
          }`}
        >
          <Heart
            className="w-5 h-5 transition-all duration-300"
            fill={isLiked ? "white" : "none"}
            color={isLiked ? "white" : "currentColor"}
          />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{salePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{actualPrice.toLocaleString()}
          </span>
        </div>

        {/* Add to Cart Button - Shows on Hover */}
        <button className="w-full mt-3 bg-gray-900 text-white py-2.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-red-600">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
