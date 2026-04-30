"use client";

import Image from "next/image";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Home() {
  return (
    <div className={`${inter.className} bg-[#F8FAFC] text-[#111827]`}>
      <Navbar />

      {/* Section 1 - Hero */}
      <section className="relative w-full px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto max-w-[1265px] w-full h-[431.54px] overflow-hidden">
          <motion.div
            initial={{ scale: 1.02, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full h-full overflow-hidden"
          >
            <Image
              src="/hero/heroImg.png"
              alt="StyleSakhi hero banner"
              fill
              priority
              className="object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Hero Marquee */}
      <section className="mt-3">
        <div className="relative overflow-hidden bg-black py-6 shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent" />
          <div className="marquee-track flex w-max items-center gap-8 px-8">
            <span className="marquee-text text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
              Timeless Style ? Modern Elegance ? Everyday Luxury ? Effortless Fashion ? Confident Women ? Classic Wardrobe ? Minimal Aesthetic ? Elegant Comfort ? Style Beyond Trends ?
            </span>
            <span className="marquee-text text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
              Timeless Style ? Modern Elegance ? Everyday Luxury ? Effortless Fashion ? Confident Women ? Classic Wardrobe ? Minimal Aesthetic ? Elegant Comfort ? Style Beyond Trends ?
            </span>
          </div>
        </div>
      </section>

{/* Find Your Era - Redesigned v2 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-violet-50/30 px-6 pb-24 pt-20">
        {/* Background Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-amber-200/40 blur-[100px]" />
          <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-rose-200/40 blur-[100px]" />
          <div className="absolute left-1/3 -top-20 h-[300px] w-[300px] rounded-full bg-violet-200/30 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="inline-block rounded-full bg-white/80 px-5 py-2 text-10px font-bold uppercase tracking- [0.3em] text-zinc-600 shadow-xl backdrop-blur-sm">
              Generational Fashion
            </span>
            <h2 className={`${playfair. className} mt-6 text-5xl font-bold tracking-tight text-zinc-900 md:text-6xl lg:text-7xl`}>
              Find Your Era
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
              Fashion evolves with every generation. Discover styles that define your era.
            </p>
          </motion.div>

          {/* Era Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                name: "Boomers",
                years: "1946-19 64",
                era: "Post-War Era",
                vibe: "Elegant & Sophisticated",
                href: "/boomers",
                gradient: "from-amber-100 to-orange-50",
                accent: "bg-amber-500",
                border: "border-amber-300",
                hover: "hover:border-amber-500",
                image: "/generation/homeHero.peg",
                accentColor: "text-amber-700",
                desc: "Timeless elegance meets post-war charm."
              },
              {
                name: "Gen X",
                years: "1965-1980",
                era: "Rebellion Era",
                vibe: "Bold & Independent",
                href: "/gen-x",
                gradient: "from-emerald-100 to-teal-50",
                accent: "bg-emerald-500",
                border: "border-emerald-300",
                hover: "hover:border-emerald-500",
                image: "/generation/secondHero.jfif",
                accentColor: "text-emerald-700",
                desc: "Defying norms with style."
              },
              {
                name: "Millennials",
                years: "1981-1996",
                era: "Digital Dawn",
                vibe: "Tech-Forward & Minimal",
                href: "/millennial",
                gradient: "from-violet-100 to-purple-50",
                accent: "bg-violet-500",
                border: "border-violet-300",
                hover: "hover:border-violet-500",
                image: "/generation/millennialimg.jpg",
                accentColor: "text-violet-700",
                desc: "Clean lines with a tech-savvy edge."
              },
              {
                name: "Gen Z",
                years: "1997-2012",
                era: "Social Wave",
                vibe: "Expressive & Fluid",
                href: "/gen-z",
                gradient: "from-rose-100 to-pink-50",
                accent: "bg-rose-500",
                border: "border-rose-300",
                hover: "hover:border-rose-500",
                image: "/hero/gen-z.png",
                accentColor: "text-rose-700",
                desc: "Colors, layers, and statements."
              },
              {
                name: "Gen Alpha",
                years: "2013-2024",
                era: "Future Flex",
                vibe: "Limitless & Pure",
                href: "/gen-alpha",
                gradient: "from-sky-100 to-blue-50",
                accent: "bg-sky-500",
                border: "border-sky-300",
                hover: "hover:border-sky-500",
                image: "/generation/homeHero.jpeg",
                accentColor: "text-sky-700",
                desc: "Fashion as fluid as imagination."
              },
            ].map((gen, index) => (
              <motion.div
                key={gen.name}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  href={gen.href}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border-2 ${gen.border} ${gen.gradient} p-1 shadow-lg transition-all duration-500 hover:shadow-2xl ${gen.hover} bg-white`}
                >
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={gen.image}
                      alt={gen.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Era badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                      <span className={`h-2 w-2 animate-pulse rounded-full ${gen.accent}`} />
                      <span className={`text-10px font-bold uppercase tracking-widest ${gen.accentColor}`}>
                        {gen.era}
                      </span>
                    </div>
                    {/* Name */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-2xl font-black capitalize tracking-tight text-white drop-shadow-lg">
                        {gen.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className={`mb-2 rounded-full ${gen.accent} px-3 py-1 text-10px font-bold uppercase tracking-widest text-white`}>
                      {gen.years}
                    </span>
                    <span className={`mb-2 text-sm font-semibold ${gen.accentColor}`}>
                      {gen.vibe}
                    </span>
                    <p className="mb-4 flex-1 text-xs leading-relaxed text-zinc-600">
                      {gen.desc}
                    </p>
                    <div className={`mt-auto flex h-11 w-full items-center justify-between rounded-2xl border-2 ${gen.border} ${gen.gradient} px-4 transition-all duration-300 group-hover:shadow-md`}>
                      <span className={`text-sm font-bold ${gen.accentColor} transition-colors duration-300 group-hover:text-white`}>
                        Shop Now
                      </span>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${gen.accent} text-white transition-all duration-300 group-hover:rotate-90`}>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 flex items-center justify-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
              Style Without Boundaries
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="bg-[#F8FAFC] px-6 pb-20 pt-2">
        <div className="mx-auto max-w-6xl space-y-12">
          {[
            {
              title: "Clothing Picks",
              items: [
                {
                  name: "Ben 10: Tennyson",
                  category: "Oversized Jerseys",
                  price: "₹ 1199",
                  label: "Premium Dot Knit Fabric",
                  image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Cotton Linen: Russet Brown",
                  category: "Cotton Linen Shirts",
                  price: "₹ 1599",
                  label: "Linen Blend",
                  image: "https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Cotton Linen: Anchor Crest",
                  category: "Cotton Linen Shirts",
                  price: "₹ 1899",
                  label: "Embroidery",
                  image: "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Oversized Jerseys: Lost In Sunshine",
                  category: "Oversized Jerseys",
                  price: "₹ 1299",
                  label: "Oversized Fit",
                  image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
              ],
            },
            {
              title: "Accessories Picks",
              items: [
                {
                  name: "Cognac Leather Tote",
                  category: "Premium Bags",
                  price: "₹ 2799",
                  label: "Bestseller",
                  image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Pearl Hoop Set",
                  category: "Jewelry",
                  price: "₹ 899",
                  label: "New",
                  image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Gold Frame Shades",
                  category: "Sunglasses",
                  price: "₹ 1299",
                  label: "Trending",
                  image: "https://images.pexels.com/photos/1398886/pexels-photo-1398886.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Classic Leather Belt",
                  category: "Belts",
                  price: "₹ 999",
                  label: "Essential",
                  image: "https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
              ],
            },
            {
              title: "Sneakers Picks",
              items: [
                {
                  name: "White Cloud Chunky",
                  category: "Chunky Sneakers",
                  price: "₹ 3499",
                  label: "Hot",
                  image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Pastel Pink Retro",
                  category: "Retro Runners",
                  price: "₹ 2999",
                  label: "Limited",
                  image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Tan Suede Classics",
                  category: "Everyday Wear",
                  price: "₹ 2499",
                  label: "New",
                  image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1200",
                },
                {
                  name: "Urban Street High",
                  category: "High Tops",
                  price: "₹ 3799",
                  label: "Premium",
                  image: "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
                },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Featured Products
                </p>
                <h2 className={`${playfair.className} mt-2 text-3xl font-semibold text-gray-900 md:text-4xl`}>
                  {section.title}
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative h-80 overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={900}
                        height={1200}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="mt-auto space-y-1 border-t border-gray-200 px-3 py-4">
                      <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .marquee-track {
          animation: marquee-scroll 22s linear infinite;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
