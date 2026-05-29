"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gem,
  Heart,
  Plus,
  RotateCcw,
  Star,
  Zap,
} from "lucide-react";
import { Cormorant_Garamond, DM_Mono, Syne } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BannerCarousel from "@/components/BannerCarousel";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";
import { defaultGenerationBanners, fetchBannerConfig, type BannerItem } from "@/lib/banner-config";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600"], style: ["normal", "italic"] });

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: "New" | "Trending" | "Limited";
  rating: number;
  reviews: number;
  href: string;
};

type SneakerProduct = CatalogProduct & {
  tags: string[];
  description: string;
  sizes: string[];
};

const marqueeItems = [
  "Free Shipping Over \u20B975",
  "New Drops Every Week",
  "Premium Quality",
  "Easy Returns",
  "Exclusive Members Only",
  "Sustainable Fashion",
];

const clothingProducts: CatalogProduct[] = [
  {
    id: "genz-clothing-essential-oversized-tee",
    name: "Essential Oversized Tee",
    category: "T-Shirts",
    price: 45,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop",
    badge: "New",
    rating: 5,
    reviews: 128,
    href: "/clothing/the-atelier-trench",
  },
  {
    id: "genz-clothing-cloud-comfort-hoodie",
    name: "Cloud Comfort Hoodie",
    category: "Hoodies",
    price: 89,
    oldPrice: 110,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=700&fit=crop",
    badge: "Trending",
    rating: 5,
    reviews: 94,
    href: "/clothing/the-atelier-trench",
  },
  {
    id: "genz-clothing-relaxed-linen-button-up",
    name: "Relaxed Linen Button-Up",
    category: "Shirts",
    price: 68,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=700&fit=crop",
    rating: 4,
    reviews: 67,
    href: "/clothing/the-atelier-trench",
  },
  {
    id: "genz-clothing-urban-utility-jacket",
    name: "Urban Utility Jacket",
    category: "Jackets",
    price: 145,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=700&fit=crop",
    badge: "Limited",
    rating: 5,
    reviews: 156,
    href: "/clothing/the-atelier-trench",
  },
  {
    id: "genz-clothing-vintage-wide-leg",
    name: "Vintage Wash Wide Leg",
    category: "Jeans",
    price: 78,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=700&fit=crop",
    rating: 4,
    reviews: 83,
    href: "/clothing/the-atelier-trench",
  },
  {
    id: "genz-clothing-archive-graphic-tee",
    name: "Archive Graphic Tee",
    category: "T-Shirts",
    price: 39,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=700&fit=crop",
    badge: "New",
    rating: 5,
    reviews: 201,
    href: "/clothing/the-atelier-trench",
  },
];

const accessoriesProducts: CatalogProduct[] = [
  {
    id: "genz-accessories-minimal-chrono-watch",
    name: "Minimal Chrono Watch",
    category: "Watches",
    price: 189,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 76,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-logo-dad-cap",
    name: "Logo Dad Cap",
    category: "Caps",
    price: 28,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 112,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-retro-oval-shades",
    name: "Retro Oval Shades",
    category: "Sunglasses",
    price: 56,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 89,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-crossbody-mini-bag",
    name: "Crossbody Mini Bag",
    category: "Bags",
    price: 72,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 64,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-cuban-link-chain",
    name: "Cuban Link Chain",
    category: "Chains",
    price: 42,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 48,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-slim-leather-wallet",
    name: "Slim Leather Wallet",
    category: "Wallets",
    price: 38,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 91,
    href: "/accessories/croissant-leather-bag",
  },
  {
    id: "genz-accessories-woven-statement-belt",
    name: "Woven Statement Belt",
    category: "Belts",
    price: 34,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 55,
    href: "/accessories/croissant-leather-bag",
  },
];

const sneakersProducts: SneakerProduct[] = [
  {
    id: "genz-sneakers-air-pulse-max",
    name: "Air Pulse Max",
    category: "Sneakers",
    price: 189,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop",
    rating: 5,
    reviews: 210,
    href: "/sneakers/nova-form-strider",
    tags: ["New Drop", "Trending"],
    description: "Bold red colorway with responsive cushioning and breathable mesh upper.",
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    id: "genz-sneakers-terrain-runner",
    name: "Terrain Runner",
    category: "Sneakers",
    price: 156,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&h=700&fit=crop",
    rating: 5,
    reviews: 164,
    href: "/sneakers/nova-form-strider",
    tags: ["Limited Stock"],
    description: "Earth-tone palette meets trail-ready design. Built for all-day comfort.",
    sizes: ["7", "8", "9", "10", "11"],
  },
  {
    id: "genz-sneakers-cloud-walker",
    name: "Cloud Walker",
    category: "Sneakers",
    price: 134,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&h=700&fit=crop",
    rating: 4,
    reviews: 120,
    href: "/sneakers/nova-form-strider",
    tags: ["Trending"],
    description: "Clean white silhouette with cloud-foam sole. The everyday essential.",
    sizes: ["6", "7", "8", "9", "10", "11"],
  },
  {
    id: "genz-sneakers-velocity-x",
    name: "Velocity X",
    category: "Sneakers",
    price: 198,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&h=700&fit=crop",
    rating: 5,
    reviews: 178,
    href: "/sneakers/nova-form-strider",
    tags: ["New Drop", "Limited Stock"],
    description: "Performance meets street style. Bold orange accent on premium leather.",
    sizes: ["8", "9", "10", "11", "12"],
  },
];

function productToShopProduct(product: CatalogProduct): ShopProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    href: product.href,
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#f5a623]">
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx < Math.round(rating);
        return <Star key={idx} className={`h-3.5 w-3.5 ${filled ? "fill-current" : ""}`} />;
      })}
    </div>
  );
}

function ProductCard({ product, onAddToCart, onToggleWishlist, wished }: {
  product: CatalogProduct;
  onAddToCart: (p: CatalogProduct) => void;
  onToggleWishlist: (p: CatalogProduct) => void;
  wished: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="group overflow-hidden rounded-[20px] border border-[#1a17140a] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(26,23,20,0.1)]"
    >
      <div className="relative h-[320px] overflow-hidden bg-[#eae4d8]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {product.badge ? (
          <span className="absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white"
            style={{
              background: product.badge === "Trending" ? "#c44b2b" : product.badge === "Limited" ? "#b8a9d4" : "#1a1714",
              color: product.badge === "Limited" ? "#1a1714" : "#ffffff",
            }}
          >
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute right-3.5 top-3.5 grid h-9 w-9 translate-y-[-8px] place-items-center rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(26,23,20,0.04)] transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-[#c44b2b] text-[#c44b2b]" : "text-[#1a1714]"}`} />
        </button>
      </div>

      <Link href={product.href} className="block px-5 pb-6 pt-5">
        <p className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[#8a8279]">{product.category}</p>
        <h3 className={`${syne.className} mb-2 text-base font-semibold text-[#1a1714]`}>{product.name}</h3>

        <div className="mb-3 flex items-center gap-2 text-[11px] text-[#8a8279]">
          <Stars rating={product.rating} />
          <span>({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className={`${syne.className} text-xl font-bold text-[#1a1714]`}>
            {"\u20B9"}{product.price}
            {product.oldPrice ? <span className="ml-2 text-sm font-normal text-[#8a8279] line-through">{"\u20B9"}{product.oldPrice}</span> : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1a1714] text-white transition hover:scale-110 hover:bg-[#c44b2b]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </Link>
    </motion.article>
  );
}

export default function GenZPage() {
  const [banners, setBanners] = useState<BannerItem[]>(() => defaultGenerationBanners["gen-z"]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(sneakersProducts.map((item) => [item.id, item.sizes[Math.floor(item.sizes.length / 2)] ?? item.sizes[0]])),
  );

  const accessoriesRef = useRef<HTMLDivElement | null>(null);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  useEffect(() => {
    let active = true;
    const loadBanners = async () => {
      try {
        const config = await fetchBannerConfig();
        if (active) setBanners(config.generationBanners["gen-z"]);
      } catch {
        // Keep fallback
      }
    };

    void loadBanners();

    return () => {
      active = false;
    };
  }, []);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
    window.setTimeout(() => setSubscribed(false), 3000);
  };

  const scrollAccessories = (direction: "left" | "right") => {
    const node = accessoriesRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === "left" ? -304 : 304, behavior: "smooth" });
  };

  return (
    <div className={`${dmMono.className} bg-[#f6f3ee] text-[#1a1714] antialiased selection:bg-[#f0e8d8] selection:text-[#1a1714]`}>
      <Navbar />

      <main className="genz-vltg relative overflow-x-hidden">
        <section className="pt-16">
          <BannerCarousel banners={banners} autoPlayInterval={4000} />
        </section>

        {/*
          Legacy Gen Z content below hero preserved as requested.
          Old blocks kept: clothing section, accessories section, sneakers section,
          each with previous ProductHoverActions cards and old style jsx font imports.
        */}

        <section className="overflow-hidden bg-[#1a1714] py-[18px]">
          <div className="genz-marquee-track flex w-max gap-14">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={`${item}-${idx}`} className={`${syne.className} flex items-center gap-4 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-[#f6f3ee]`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#c44b2b]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="clothing" className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-[1340px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              className="mb-12"
            >
              <p className="mb-3 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[#c44b2b]">
                <span className="h-[1.5px] w-6 bg-[#c44b2b]" /> 01 - Collection
              </p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className={`${syne.className} text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.03em]`}>
                  Clothing <span className={`${cormorant.className} font-light italic text-[#8a8279]`}>Collection</span>
                </h2>
                <Link href="/clothing?generation=gen-z" className="rounded-full border-2 border-[#1a17141f] px-8 py-3 text-xs uppercase tracking-[0.1em] transition hover:bg-[#1a1714] hover:text-[#f6f3ee]">
                  View More
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
              {clothingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wished={isWishlisted(product.id)}
                  onToggleWishlist={(item) => toggleWishlist(productToShopProduct(item))}
                  onAddToCart={(item) => addToCart(productToShopProduct(item))}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="accessories" className="relative bg-[#efe9df] px-5 py-24 md:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1a171414] to-transparent" />
          <div className="mx-auto max-w-[1340px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }}>
                <p className="mb-3 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[#c44b2b]">
                  <span className="h-[1.5px] w-6 bg-[#c44b2b]" /> 02 - Accessories
                </p>
                <h2 className={`${syne.className} text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.03em]`}>
                  Complete <span className={`${cormorant.className} font-light italic text-[#8a8279]`}>the Look</span>
                </h2>
              </motion.div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => scrollAccessories("left")}
                  className="grid h-12 w-12 place-items-center rounded-full border border-[#1a17141a] bg-white transition hover:bg-[#1a1714] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollAccessories("right")}
                  className="grid h-12 w-12 place-items-center rounded-full border border-[#1a17141a] bg-white transition hover:bg-[#1a1714] hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={accessoriesRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {accessoriesProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: idx * 0.06 }}
                  className="min-w-[280px] max-w-[280px]"
                >
                  <ProductCard
                    product={product}
                    wished={isWishlisted(product.id)}
                    onToggleWishlist={(item) => toggleWishlist(productToShopProduct(item))}
                    onAddToCart={(item) => addToCart(productToShopProduct(item))}
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/accessories?generation=gen-z" className="inline-flex rounded-full border-2 border-[#1a17141f] px-8 py-3 text-xs uppercase tracking-[0.1em] transition hover:bg-[#1a1714] hover:text-[#f6f3ee]">
                View All Accessories
              </Link>
            </div>
          </div>
        </section>

        <section id="sneakers" className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-[1340px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              className="mb-12"
            >
              <p className="mb-3 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[#c44b2b]">
                <span className="h-[1.5px] w-6 bg-[#c44b2b]" /> 03 - Sneakers
              </p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className={`${syne.className} text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.03em]`}>
                  Sneaker <span className={`${cormorant.className} font-light italic text-[#8a8279]`}>Drops</span>
                </h2>
                <Link href="/sneakers?generation=gen-z" className="rounded-full border-2 border-[#1a17141f] px-8 py-3 text-xs uppercase tracking-[0.1em] transition hover:bg-[#1a1714] hover:text-[#f6f3ee]">
                  View All Sneakers
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-1 md:gap-7 xl:grid-cols-2">
              {sneakersProducts.map((item, idx) => {
                const activeSize = selectedSizes[item.id] ?? item.sizes[0];
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: idx * 0.06 }}
                    className="overflow-hidden rounded-[18px] border border-[#1a17140a] bg-white md:grid md:min-h-[340px] md:grid-cols-2 md:rounded-[28px]"
                  >
                    <Link href={item.href} className="relative h-32 overflow-hidden bg-[#eae4d8] sm:h-40 md:h-auto">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    </Link>

                    <div className="flex flex-col justify-center p-3 sm:p-4 md:p-8">
                      <div className="mb-2 flex flex-wrap gap-1.5 md:mb-4 md:gap-2">
                        {item.tags.map((tag) => {
                          const style = tag.includes("New")
                            ? "bg-[#c44b2b14] text-[#c44b2b] border-[#c44b2b33]"
                            : tag.includes("Trending")
                              ? "bg-[#b8a9d426] text-[#7b6a9e] border-[#b8a9d44d]"
                              : "bg-[#a8c5a026] text-[#5a7a52] border-[#a8c5a04d]";
                          return (
                            <span key={`${item.id}-${tag}`} className={`rounded-full border px-2 py-1 text-[8px] uppercase tracking-[0.08em] md:px-3 md:text-[9px] md:tracking-[0.1em] ${style}`}>
                              {tag}
                            </span>
                          );
                        })}
                      </div>

                      <Link href={item.href} className={`${syne.className} mb-1 text-base font-bold leading-tight text-[#1a1714] sm:text-lg md:mb-2 md:text-2xl`}>
                        {item.name}
                      </Link>
                      <p className="mb-2 text-[10px] leading-snug text-[#8a8279] sm:text-[11px] md:mb-4 md:text-xs md:leading-relaxed">{item.description}</p>
                      <p className={`${syne.className} mb-3 text-lg font-bold text-[#1a1714] sm:text-xl md:mb-5 md:text-3xl`}>{"\u20B9"}{item.price}</p>

                      <div className="mb-3 hidden flex-wrap gap-1.5 md:mb-5 md:flex">
                        {item.sizes.map((size) => (
                          <button
                            key={`${item.id}-${size}`}
                            type="button"
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: size }))}
                            className={`rounded-md border px-3 py-1.5 text-[10px] transition ${activeSize === size ? "border-[#1a1714] bg-[#1a1714] text-white" : "border-[#1a17141a] text-[#1a1714]"}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 md:gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(productToShopProduct(item))}
                          className="inline-flex items-center gap-1 rounded-full bg-[#1a1714] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[#f6f3ee] transition hover:bg-[#c44b2b] md:gap-2 md:px-6 md:py-3 md:text-xs md:tracking-[0.1em]"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(productToShopProduct(item))}
                          className="grid h-8 w-8 place-items-center rounded-full border border-[#1a17141a] bg-white md:h-11 md:w-11"
                        >
                          <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isWishlisted(item.id) ? "fill-[#c44b2b] text-[#c44b2b]" : "text-[#1a1714]"}`} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1714] to-[#2d2824] px-5 py-16 md:px-8">
          <div className="pointer-events-none absolute -right-[10%] -top-[50%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,75,43,0.15)_0%,transparent_70%)]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="relative mx-auto flex max-w-[1340px] flex-wrap items-center justify-between gap-8"
          >
            <div>
              <h3 className={`${syne.className} mb-2 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.02em] text-[#f6f3ee]`}>Trending Now</h3>
              <p className="text-sm text-[#f6f3ee80]">See what everyone&apos;s wearing this season</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Streetwear", "Y2K Revival", "Minimalist", "Gorpcore", "Dopamine Dressing"].map((chip) => (
                <button key={chip} type="button" className="rounded-full border border-[#f6f3ee1f] bg-[#f6f3ee14] px-5 py-2.5 text-xs uppercase tracking-[0.08em] text-[#f6f3ee] transition hover:border-[#c44b2b] hover:bg-[#c44b2b]">
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-[1340px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="mb-14 text-center"
            >
              <p className="mb-3 flex items-center justify-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[#c44b2b]">
                <span className="h-[1.5px] w-6 bg-[#c44b2b]" /> Why VLTG
              </p>
              <h2 className={`${syne.className} text-[clamp(30px,4.6vw,52px)] font-extrabold tracking-[-0.03em]`}>
                Why Shop <span className={`${cormorant.className} font-light italic text-[#8a8279]`}>With Us</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: Gem,
                  title: "Premium Quality",
                  text: "Every piece is crafted with the finest materials and attention to detail.",
                },
                {
                  icon: Zap,
                  title: "Fast Delivery",
                  text: "Get your order delivered in 2-3 business days with free express shipping over \u20B975.",
                },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  text: "Enjoy hassle-free 30-day returns with prepaid shipping labels.",
                },
              ].map((item, idx) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group relative overflow-hidden rounded-[28px] border border-[#1a17140a] bg-white p-10 text-center transition hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(26,23,20,0.08)]"
                >
                  <span className="absolute left-1/2 top-0 h-0.5 w-14 -translate-x-1/2 rounded-b bg-[#c44b2b] opacity-0 transition group-hover:opacity-100" />
                  <div className="mx-auto mb-6 grid h-[72px] w-[72px] place-items-center rounded-[14px] bg-[#eae4d8] text-[28px] transition group-hover:rotate-[-5deg] group-hover:bg-[#c44b2b] group-hover:text-white">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className={`${syne.className} mb-2 text-lg font-bold`}>{item.title}</h4>
                  <p className="text-sm leading-relaxed text-[#8a8279]">{item.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-[#efe9df] px-5 pb-24 pt-20 md:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1a171414] to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="mx-auto max-w-[600px] text-center"
          >
            <p className="mb-3 flex items-center justify-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[#c44b2b]">
              <span className="h-[1.5px] w-6 bg-[#c44b2b]" /> Stay in the Loop
            </p>
            <h2 className={`${syne.className} mb-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.02em]`}>
              Join the <span className={`${cormorant.className} italic`}>VLTG</span> Family
            </h2>
            <p className="mb-9 text-sm text-[#8a8279]">
              Subscribe for early access to new drops, exclusive offers, and style inspiration.
            </p>

            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-[480px] flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-full border border-[#1a171414] bg-white px-5 text-[13px] outline-none transition placeholder:text-[#8a8279] focus:border-[#c44b2b] focus:shadow-[0_0_0_4px_rgba(196,75,43,0.08)]"
              />
              <button
                type="submit"
                className={`h-12 rounded-full px-8 text-xs uppercase tracking-[0.08em] text-white transition ${
                  subscribed ? "bg-[#a8c5a0]" : "bg-[#c44b2b] hover:-translate-y-0.5 hover:bg-[#1a1714]"
                }`}
              >
                {subscribed ? (
                  <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Subscribed</span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </motion.div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton bgColorClass="bg-[#c44b2b]" shadowClass="shadow-[0_10px_30px_rgba(196,75,43,0.35)]" />

      <style jsx global>{`
        .genz-vltg::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }

        .genz-marquee-track {
          animation: genz-marquee 30s linear infinite;
        }

        @keyframes genz-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .genz-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
