"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Eye,
  Plus,
  Star,
  Gem,
  Truck,
  RotateCcw,
  Circle,
} from "lucide-react";
import { Syne, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";
import BannerCarousel from "@/components/BannerCarousel";
import { defaultGenerationBanners, fetchBannerConfig, type BannerItem } from "@/lib/banner-config";
import { fetchProducts, type ProductRecord } from "@/lib/products-api";
import { buildCategoryDetailHref } from "@/lib/product-link";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const fallbackBanners = defaultGenerationBanners["gen-alpha"];

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  video?: string;
  badge?: string;
  rating: number;
  reviews: number;
  href: string;
};

const marqueeItems = [
  "Summer Sale - Up to 50% Off",
  "New Sneaker Drops Every Friday",
  "Free Shipping on Orders 75+",
  "Premium Quality Guaranteed",
  "Join StyleSakhi Club for Exclusive Access",
];

function productToShopItem(product: CatalogProduct): ShopProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    href: product.href,
  };
}

function mapProductRecordToCatalogProduct(product: ProductRecord): CatalogProduct {
  const currentPrice =
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const oldPrice =
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.price
      : undefined;

  const categoryLabel = (product.subCategory || product.category || "StyleSakhi")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    id: product._id,
    name: product.name,
    category: categoryLabel,
    price: currentPrice,
    oldPrice,
    image: product.images?.[0] || "/hero/hero.jpeg",
    video: product.video,
    badge: product.featured ? "Featured" : product.isHighestSelling ? "Best Seller" : undefined,
    rating: Number(product.averageRating || 0),
    reviews: Number(product.numReviews || 0),
    href: buildCategoryDetailHref(product.category, product.slug || product._id),
  };
}

function ProductCard({
  product,
  dark,
  onAddToCart,
  onToggleWishlist,
  wished,
}: {
  product: CatalogProduct;
  dark?: boolean;
  onAddToCart: (product: CatalogProduct) => void;
  onToggleWishlist: (product: CatalogProduct) => void;
  wished: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={`group overflow-hidden rounded-[20px] border ${
        dark
          ? "border-white/10 bg-[#151515] shadow-[0_20px_60px_rgba(0,0,0,0.38)]"
          : "border-[#d7e5f7] bg-white shadow-[0_10px_30px_rgba(20,71,142,0.10)]"
      } transition-transform duration-300 hover:-translate-y-1.5`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e8f1ff]">
        {product.badge ? (
          <span className="alpha-display absolute left-3 top-3 z-10 rounded-full bg-[#0055ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            {product.badge}
          </span>
        ) : null}

        <div className="absolute right-3 top-3 z-10 flex translate-x-2 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleWishlist(product);
            }}
            aria-label="Add to wishlist"
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0a0a0a] shadow"
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-[#e11d48] text-[#e11d48]" : ""}`} />
          </button>

          <Link
            href={product.href}
            onClick={(event) => event.stopPropagation()}
            aria-label="Quick view"
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0a0a0a] shadow"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        <Link href={product.href}>
          {product.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              src={product.video}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              width={420}
              height={540}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToCart(product);
            }}
            className={`alpha-display pointer-events-auto w-full rounded-[10px] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
              dark ? "bg-[#1f1f1f] text-[#f5f0e8] hover:bg-[#0055ff]" : "bg-[#0a0a0a] text-[#f5f0e8] hover:bg-[#0055ff]"
            } transition-colors`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="space-y-1 px-4 py-4">
        <p className={`alpha-display text-[11px] font-semibold uppercase tracking-[0.1em] ${dark ? "text-[#8f8f8f]" : "text-[#5a6f8d]"}`}>
          {product.category}
        </p>
        <Link
          href={product.href}
          className={`alpha-display block font-semibold leading-tight ${dark ? "text-[#f5f0e8]" : "text-[#0a0a0a]"}`}
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 pt-1">
          {Array.from({ length: 5 }).map((_, idx) => {
            const filled = idx < Math.floor(product.rating);
            return <Star key={`${product.id}-star-${idx}`} className={`h-3.5 w-3.5 ${filled ? "fill-[#fbbf24] text-[#fbbf24]" : "text-[#d1d5db]"}`} />;
          })}
          <span className={`ml-1 text-xs ${dark ? "text-[#9b9b9b]" : "text-[#6a7f9d]"}`}>({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <p className={`alpha-display font-bold ${dark ? "text-[#f5f0e8]" : "text-[#0a0a0a]"}`}>Rs. {product.price}</p>
            {product.oldPrice ? <p className={`text-sm line-through ${dark ? "text-[#7a7a7a]" : "text-[#9b9487]"}`}>Rs. {product.oldPrice}</p> : null}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToCart(product);
            }}
            className={`grid h-9 w-9 place-items-center rounded-full ${
              dark ? "bg-[#222] text-[#f5f0e8] hover:bg-[#0055ff]" : "bg-[#e9f2ff] text-[#0a0a0a] hover:bg-[#0055ff] hover:text-white"
            } transition-colors`}
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function GenAlphaPage() {
  const [banners, setBanners] = useState<BannerItem[]>(() => fallbackBanners);
  const [clothingProducts, setClothingProducts] = useState<CatalogProduct[]>([]);
  const [accessoryProducts, setAccessoryProducts] = useState<CatalogProduct[]>([]);
  const [sneakerProducts, setSneakerProducts] = useState<CatalogProduct[]>([]);
  const [sectionLimit, setSectionLimit] = useState(4);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  useEffect(() => {
    let active = true;
    const loadBanners = async () => {
      try {
        const config = await fetchBannerConfig();
        if (active) setBanners(config.generationBanners["gen-alpha"]);
      } catch {
        // Keep fallback data
      }
    };

    void loadBanners();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const updateSectionLimit = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setSectionLimit(8);
        return;
      }
      if (width >= 1024) {
        setSectionLimit(6);
        return;
      }
      setSectionLimit(4);
    };

    updateSectionLimit();
    window.addEventListener("resize", updateSectionLimit);
    return () => window.removeEventListener("resize", updateSectionLimit);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        const [clothing, accessories, sneakers] = await Promise.all([
          fetchProducts({
            generation: "gen-alpha",
            category: "clothing",
            isActive: "true",
            limit: "24",
          }),
          fetchProducts({
            generation: "gen-alpha",
            category: "accessories",
            isActive: "true",
            limit: "24",
          }),
          fetchProducts({
            generation: "gen-alpha",
            category: "sneakers",
            isActive: "true",
            limit: "24",
          }),
        ]);

        if (!active) return;

        setClothingProducts(clothing.map(mapProductRecordToCatalogProduct));
        setAccessoryProducts(accessories.map(mapProductRecordToCatalogProduct));
        setSneakerProducts(sneakers.map(mapProductRecordToCatalogProduct));
      } catch {
        if (!active) return;
        setClothingProducts([]);
        setAccessoryProducts([]);
        setSneakerProducts([]);
      }
    };

    void loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  const visibleClothingProducts = clothingProducts.slice(0, sectionLimit);
  const visibleAccessoryProducts = accessoryProducts.slice(0, 8);
  const visibleSneakerProducts = sneakerProducts.slice(0, sectionLimit);

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
    window.setTimeout(() => setSubscribed(false), 2500);
  };

  return (
    <div className={`${dmSans.className} bg-gradient-to-b from-[#eef5ff] via-[#f4f9ff] to-[#edf4ff] text-[#0a0a0a]`}>
      <Navbar />

      <main className="gen-alpha-vstr min-h-screen overflow-x-hidden">
        <section className="bg-gradient-to-b from-[#eef5ff] to-[#e9f2ff] pt-16">
          <BannerCarousel banners={banners} autoPlayInterval={4000} />
        </section>

        {/*
          Legacy Gen Alpha content below hero is intentionally commented as requested.
          Previous block started from:
          {(Object.keys(products) as SectionKey[]).map((key) => { ... })}
          and ended before </main>.
        */}

        <section className="overflow-hidden bg-[#0055ff] py-3.5">
          <div className="marquee-track flex w-max items-center">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={`marquee-${item}-${index}`}
                className="alpha-display flex items-center gap-3 whitespace-nowrap px-8 text-[12px] font-bold uppercase tracking-[0.08em] text-white"
              >
                <Circle className="h-2.5 w-2.5 fill-white/50 text-white/60" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="clothing" className="bg-gradient-to-b from-[#edf5ff] to-[#e7f1ff] py-20">
          <div className="mx-auto max-w-[1360px] px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="alpha-display mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0055ff]">
                  <span className="h-[2px] w-6 bg-[#0055ff]" /> 01 - Apparel
                </p>
                <h2 className="alpha-display text-4xl font-extrabold tracking-tight">Clothing Collection</h2>
              </div>
              <Link
                href="/clothing?generation=gen-alpha"
                className="alpha-display inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-7 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f5f0e8] transition hover:bg-[#0055ff]"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {visibleClothingProducts.map((product) => {
                const wished = isWishlisted(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wished={wished}
                    onToggleWishlist={(item) => toggleWishlist(productToShopItem(item))}
                    onAddToCart={(item) => addToCart(productToShopItem(item))}
                  />
                );
              })}
              {visibleClothingProducts.length === 0 ? (
                <div className="col-span-full rounded-[20px] border border-dashed border-[#cfe1f5] bg-white/70 px-6 py-12 text-center text-sm text-[#6a7f9d] shadow-[0_10px_30px_rgba(20,71,142,0.06)]">
                  No clothing products available yet for Gen Alpha.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="accessories" className="border-y border-[#d6e4f7] bg-gradient-to-b from-[#f8fbff] to-[#edf5ff] py-20">
          <div className="mx-auto max-w-[1360px] px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="alpha-display mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0055ff]">
                  <span className="h-[2px] w-6 bg-[#0055ff]" /> 02 - Details Matter
                </p>
                <h2 className="alpha-display text-4xl font-extrabold tracking-tight">Accessories</h2>
              </div>
              <Link
                href="/accessories?generation=gen-alpha"
                className="alpha-display inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-7 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f5f0e8] transition hover:bg-[#0055ff]"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleAccessoryProducts.map((product) => {
                const wished = isWishlisted(product.id);
                return (
                  <div key={product.id} className="min-w-[260px] max-w-[260px]">
                    <ProductCard
                      product={product}
                      wished={wished}
                      onToggleWishlist={(item) => toggleWishlist(productToShopItem(item))}
                      onAddToCart={(item) => addToCart(productToShopItem(item))}
                    />
                  </div>
                );
              })}
              {visibleAccessoryProducts.length === 0 ? (
                <div className="flex min-h-[180px] w-full min-w-full items-center justify-center rounded-[20px] border border-dashed border-[#cfe1f5] bg-white/70 px-6 py-12 text-center text-sm text-[#6a7f9d] shadow-[0_10px_30px_rgba(20,71,142,0.06)]">
                  No accessories available yet for Gen Alpha.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="sneakers" className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[18vw] font-extrabold uppercase tracking-[0.06em] text-white/[0.03]">
            Sneakers
          </p>

          <div className="relative mx-auto max-w-[1360px] px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="alpha-display mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4d8dff]">
                  <span className="h-[2px] w-6 bg-[#4d8dff]" /> 03 - Heat Drops
                </p>
                <h2 className="alpha-display text-4xl font-extrabold tracking-tight text-[#f5f0e8]">Sneaker Drops</h2>
              </div>
              <Link
                href="/sneakers?generation=gen-alpha"
                className="alpha-display inline-flex items-center gap-2 rounded-full bg-[#f5f0e8] px-7 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition hover:bg-[#0055ff] hover:text-white"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {visibleSneakerProducts.map((product) => {
                const wished = isWishlisted(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    dark
                    wished={wished}
                    onToggleWishlist={(item) => toggleWishlist(productToShopItem(item))}
                    onAddToCart={(item) => addToCart(productToShopItem(item))}
                  />
                );
              })}
              {visibleSneakerProducts.length === 0 ? (
                <div className="col-span-full rounded-[20px] border border-dashed border-white/10 bg-[#151515] px-6 py-12 text-center text-sm text-[#9b9b9b] shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
                  No sneaker drops available yet for Gen Alpha.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#edf5ff] to-[#e6f0ff] py-24">
          <div className="mx-auto max-w-[1360px] px-8">
            <div className="text-center">
              <p className="alpha-display mb-2 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0055ff]">
                <span className="h-[2px] w-6 bg-[#0055ff]" /> Why StyleSakhi
              </p>
              <h2 className="alpha-display text-4xl font-extrabold tracking-tight">Why Shop With Us</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: Gem,
                  title: "Premium Quality",
                  text: "Every piece is crafted with refined materials and close attention to finishing details.",
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  text: "Reliable shipping with careful packaging and tracking on every order.",
                },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  text: "Simple return process so you can shop with confidence every time.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-[#d7e5f7] bg-gradient-to-b from-white to-[#f2f8ff] p-8 text-center shadow-[0_10px_30px_rgba(20,71,142,0.10)] transition hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(20,71,142,0.16)]"
                >
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#0055ff1a] text-[#0055ff]">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="alpha-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5a564f]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <div className="pointer-events-none absolute -right-28 -top-20 h-[420px] w-[420px] rounded-full bg-[#0055ff33] blur-3xl" />

          <div className="relative mx-auto max-w-[1360px] px-8">
            <div className="mx-auto max-w-[620px] text-center">
              <p className="alpha-display mb-2 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4d8dff]">
                <span className="h-[2px] w-6 bg-[#4d8dff]" /> Stay in the Loop
              </p>
              <h2 className="alpha-display text-4xl font-extrabold tracking-tight text-[#f5f0e8]">Join the StyleSakhi Club</h2>
              <p className="mt-4 text-base text-[#f5f0e8]/60">
                Get exclusive drops, early access to sales, and special offers in your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-full border border-[#f5f0e826] bg-[#f5f0e812] px-5 text-sm text-[#f5f0e8] outline-none transition focus:border-[#0055ff]"
                />
                <button
                  type="submit"
                  className={`alpha-display h-12 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition ${
                    subscribed ? "bg-[#22c55e]" : "bg-[#0055ff] hover:bg-[#3377ff]"
                  }`}
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
              </form>

              <p className="mt-3 text-xs text-[#f5f0e8]/35">By subscribing, you agree to our privacy policy.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton bgColorClass="bg-[#0055ff]" shadowClass="shadow-[0_10px_30px_rgba(0,85,255,0.35)]" />

      <style jsx global>{`
        .gen-alpha-vstr {
          font-family: ${dmSans.style.fontFamily};
        }
        .gen-alpha-vstr .alpha-display {
          font-family: ${syne.style.fontFamily};
        }
        .marquee-track {
          animation: alpha-marquee 25s linear infinite;
        }
        @keyframes alpha-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
