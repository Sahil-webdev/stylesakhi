"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Heart, ArrowRight, ArrowDown, Truck, RotateCcw, ShieldCheck, PhoneCall, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";
import { fetchHighestSellingProducts, fetchProducts, type ProductGeneration, type ProductRecord } from "@/lib/products-api";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Home() {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const [bestsellerProducts, setBestsellerProducts] = useState<ProductRecord[]>([]);
  const [isLoadingBestsellers, setIsLoadingBestsellers] = useState(true);
  const [millennialBestsellerProducts, setMillennialBestsellerProducts] = useState<ProductRecord[]>([]);
  const [isLoadingMillennialBestsellers, setIsLoadingMillennialBestsellers] = useState(true);
  const [genZBestsellerProducts, setGenZBestsellerProducts] = useState<ProductRecord[]>([]);
  const [isLoadingGenZBestsellers, setIsLoadingGenZBestsellers] = useState(true);
  const [genAlphaBestsellerProducts, setGenAlphaBestsellerProducts] = useState<ProductRecord[]>([]);
  const [isLoadingGenAlphaBestsellers, setIsLoadingGenAlphaBestsellers] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGenerationBestsellers = async (generation: ProductGeneration) => {
      const highestSelling = await fetchHighestSellingProducts(generation, 8);
      let mergedItems = [...highestSelling];

      if (mergedItems.length < 4) {
        const latestProducts = await fetchProducts({ limit: "12", generation });
        const extraItems = latestProducts.filter(
          (product) => !mergedItems.some((existing) => existing._id === product._id)
        );
        mergedItems = [...mergedItems, ...extraItems];
      }

      return mergedItems.slice(0, 4);
    };

    const loadBestsellers = async () => {
      const [genXResult, millennialResult, genZResult, genAlphaResult] = await Promise.allSettled([
        loadGenerationBestsellers("gen-x"),
        loadGenerationBestsellers("millennial"),
        loadGenerationBestsellers("gen-z"),
        loadGenerationBestsellers("gen-alpha"),
      ]);

      if (!isMounted) return;

      if (genXResult.status === "fulfilled") {
        setBestsellerProducts(genXResult.value);
      } else {
        setBestsellerProducts([]);
      }

      if (millennialResult.status === "fulfilled") {
        setMillennialBestsellerProducts(millennialResult.value);
      } else {
        setMillennialBestsellerProducts([]);
      }

      if (genZResult.status === "fulfilled") {
        setGenZBestsellerProducts(genZResult.value);
      } else {
        setGenZBestsellerProducts([]);
      }

      if (genAlphaResult.status === "fulfilled") {
        setGenAlphaBestsellerProducts(genAlphaResult.value);
      } else {
        setGenAlphaBestsellerProducts([]);
      }

      setIsLoadingBestsellers(false);
      setIsLoadingMillennialBestsellers(false);
      setIsLoadingGenZBestsellers(false);
      setIsLoadingGenAlphaBestsellers(false);
    };

    void loadBestsellers();

    return () => {
      isMounted = false;
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current);
      }
    };
  }, []);

  const bestsellerCards = useMemo(() => {
    return bestsellerProducts.map((product, index) => {
      const safePrice = Number(product.price || 0);
      return {
        id: product._id,
        name: product.name,
        category: (product.subCategory || product.category || "StyleSakhi").replace("-", " "),
        categoryLabel: (product.category || "style").replace("-", " ").toUpperCase(),
        image: product.images?.[0] || "/hero/hero.jpeg",
        video: product.video,
        href: `/product/${product.slug || product._id}`,
        rank: index + 1,
        price: safePrice,
        priceLabel: `₹${safePrice.toLocaleString("en-IN")}`,
      };
    });
  }, [bestsellerProducts]);

  const millennialBestsellerCards = useMemo(() => {
    return millennialBestsellerProducts.map((product, index) => {
      const safePrice = Number(product.price || 0);
      return {
        id: product._id,
        name: product.name,
        category: (product.subCategory || product.category || "StyleSakhi").replace("-", " "),
        categoryLabel: (product.category || "style").replace("-", " ").toUpperCase(),
        image: product.images?.[0] || "/hero/hero.jpeg",
        video: product.video,
        href: `/product/${product.slug || product._id}`,
        rank: index + 1,
        price: safePrice,
        priceLabel: `₹${safePrice.toLocaleString("en-IN")}`,
      };
    });
  }, [millennialBestsellerProducts]);

  const genZBestsellerCards = useMemo(() => {
    return genZBestsellerProducts.map((product, index) => {
      const safePrice = Number(product.price || 0);
      return {
        id: product._id,
        name: product.name,
        category: (product.subCategory || product.category || "StyleSakhi").replace("-", " "),
        categoryLabel: (product.category || "style").replace("-", " ").toUpperCase(),
        image: product.images?.[0] || "/hero/hero.jpeg",
        video: product.video,
        href: `/product/${product.slug || product._id}`,
        rank: index + 1,
        price: safePrice,
        priceLabel: `₹${safePrice.toLocaleString("en-IN")}`,
      };
    });
  }, [genZBestsellerProducts]);

  const genAlphaBestsellerCards = useMemo(() => {
    return genAlphaBestsellerProducts.map((product, index) => {
      const safePrice = Number(product.price || 0);
      return {
        id: product._id,
        name: product.name,
        category: (product.subCategory || product.category || "StyleSakhi").replace("-", " "),
        categoryLabel: (product.category || "style").replace("-", " ").toUpperCase(),
        image: product.images?.[0] || "/hero/hero.jpeg",
        video: product.video,
        href: `/product/${product.slug || product._id}`,
        rank: index + 1,
        price: safePrice,
        priceLabel: `₹${safePrice.toLocaleString("en-IN")}`,
      };
    });
  }, [genAlphaBestsellerProducts]);

  const handleQuickAdd = (product: ShopProduct) => {
    addToCart(product);
    setAddedProductId(product.id);

    if (addedTimeoutRef.current) {
      clearTimeout(addedTimeoutRef.current);
    }

    addedTimeoutRef.current = setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1400);
  };

  const customerReviews = [
    {
      name: "Rahul Verma",
      city: "Delhi",
      review:
        "Minimalist yet bold. The fit of the linen kurta is exactly what I was looking for. Perfect for summers.",
      product: "Linen Kurta",
      tone: "from-[#fed7aa] to-[#fb923c]",
    },
    {
      name: "Priya Das",
      city: "Bengaluru",
      review:
        "Exceptional craftsmanship. The delivery was fast and the packaging felt truly luxury. Highly recommended.",
      product: "Chiffon Wrap",
      tone: "from-[#bfdbfe] to-[#60a5fa]",
    },
    {
      name: "Vikram Malhotra",
      city: "Chandigarh",
      review:
        "A masterpiece of calculated restraint. The silhouette is contemporary yet deep-rooted in classic tailoring.",
      product: "Archival Blazer",
      tone: "from-[#ddd6fe] to-[#8b5cf6]",
    },
    {
      name: "Ananya Sharma",
      city: "Mumbai",
      review:
        "The quality of the silk is unparalleled. It feels like wearing high-art. Definitely worth the investment.",
      product: "Silk Saree Set",
      tone: "from-[#fecdd3] to-[#fb7185]",
    },
    {
      name: "Ishita Roy",
      city: "Pune",
      review:
        "I loved how versatile the look is. I wore it for brunch and then an evening event without changing much.",
      product: "Soft Utility Co-ord",
      tone: "from-[#bbf7d0] to-[#22c55e]",
    },
  ];

  return (
    <div className={`${inter.className} bg-[#F8FAFC] text-[#111827]`}>
      <Navbar />

      {/* Section 1 - Hero */}
      <section className="relative w-full pt-16">
        <div
          className="relative w-full overflow-hidden bg-[#0b0b0f] aspect-[16/10] sm:aspect-[16/8] md:aspect-[1232/420] lg:aspect-auto lg:h-[calc(100vh-64px)]"
          style={{ "--hero-design-w": 1920, "--hero-design-h": 1000 } as CSSProperties}
        >
          <motion.div
            initial={{ scale: 1.015, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-full w-full"
          >
            <Image
              src="/hero/hero3.jpeg"
              alt="Style Sakhi hero"
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>

        </div>
      </section>

      {/* Hero Marquee */}
      <section className="mt-3">
        <div className="relative overflow-hidden bg-black py-4 shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent" />
          <div className="marquee-track flex w-max items-center gap-8 px-8">
            <span className="marquee-text text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90">
              Timeless Style • Modern Elegance • Everyday Luxury • Effortless Fashion • Confident Women • Classic Wardrobe • Minimal Aesthetic • Elegant Comfort • Style Beyond Trends •
            </span>
            <span className="marquee-text text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90">
              Timeless Style • Modern Elegance • Everyday Luxury • Effortless Fashion • Confident Women • Classic Wardrobe • Minimal Aesthetic • Elegant Comfort • Style Beyond Trends •
            </span>
          </div>
        </div>
      </section>

      {/* Find Your Era - Featured Collections */}
      <section className="relative overflow-hidden bg-[#f4f5f7] px-5 pb-20 pt-16 sm:px-8 md:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#e9defa]/45 blur-2xl" />
          <div className="absolute right-0 top-1/3 h-52 w-52 rounded-full bg-[#fbdde3]/45 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-[1320px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mb-12 md:mb-14"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7b6dc5]">Core Curations</p>
            <h2 className={`${playfair.className} mt-2 text-5xl font-semibold leading-[0.92] text-[#101423] sm:text-6xl`}>
              Featured
              <span className="block text-[#b4b9c4] italic font-normal">Collections</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              { name: "Gen X", href: "/gen-x", image: "/era/gen x.jpeg" },
              { name: "Millennial", href: "/millennial", image: "/era/millennial.png" },
              { name: "Gen Z", href: "/gen-z", image: "/era/gen z.jpeg" },
              { name: "Gen Alpha", href: "/gen-alpha", image: "/era/gen alpha.png" },
            ].map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={card.href}
                  className="group relative block rounded-[34px] border border-[#d7d9df] bg-white p-3 shadow-[0_16px_30px_rgba(16,20,35,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(16,20,35,0.14)]"
                >
                  <div className="relative overflow-hidden rounded-[120px_120px_28px_28px] border border-[#e8d6ad] bg-[#f5f1ea]">
                    <div className="relative h-[360px] w-full">
                      <Image
                        src={card.image}
                        alt={`${card.name} featured collection`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/62 via-black/20 to-transparent" />
                  </div>

                  <div className="pointer-events-none absolute inset-x-8 bottom-6 flex items-end justify-between">
                    <div>
                      <p className={`${playfair.className} text-3xl font-semibold italic tracking-tight text-white drop-shadow-lg`}>
                        {card.name}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/80">
                        Explore Archive
                      </p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/18 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="bg-[#f8fafc] px-4 pb-8 pt-2 sm:px-6">
        <div className="mx-auto max-w-[1265px] overflow-hidden rounded-[18px] border border-[#e4def5] bg-white shadow-[0_8px_20px_rgba(17,24,39,0.05)]">
          <div className="grid grid-cols-2 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, text: "Free Shipping 999+" },
              { icon: RotateCcw, text: "7-Day Easy Returns" },
              { icon: ShieldCheck, text: "100% Authentic" },
              { icon: PhoneCall, text: "24/7 Support" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center justify-center gap-2.5 border-b border-[#ece8f8] px-4 py-4 text-center last:border-b-0 sm:last:border-b sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <item.icon className="h-[15px] w-[15px] text-[#7a54d8]" strokeWidth={2.2} />
                <span className="text-[13px] font-semibold text-[#7a54d8]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gen X Spotlight */}
      <section className="bg-[#f8fafc] px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-[1265px] overflow-hidden rounded-[28px] border border-[#e3e6eb] bg-white shadow-[0_14px_28px_rgba(17,24,39,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative min-h-[320px] overflow-hidden"
            >
              <Image
                src="/hero/gen x.jpeg"
                alt="Gen X style spotlight"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col justify-center bg-[#E3DED4] px-6 py-10 sm:px-10"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f5ad7]">Generation Spotlight</p>
              <h3 className={`${playfair.className} mt-3 text-4xl font-semibold leading-[0.95] text-[#111827] sm:text-5xl`}>
                Gen X
                <span className="block text-[#5d6877] italic font-normal">Built On Timeless Confidence</span>
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#4f5967] sm:text-base">
                Gen X fashion balances strong structure with effortless practicality. These wardrobes favor quality,
                wearable silhouettes, and statement details that never feel loud, just iconic.
              </p>

              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#d8ddf2] bg-[#f7f5ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5ad7]">
                <span>Highest Selling Products</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#6f5ad7] text-white"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Most Loved Bestsellers */}
      <section className="bg-[#f8fafc] px-4 pb-14 pt-2 sm:px-6">
        <div className="mx-auto max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a54d8]">Most Loved</p>
              <h2 className={`${playfair.className} mt-1.5 text-3xl font-semibold leading-[0.94] text-[#0f172a] sm:text-4xl`}>
                Bestsellers
              </h2>
            </div>
            <Link
              href="/gen-x"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a54d8] transition hover:gap-2.5 hover:text-[#5d3fc0]"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingBestsellers &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`bestseller-skeleton-${index}`}
                  className="overflow-hidden rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="h-[288px] animate-pulse rounded-[14px] bg-[#ece8e1]" />
                  <div className="mt-4 h-3 w-20 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#ece8e1]" />
                </div>
              ))}

            {!isLoadingBestsellers &&
              bestsellerCards.map((item, index) => {
                const quickProduct: ShopProduct = {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  video: item.video,
                  category: item.category,
                  href: item.href,
                };

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    className="group rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative aspect-[4/4.55] overflow-hidden rounded-[14px] bg-[#ead6c3]">
                      <Link href={item.href} className="block h-full">
                        {item.video ? (
                          <video
                            autoPlay
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={item.video}
                          />
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                      </Link>

                      <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#f59e0b] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                          Bestseller
                        </span>
                        <span className="rounded-full bg-[#111827] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          #{item.rank}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleWishlist(quickProduct);
                        }}
                        aria-label={isWishlisted(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-[#ffffff]/70 bg-white/85 text-[#1f2937] backdrop-blur transition hover:scale-105"
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          strokeWidth={2}
                          fill={isWishlisted(item.id) ? "#B91C1C" : "none"}
                          color={isWishlisted(item.id) ? "#B91C1C" : "currentColor"}
                        />
                      </button>

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-5 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className={`pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            addedProductId === item.id
                              ? "bg-[#7a54d8] text-white"
                              : "bg-white text-[#111827] hover:bg-[#f3f4f6]"
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleQuickAdd(quickProduct);
                          }}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {addedProductId === item.id ? "Added to Cart" : "Quick Add"}
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
                        {item.categoryLabel}
                      </p>
                      <Link href={item.href} className="mt-1 block min-h-[40px] overflow-hidden text-[15px] font-semibold leading-snug text-[#0f172a] transition hover:text-[#7a54d8]">
                        {item.name}
                      </Link>
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-[#111827]">{item.priceLabel}</p>
                        <Link
                          href={item.href}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[#dbd8d1] text-[#7a54d8] transition hover:border-[#7a54d8] hover:bg-[#f4efff]"
                          aria-label={`View ${item.name}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </div>

          {!isLoadingBestsellers && bestsellerCards.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#e4e7ee] bg-white p-6 text-center text-sm text-[#5f6670]">
              Bestseller products abhi available nahi hain. Admin panel se products ko highest-selling mark karke yahan show karein.
            </div>
          ) : null}
        </div>
      </section>

      {/* Millennial Spotlight */}
      <section className="bg-[#f8fafc] px-4 pb-16 pt-0 sm:px-6">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[28px] border border-[#e6d8db] bg-gradient-to-br from-[#f7edef] via-[#f5ecf2] to-[#efeaff] shadow-[0_18px_36px_rgba(26,32,44,0.10)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-14 h-64 w-64 rounded-full bg-[#e9bfd2]/30 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#c5d1ff]/35 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-10">
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative rounded-[24px] border border-white/70 bg-white/55 px-6 py-7 backdrop-blur-sm sm:px-8"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <p className="inline-flex rounded-full border border-[#d1ccf8] bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6f5ad7]">
                  Generation Spotlight
                </p>
                <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Work-to-Weekend
                </span>
              </div>
              <h3 className={`${playfair.className} mt-3 text-4xl font-semibold leading-[0.95] text-[#111827] sm:text-5xl`}>
                Millennials
                <span className="block bg-gradient-to-r from-[#5d6877] via-[#6c6f92] to-[#7a64b9] bg-clip-text italic font-normal text-transparent">
                  Defined By Smart, Effortless Style
                </span>
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#4f5967] sm:text-base">
                Millennial wardrobes lean into clean lines, versatile layers, and polished comfort. The style language
                is modern, practical, and always ready for workdays, weekends, and everything in between.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Polished Core", "Soft Tailoring", "City Comfort", "Refined Casual"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d8d2f8] bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6b62bf]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#d8ddf2] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5ad7] shadow-[0_8px_16px_rgba(111,90,215,0.14)]">
                <span>Highest Selling Products</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#6f5ad7] text-white"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-br from-[#f2bfd5]/35 to-[#b8c8ff]/35 blur-xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-2 shadow-[0_20px_44px_rgba(25,35,60,0.18)]">
                <div className="relative min-h-[320px] overflow-hidden rounded-[18px] sm:min-h-[430px]">
                  <Image
                    src="/hero/millennial2.jpeg"
                    alt="Millennial style spotlight"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/8 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-2xl border border-white/40 bg-black/25 px-3 py-2 backdrop-blur">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">Signature Mood</p>
                    <p className="mt-1 text-sm font-medium text-white">Modern, Clean, Confident</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Millennial Bestsellers */}
      <section className="bg-[#f8fafc] px-4 pb-14 pt-2 sm:px-6">
        <div className="mx-auto max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a54d8]">Most Loved</p>
              <h2 className={`${playfair.className} mt-1.5 text-3xl font-semibold leading-[0.94] text-[#0f172a] sm:text-4xl`}>
                Bestsellers
              </h2>
            </div>
            <Link
              href="/millennial"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a54d8] transition hover:gap-2.5 hover:text-[#5d3fc0]"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingMillennialBestsellers &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`millennial-bestseller-skeleton-${index}`}
                  className="overflow-hidden rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="h-[288px] animate-pulse rounded-[14px] bg-[#ece8e1]" />
                  <div className="mt-4 h-3 w-20 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#ece8e1]" />
                </div>
              ))}

            {!isLoadingMillennialBestsellers &&
              millennialBestsellerCards.map((item, index) => {
                const quickProduct: ShopProduct = {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  video: item.video,
                  category: item.category,
                  href: item.href,
                };

                return (
                  <motion.article
                    key={`millennial-${item.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    className="group rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative aspect-[4/4.55] overflow-hidden rounded-[14px] bg-[#ead6c3]">
                      <Link href={item.href} className="block h-full">
                        {item.video ? (
                          <video
                            autoPlay
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={item.video}
                          />
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                      </Link>

                      <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#f59e0b] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                          Bestseller
                        </span>
                        <span className="rounded-full bg-[#111827] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          #{item.rank}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleWishlist(quickProduct);
                        }}
                        aria-label={isWishlisted(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-[#ffffff]/70 bg-white/85 text-[#1f2937] backdrop-blur transition hover:scale-105"
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          strokeWidth={2}
                          fill={isWishlisted(item.id) ? "#B91C1C" : "none"}
                          color={isWishlisted(item.id) ? "#B91C1C" : "currentColor"}
                        />
                      </button>

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-5 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className={`pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            addedProductId === item.id
                              ? "bg-[#7a54d8] text-white"
                              : "bg-white text-[#111827] hover:bg-[#f3f4f6]"
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleQuickAdd(quickProduct);
                          }}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {addedProductId === item.id ? "Added to Cart" : "Quick Add"}
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
                        {item.categoryLabel}
                      </p>
                      <Link href={item.href} className="mt-1 block min-h-[40px] overflow-hidden text-[15px] font-semibold leading-snug text-[#0f172a] transition hover:text-[#7a54d8]">
                        {item.name}
                      </Link>
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-[#111827]">{item.priceLabel}</p>
                        <Link
                          href={item.href}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[#dbd8d1] text-[#7a54d8] transition hover:border-[#7a54d8] hover:bg-[#f4efff]"
                          aria-label={`View ${item.name}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </div>

          {!isLoadingMillennialBestsellers && millennialBestsellerCards.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#e4e7ee] bg-white p-6 text-center text-sm text-[#5f6670]">
              Millennial bestseller products abhi available nahi hain. Admin panel se products ko highest-selling mark karke yahan show karein.
            </div>
          ) : null}
        </div>
      </section>

      {/* Gen Z Spotlight - Editorial Style */}
      <section className="bg-[#f8fafc] px-4 pb-16 pt-2 sm:px-6">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[28px] border border-[#d7e6e6] bg-gradient-to-br from-[#f6fbfc] via-[#eef6f6] to-[#f3efff] shadow-[0_18px_36px_rgba(15,23,42,0.10)]">
          <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#8de3de]/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#bca6ff]/25 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              <p className="inline-flex rounded-full border border-[#cfdaf9] bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6256d8] backdrop-blur">
                Generation Spotlight
              </p>
              <h3 className={`${playfair.className} mt-4 text-4xl font-semibold leading-[0.92] text-[#0f172a] sm:text-5xl`}>
                Gen Z
                <span className="mt-1 block bg-gradient-to-r from-[#0f172a] via-[#3b4f77] to-[#667995] bg-clip-text text-transparent">
                  Future-Ready, Culture-Driven
                </span>
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#425466] sm:text-base">
                Gen Z style is expressive, adaptive, and unapologetically personal. From relaxed tailoring to bold
                street details, every outfit is built to stand out while staying effortless through the day.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Street Luxe", "Smart Layers", "Trend-First", "Daily Flex"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#d5def8] bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4f5db8]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#d7ddf6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6256d8] shadow-[0_8px_16px_rgba(98,86,216,0.12)]">
                <span>Highest Selling Products</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#6256d8] text-white"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -inset-3 rounded-[26px] bg-gradient-to-br from-[#84dbd4]/35 to-[#afa2ff]/35 blur-xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.14)]">
                <div className="relative h-[380px] overflow-hidden rounded-[18px] sm:h-[430px]">
                  <Image
                    src="/hero/gen z.jpeg"
                    alt="Gen Z style spotlight"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gen Z Bestsellers */}
      <section className="bg-[#f8fafc] px-4 pb-14 pt-2 sm:px-6">
        <div className="mx-auto max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a54d8]">Most Loved</p>
              <h2 className={`${playfair.className} mt-1.5 text-3xl font-semibold leading-[0.94] text-[#0f172a] sm:text-4xl`}>
                Bestsellers
              </h2>
            </div>
            <Link
              href="/gen-z"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a54d8] transition hover:gap-2.5 hover:text-[#5d3fc0]"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingGenZBestsellers &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`genz-bestseller-skeleton-${index}`}
                  className="overflow-hidden rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="h-[288px] animate-pulse rounded-[14px] bg-[#ece8e1]" />
                  <div className="mt-4 h-3 w-20 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#ece8e1]" />
                </div>
              ))}

            {!isLoadingGenZBestsellers &&
              genZBestsellerCards.map((item, index) => {
                const quickProduct: ShopProduct = {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  video: item.video,
                  category: item.category,
                  href: item.href,
                };

                return (
                  <motion.article
                    key={`genz-${item.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    className="group rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative aspect-[4/4.55] overflow-hidden rounded-[14px] bg-[#ead6c3]">
                      <Link href={item.href} className="block h-full">
                        {item.video ? (
                          <video
                            autoPlay
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={item.video}
                          />
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                      </Link>

                      <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#f59e0b] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                          Bestseller
                        </span>
                        <span className="rounded-full bg-[#111827] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          #{item.rank}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleWishlist(quickProduct);
                        }}
                        aria-label={isWishlisted(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-[#ffffff]/70 bg-white/85 text-[#1f2937] backdrop-blur transition hover:scale-105"
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          strokeWidth={2}
                          fill={isWishlisted(item.id) ? "#B91C1C" : "none"}
                          color={isWishlisted(item.id) ? "#B91C1C" : "currentColor"}
                        />
                      </button>

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-5 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className={`pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            addedProductId === item.id
                              ? "bg-[#7a54d8] text-white"
                              : "bg-white text-[#111827] hover:bg-[#f3f4f6]"
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleQuickAdd(quickProduct);
                          }}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {addedProductId === item.id ? "Added to Cart" : "Quick Add"}
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
                        {item.categoryLabel}
                      </p>
                      <Link href={item.href} className="mt-1 block min-h-[40px] overflow-hidden text-[15px] font-semibold leading-snug text-[#0f172a] transition hover:text-[#7a54d8]">
                        {item.name}
                      </Link>
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-[#111827]">{item.priceLabel}</p>
                        <Link
                          href={item.href}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[#dbd8d1] text-[#7a54d8] transition hover:border-[#7a54d8] hover:bg-[#f4efff]"
                          aria-label={`View ${item.name}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </div>

          {!isLoadingGenZBestsellers && genZBestsellerCards.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#e4e7ee] bg-white p-6 text-center text-sm text-[#5f6670]">
              Gen Z bestseller products abhi available nahi hain. Admin panel se products ko highest-selling mark karke yahan show karein.
            </div>
          ) : null}
        </div>
      </section>

      {/* Gen Alpha Spotlight - Futuristic Card Stack */}
      <section className="bg-[#f8fafc] px-4 pb-16 pt-2 sm:px-6">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[30px] border border-[#dddff8] bg-[#f4f6ff] shadow-[0_18px_40px_rgba(76,83,176,0.15)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#c4b5fd]/35 blur-3xl" />
            <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#93c5fd]/30 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:px-10 lg:py-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <p className="inline-flex rounded-full border border-[#c9d1ff] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5b5cd6]">
                Generation Spotlight
              </p>
              <h3 className={`${playfair.className} mt-4 text-4xl font-semibold leading-[0.92] text-[#141a40] sm:text-5xl`}>
                Gen Alpha
                <span className="mt-1 block text-[#4e5c8f]">Born For Motion & Digital Style</span>
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#33406b] sm:text-base">
                Gen Alpha fashion is playful, expressive, and always camera-ready. Soft utility shapes, energetic
                colors, and comfort-first fits make every look feel new, fun, and future-ready.
              </p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
                {["Play Mode", "Cloud Fits", "Ultra Comfy", "Future Pop"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-xl border border-[#cad3ff] bg-white/85 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5663ba]"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#cfd4ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5a5cd4] shadow-[0_8px_18px_rgba(90,92,212,0.16)]">
                <span>Highest Selling Products</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#5a5cd4] text-white"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="absolute -inset-2 rotate-[-2deg] rounded-[28px] bg-[#bcc9ff]/50" />
                <div className="absolute -inset-2 rotate-[2deg] rounded-[28px] bg-[#9edfff]/40" />
                <div className="relative overflow-hidden rounded-[24px] border border-white/75 bg-white p-2 shadow-[0_22px_44px_rgba(31,41,105,0.22)]">
                  <div className="relative h-[380px] overflow-hidden rounded-[18px] sm:h-[430px]">
                    <Image
                      src="/hero/gen alpha.jpeg"
                      alt="Gen Alpha style spotlight"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/26 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gen Alpha Bestsellers */}
      <section className="bg-[#f8fafc] px-4 pb-14 pt-2 sm:px-6">
        <div className="mx-auto max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a54d8]">Most Loved</p>
              <h2 className={`${playfair.className} mt-1.5 text-3xl font-semibold leading-[0.94] text-[#0f172a] sm:text-4xl`}>
                Bestsellers
              </h2>
            </div>
            <Link
              href="/gen-alpha"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a54d8] transition hover:gap-2.5 hover:text-[#5d3fc0]"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingGenAlphaBestsellers &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`genalpha-bestseller-skeleton-${index}`}
                  className="overflow-hidden rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="h-[288px] animate-pulse rounded-[14px] bg-[#ece8e1]" />
                  <div className="mt-4 h-3 w-20 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#ece8e1]" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#ece8e1]" />
                </div>
              ))}

            {!isLoadingGenAlphaBestsellers &&
              genAlphaBestsellerCards.map((item, index) => {
                const quickProduct: ShopProduct = {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  video: item.video,
                  category: item.category,
                  href: item.href,
                };

                return (
                  <motion.article
                    key={`genalpha-${item.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    className="group rounded-[18px] border border-[#e6e2d8] bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative aspect-[4/4.55] overflow-hidden rounded-[14px] bg-[#ead6c3]">
                      <Link href={item.href} className="block h-full">
                        {item.video ? (
                          <video
                            autoPlay
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={item.video}
                          />
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                      </Link>

                      <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#f59e0b] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                          Bestseller
                        </span>
                        <span className="rounded-full bg-[#111827] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          #{item.rank}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleWishlist(quickProduct);
                        }}
                        aria-label={isWishlisted(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-[#ffffff]/70 bg-white/85 text-[#1f2937] backdrop-blur transition hover:scale-105"
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          strokeWidth={2}
                          fill={isWishlisted(item.id) ? "#B91C1C" : "none"}
                          color={isWishlisted(item.id) ? "#B91C1C" : "currentColor"}
                        />
                      </button>

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-5 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className={`pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            addedProductId === item.id
                              ? "bg-[#7a54d8] text-white"
                              : "bg-white text-[#111827] hover:bg-[#f3f4f6]"
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleQuickAdd(quickProduct);
                          }}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {addedProductId === item.id ? "Added to Cart" : "Quick Add"}
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
                        {item.categoryLabel}
                      </p>
                      <Link href={item.href} className="mt-1 block min-h-[40px] overflow-hidden text-[15px] font-semibold leading-snug text-[#0f172a] transition hover:text-[#7a54d8]">
                        {item.name}
                      </Link>
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-[#111827]">{item.priceLabel}</p>
                        <Link
                          href={item.href}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[#dbd8d1] text-[#7a54d8] transition hover:border-[#7a54d8] hover:bg-[#f4efff]"
                          aria-label={`View ${item.name}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </div>

          {!isLoadingGenAlphaBestsellers && genAlphaBestsellerCards.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#e4e7ee] bg-white p-6 text-center text-sm text-[#5f6670]">
              Gen Alpha bestseller products abhi available nahi hain. Admin panel se products ko highest-selling mark karke yahan show karein.
            </div>
          ) : null}
        </div>
      </section>

      {/* Customer Reviews Marquee */}
      <section className="bg-[#f8fafc] px-0 pb-16 pt-2">
        <div className="w-full overflow-hidden border-y border-[#e5e7f3] bg-white px-5 py-10 shadow-[0_12px_30px_rgba(15,23,42,0.07)] sm:px-7">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f5ad7]">Community Love</p>
            <h3 className={`${playfair.className} mt-2 text-4xl font-semibold text-[#101423] sm:text-5xl`}>
              What Our Customers Say
            </h3>
            <div className="mt-3 flex items-center justify-center gap-1 text-[#f4b400]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={`rating-star-${idx}`} className="h-4 w-4 fill-[#f4b400]" />
              ))}
              <span className="ml-2 text-sm font-medium text-[#60657a]">4.9 out of 5 - 2,400+ reviews</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="reviews-row overflow-hidden">
              <div className="reviews-track reviews-track-forward flex w-max gap-4">
                {[...customerReviews, ...customerReviews].map((review, index) => (
                  <article
                    key={`review-forward-${review.name}-${index}`}
                    className="w-[280px] rounded-2xl border border-[#eceef8] bg-[#fcfcff] p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${review.tone} text-sm font-semibold text-white`}>
                        {review.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#121722]">{review.name}</p>
                        <p className="text-xs text-[#8b90a3]">{review.city}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[#f4b400]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={`review-star-forward-${index}-${idx}`} className="h-3.5 w-3.5 fill-[#f4b400]" />
                      ))}
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4a5568]">{review.review}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6f5ad7]">{review.product}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="reviews-row overflow-hidden">
              <div className="reviews-track reviews-track-reverse flex w-max gap-4">
                {[...customerReviews, ...customerReviews].map((review, index) => (
                  <article
                    key={`review-reverse-${review.name}-${index}`}
                    className="w-[280px] rounded-2xl border border-[#eceef8] bg-[#fcfcff] p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${review.tone} text-sm font-semibold text-white`}>
                        {review.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#121722]">{review.name}</p>
                        <p className="text-xs text-[#8b90a3]">{review.city}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[#f4b400]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={`review-star-reverse-${index}-${idx}`} className="h-3.5 w-3.5 fill-[#f4b400]" />
                      ))}
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4a5568]">{review.review}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6f5ad7]">{review.product}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .marquee-track {
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          animation: marquee-scroll 36s linear infinite;
        }
        .reviews-track {
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        .reviews-track-forward {
          animation: reviews-forward 38s linear infinite;
        }
        .reviews-track-reverse {
          animation: reviews-reverse 38s linear infinite;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes reviews-forward {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes reviews-reverse {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: none !important;
          }
          .reviews-track-forward,
          .reviews-track-reverse {
            animation: none;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
