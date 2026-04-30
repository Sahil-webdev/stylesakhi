"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const space = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

const products = [
  {
    name: "Cat Eye Sunglasses",
    price: "₹799",
    tag: "Trending",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Mini Crossbody Bag",
    price: "₹1,199",
    oldPrice: "₹1,799",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Pearl Hair Clips Set",
    price: "₹499",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Gold Bangle Set",
    price: "₹899",
    tag: "New",
    image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Retro Round Shades",
    price: "₹699",
    image: "https://images.pexels.com/photos/1398886/pexels-photo-1398886.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Aesthetic Tote Bag",
    price: "₹1,499",
    oldPrice: "₹2,199",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const glowCard =
  "rounded-2xl border border-[#00cfe826] bg-white/70 shadow-[0_8px_30px_rgba(0,150,200,0.08)] backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,207,232,0.15),0_8px_30px_rgba(0,150,200,0.12)]";

export default function GenAlphaAccessoriesPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const tagOptions = useMemo(() => {
    const tags = products.map((item) => item.tag).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(tags))];
  }, []);

  const displayedProducts = useMemo(() => {
    const withIndex = products.map((item, index) => ({ ...item, _index: index }));
    const filtered =
      selectedTag === "All"
        ? withIndex
        : withIndex.filter((item) => item.tag === selectedTag);

    const parsePrice = (value: string) => Number(value.replace(/[^\d]/g, ""));

    return filtered.sort((a, b) => {
      if (sortBy === "price-asc") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (sortBy === "price-desc") {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return a._index - b._index;
    });
  }, [selectedTag, sortBy]);

  return (
    <div className={`${space.className} ${jakarta.className} gradient-bg`}>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00cfe8]">
                Gen Alpha
              </p>
              <h1 className="text-3xl font-bold text-[#0a2540] md:text-4xl">
                Accessories
              </h1>
              <p className="mt-2 text-sm text-[#5b7c99] md:text-base">
                Complete your look with our curated collection of accessories.
              </p>
            </div>
            <Link
              href="/gen-alpha"
              className="rounded-xl border border-[#00cfe826] bg-white/70 px-4 py-2 text-sm font-semibold text-[#0a2540] shadow-[0_8px_30px_rgba(0,150,200,0.08)] backdrop-blur-[12px] transition hover:shadow-[0_0_20px_rgba(0,207,232,0.15)]"
            >
              Back to Gen Alpha
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-2xl border border-[#00cfe826] bg-white/70 p-4 text-sm text-[#0a2540] shadow-[0_8px_30px_rgba(0,150,200,0.08)] backdrop-blur-[12px] lg:sticky lg:top-24">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b7c99]">
                    Filter by tag
                  </p>
                  <select
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#00cfe826] bg-white/80 px-3 py-2 text-sm font-medium text-[#0a2540] outline-none"
                  >
                    {tagOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b7c99]">
                    Sort
                  </p>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#00cfe826] bg-white/80 px-3 py-2 text-sm font-medium text-[#0a2540] outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.map((product, index) => (
                <motion.article
                  key={`${product.name}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group overflow-hidden ${glowCard}`}
                >
                <div className="relative h-64 overflow-hidden md:h-72">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={480}
                    height={520}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {product.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-[linear-gradient(135deg,#00cfe8,#33e0ff)] px-3 py-1 text-xs font-semibold text-white">
                      {product.tag}
                    </span>
                  )}
                  <div className="pointer-events-none absolute bottom-3 right-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      className="pointer-events-auto rounded-full border border-[#00cfe826] bg-white/70 p-2 shadow-[0_0_20px_rgba(0,207,232,0.15)] backdrop-blur-[12px]"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="h-4 w-4 text-[#00cfe8]" />
                    </button>
                    <button
                      type="button"
                      className="pointer-events-auto rounded-full bg-[linear-gradient(135deg,#00cfe8,#33e0ff)] p-2 text-white shadow-[0_0_20px_rgba(0,207,232,0.15)]"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[#0a2540] line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-[#00cfe8]">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-[#5b7c99] line-through">
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .gradient-bg {
          background: linear-gradient(135deg, #f4fcff, #e6f9ff, #dff6ff);
        }
      `}</style>
    </div>
  );
}
