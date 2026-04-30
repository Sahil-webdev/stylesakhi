"use client";

import { useEffect, useState } from "react";
import HighestSellingProducts, { type HighestSellingProduct } from "@/components/HighestSellingProducts";
import { fetchHighestSellingProducts, type ProductGeneration, type ProductRecord } from "@/lib/products-api";

type GenerationHighestSellingProps = {
  generation: ProductGeneration;
  generationLabel: string;
  description: string;
  viewAllHref: string;
  fallbackProducts: HighestSellingProduct[];
  accentClassName?: string;
  backgroundClassName?: string;
};

const categoryLabelMap: Record<string, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  sneakers: "Sneakers",
};

const toHighestSellingCard = (product: ProductRecord, index: number): HighestSellingProduct => {
  const categoryLabel = categoryLabelMap[product.category] || "Product";
  const ratingValue = Number(product.averageRating || 0);
  const reviewCount = Number(product.numReviews || 0);

  return {
    id: product._id,
    name: product.name,
    price: Number(product.price || 0),
    priceLabel: `₹${Number(product.price || 0).toLocaleString("en-IN")}`,
    image: product.images?.[0] || "https://placehold.co/600x750?text=No+Image",
    video: product.video || "",
    category: categoryLabel,
    href: `/${product.category}?generation=${product.generation}`,
    badge: index === 0 ? "Top pick" : "Most loved",
    rating: ratingValue > 0 ? ratingValue.toFixed(1) : "4.5",
    soldLabel: reviewCount > 0 ? `${reviewCount} reviews` : "Trending now",
    note: product.brand?.trim() || "Customer favorite",
  };
};

export default function GenerationHighestSelling({
  generation,
  generationLabel,
  description,
  viewAllHref,
  fallbackProducts,
  accentClassName,
  backgroundClassName,
}: GenerationHighestSellingProps) {
  const [products, setProducts] = useState<HighestSellingProduct[]>(fallbackProducts);

  useEffect(() => {
    let mounted = true;

    const loadHighestSelling = async () => {
      try {
        const items = await fetchHighestSellingProducts(generation, 4);
        if (!mounted || items.length === 0) return;
        setProducts(items.map(toHighestSellingCard));
      } catch {
        // Keep fallback cards when API is unavailable.
      }
    };

    loadHighestSelling();
    return () => {
      mounted = false;
    };
  }, [generation]);

  return (
    <HighestSellingProducts
      generationLabel={generationLabel}
      viewAllHref={viewAllHref}
      backgroundClassName={backgroundClassName}
      accentClassName={accentClassName}
      description={description}
      products={products}
    />
  );
}
