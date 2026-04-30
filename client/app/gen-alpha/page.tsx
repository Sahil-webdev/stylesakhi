"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/contexts/ShopContext";
import BannerCarousel from "@/components/BannerCarousel";
import GenerationHighestSelling from "@/components/GenerationHighestSelling";
import type { HighestSellingProduct } from "@/components/HighestSellingProducts";

const space = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

const glowCard =
  "rounded-2xl border border-[#00cfe826] bg-white/70 shadow-[0_8px_30px_rgba(0,150,200,0.08)] backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,207,232,0.15),0_8px_30px_rgba(0,150,200,0.12)]";

const banners = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
    alt: "Gen Alpha Collection Banner 1",
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
    alt: "Gen Alpha Collection Banner 2",
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
    alt: "Gen Alpha Collection Banner 3",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
    alt: "Gen Alpha Collection Banner 4",
  },
];

const products = {
  clothing: [
    {
      name: "Oversized Pastel Hoodie",
      price: "₹1,499",
      oldPrice: "₹2,199",
      tag: "Hot",
      image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Streetwear Cargo Pants",
      price: "₹1,799",
      tag: "New",
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Classic Denim Jacket",
      price: "₹2,299",
      oldPrice: "₹3,499",
      image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Mint Cloud Sweatshirt",
      price: "₹1,299",
      image: "https://images.pexels.com/photos/3747445/pexels-photo-3747445.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Wide Leg Trousers",
      price: "₹1,599",
      tag: "Sale",
      image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Cropped Bomber Jacket",
      price: "₹2,699",
      oldPrice: "₹3,999",
      image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
  accessories: [
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
  ],
  sneakers: [
    {
      name: "Chunky Platform Whites",
      price: "₹3,499",
      tag: "Best Seller",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Pastel Pink Runners",
      price: "₹2,799",
      oldPrice: "₹3,999",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Retro High Tops - Cyan",
      price: "₹2,499",
      tag: "New",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Canvas Slip-On Beige",
      price: "₹1,999",
      image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Cloud Walk Platforms",
      price: "₹3,299",
      image: "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Rose Athletic Shoes",
      price: "₹2,599",
      tag: "Sale",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
};

const bestsellers: HighestSellingProduct[] = [
  {
    id: "gen-alpha-bestseller-chunky-platform-whites",
    name: "Chunky Platform Whites",
    price: 3499,
    priceLabel: "Rs. 3,499",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Sneakers",
    href: "/sneakers/nova-form-strider",
    badge: "Best seller",
    rating: "4.9",
    soldLabel: "1.5k sold",
    note: "Platform hit",
  },
  {
    id: "gen-alpha-bestseller-cropped-bomber-jacket",
    name: "Cropped Bomber Jacket",
    price: 2699,
    priceLabel: "Rs. 2,699",
    image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Clothing",
    href: "/clothing/the-atelier-trench",
    badge: "New wave",
    rating: "4.8",
    soldLabel: "1.1k sold",
    note: "Style boost",
  },
  {
    id: "gen-alpha-bestseller-mini-crossbody-bag",
    name: "Mini Crossbody Bag",
    price: 1199,
    priceLabel: "Rs. 1,199",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Accessories",
    href: "/accessories/croissant-leather-bag",
    badge: "Most saved",
    rating: "4.7",
    soldLabel: "960 sold",
    note: "Mini carry",
  },
  {
    id: "gen-alpha-bestseller-oversized-pastel-hoodie",
    name: "Oversized Pastel Hoodie",
    price: 1499,
    priceLabel: "Rs. 1,499",
    image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Clothing",
    href: "/clothing/the-atelier-trench",
    badge: "Hot pick",
    rating: "4.8",
    soldLabel: "920 sold",
    note: "Cozy fit",
  },
];

type SectionKey = keyof typeof products;

const sectionMeta: Record<SectionKey, { title: string; subtitle: string; altBg?: boolean }> = {
  clothing: {
    title: "👗 Clothing Collection",
    subtitle: "Trendy fits that speak your vibe — from cozy hoodies to bold streetwear.",
  },
  accessories: {
    title: "✨ Accessories",
    subtitle: "Complete your look with our curated collection of accessories.",
    altBg: true,
  },
  sneakers: {
    title: "👟 Sneaker Drop",
    subtitle: "Step up your game with the freshest kicks of the season.",
  },
};

export default function GenAlphaPage() {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  return (
    <div className={`${space.className} ${jakarta.className} gradient-bg`}>
      <Navbar />

      <main className="min-h-screen px-6">
        <section className="pt-16 pb-8">
          <div className="max-w-[1265px] mx-auto">
            <BannerCarousel banners={banners} autoPlayInterval={4000} />
          </div>
        </section>

        <GenerationHighestSelling
          generation="gen-alpha"
          generationLabel="Gen Alpha"
          viewAllHref="/sneakers?generation=gen-alpha"
          backgroundClassName="bg-[#eaf9ff]"
          accentClassName="bg-[linear-gradient(135deg,#00cfe8,#33e0ff)] text-white"
          description="Fast-moving drops and playful essentials ranked by what Gen Alpha shoppers are buying most."
          fallbackProducts={bestsellers}
        />

        {(Object.keys(products) as SectionKey[]).map((key) => {
          const items = products[key];
          const meta = sectionMeta[key];
          const visibleItems = items.slice(0, 4);

          return (
            <section
              key={key}
              className={`mt-16 rounded-3xl px-6 py-16 md:px-10 ${meta.altBg ? "bg-[#eaf9ff]" : "bg-transparent"}`}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-start justify-between gap-4"
              >
                <div>
                  <h2 className="text-3xl font-bold text-[#0a2540] md:text-4xl">
                    {meta.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#5b7c99] md:text-base">
                    {meta.subtitle}
                  </p>
                </div>
                <Link
                  href={
                    key === "clothing"
                      ? "/clothing?generation=gen-alpha"
                      : key === "accessories"
                        ? "/accessories?generation=gen-alpha"
                        : key === "sneakers"
                          ? "/sneakers?generation=gen-alpha"
                          : `/gen-alpha/${key}`
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#00cfe8,#33e0ff)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,207,232,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,207,232,0.3)]"
                >
                  View More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleItems.map((product, index) => {
                  const rawPrice = Number((product.price || "").replace(/[^\d.]/g, ""));
                  const categoryLabel =
                    key === "clothing" ? "Clothing" : key === "accessories" ? "Accessories" : "Sneakers";
                  const productHref =
                    key === "clothing"
                      ? "/clothing/the-atelier-trench"
                      : key === "accessories"
                        ? "/accessories/croissant-leather-bag"
                        : "/sneakers/nova-form-strider";
                  const quickProduct = {
                    id: `gen-alpha-${key}-${product.name}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                    name: product.name,
                    price: Number.isFinite(rawPrice) ? rawPrice : 0,
                    image: product.image,
                    category: categoryLabel,
                    href: productHref,
                  };

                  const card = (
                    <motion.article
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
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              toggleWishlist(quickProduct);
                            }}
                            aria-label="Add to wishlist"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isWishlisted(quickProduct.id) ? "fill-[#00cfe8] text-[#00cfe8]" : "text-[#00cfe8]"
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            className="pointer-events-auto rounded-full bg-[linear-gradient(135deg,#00cfe8,#33e0ff)] p-2 text-white shadow-[0_0_20px_rgba(0,207,232,0.15)]"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              addToCart(quickProduct);
                            }}
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
                          <span className="font-semibold text-[#00cfe8]">
                            {product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-[#5b7c99] line-through">
                              {product.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );

                  if (key === "clothing") {
                    return (
                      <Link key={`${product.name}-${index}`} href="/clothing/the-atelier-trench" className="block">
                        {card}
                      </Link>
                    );
                  }

                  if (key === "accessories") {
                    return (
                      <Link key={`${product.name}-${index}`} href="/accessories/croissant-leather-bag" className="block">
                        {card}
                      </Link>
                    );
                  }

                  if (key === "sneakers") {
                    return (
                      <Link key={`${product.name}-${index}`} href="/sneakers/nova-form-strider" className="block">
                        {card}
                      </Link>
                    );
                  }

                  return <div key={`${product.name}-${index}`}>{card}</div>;
                })}
              </div>

            </section>
          );
        })}
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
