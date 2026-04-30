"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductHoverActions from "@/components/ProductHoverActions";
import BannerCarousel from "@/components/BannerCarousel";
import GenerationHighestSelling from "@/components/GenerationHighestSelling";
import type { HighestSellingProduct } from "@/components/HighestSellingProducts";

export default function GenXPage() {
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
      alt: "Gen X Collection Banner 1",
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
      alt: "Gen X Collection Banner 2",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
      alt: "Gen X Collection Banner 3",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
      alt: "Gen X Collection Banner 4",
    },
  ];
  const bestsellers: HighestSellingProduct[] = [
    {
      id: "genx-bestseller-tailored-wool-blazer",
      name: "Tailored Wool Blazer",
      price: 345,
      priceLabel: "Rs. 345",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9yyw4ldPquXuSZ1uW_KPBon3VVHfMmYCztzN2Qftvv9bzgHU8QOJPSnFGo23rizCoGpOFRMIyEWYxrO7jYFz6jwG0ESIfa5c3uG1amOvsW2f1Op1lvF8RlwtZMoyjzHgsn2YTPSrz4CVhsiee6rXGou5UnSl4OC4tjaci_26BJoFY2v1ciBqTjJonT7UwjGVZLKw-38wTIchqr-VRjXPPtgj4GPzm-V6-gOf9ka4bDmZ6L5EVyCBlp7S2PHYS6BNP4r5ZwFkGQMS2",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Signature",
      rating: "4.8",
      soldLabel: "780 sold",
      note: "Work polish",
    },
    {
      id: "genx-bestseller-architectural-leather-tote",
      name: "Architectural Leather Tote",
      price: 495,
      priceLabel: "Rs. 495",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEN8514iTH3xZfuJDWIHPa0Z7mIEpFUYeV0SvZbr6jymg4-Sxs0d7ayqhPtkiZq0gS-Nn3pzTbZCDyo0OACPfuC3-pD-hj0KDeLRk-OgKV0ofkKOwnumMbQ78B5uQINiIrYLEH0NpUADy08wsgnB--giqScqhOakOpLQPK0M57i7bh94ayxiacnjj3AyUwrJ9uuiPnTIbbf6yq7iyyngDpk3g5ZWWCqhVhDP3FvQx5kBIG2ZrI9LPZ0O5NAbHQmKg6tiGf0cbbBGD4",
      category: "Accessories",
      href: "/accessories/croissant-leather-bag",
      badge: "Desk to dinner",
      rating: "4.9",
      soldLabel: "690 sold",
      note: "Premium carry",
    },
    {
      id: "genx-bestseller-urban-minimalist-leather-low",
      name: "Urban Minimalist Leather Low",
      price: 165,
      priceLabel: "Rs. 165",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJU5mMsIyfh0CosozqFO32YpcvdLtkKYgKEqR3asK8aWnvQrhRvdQCfcPzxhYvvEHUKv4UkDvFfbb_oPYhOf9-hXLAt72byLTwSVVKNYA6j2Vm9OFqHQWLLhAnnZjiuRrBArj3W7c-F-ZkYTMyC9P6VYuKA3nWKwqYGi42BLHN2QxFQqFEOYDkGAPFgA0YRto9WZByiNy0iq0ifQVYNZNrRl833xECdSJZYrS4dCJ9z55rtB02gWyVVfmDQc38iaRp8S2kz-iV3bjN",
      category: "Sneakers",
      href: "/sneakers/nova-form-strider",
      badge: "Everyday",
      rating: "4.7",
      soldLabel: "620 sold",
      note: "Clean minimal",
    },
    {
      id: "genx-bestseller-essential-cashmere-vneck",
      name: "Essential Cashmere V-Neck",
      price: 295,
      priceLabel: "Rs. 295",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8VqDYKC0FMJL1_S88iDsyf0bVi5dQQQiNFd8QeBVEK0l7VieoG0dmlceRi1Nos7MPvz58bdL8bjnxhR_h0L9d1I_9HkBq6p8fecT9pbJrj_DcQEn-59Bhjm06HvfpArZhG3OxNFYMmbTPcMuwCxcKeVLkXQlz4oWyyKQX-NBhQ36ew7DMxhD1GjzUbEbXHz-w738BwfWErLGIvp9Kn6RUBQjGBWQ5pk1q8-25ZBISl_NkE29Mar4IbT1f2AFHSZ7soXcBpdqMaEUn",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Soft luxury",
      rating: "4.8",
      soldLabel: "590 sold",
      note: "Repeat buy",
    },
  ];
  return (
    <div className="bg-[#eef4ff] text-[#151c25] font-body selection:bg-[#9ec2fe] selection:text-[#284f83]">
      <Navbar />

      <main className="pt-16">
        <section className="px-4">
          <div className="max-w-[1265px] mx-auto">
            <BannerCarousel banners={banners} autoPlayInterval={4000} />
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-[#eef4ff] p-3 rounded-lg text-[#002440]">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm tracking-tight">Free Shipping</p>
                <p className="font-body text-xs text-slate-500">On all orders over ₹150</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#eef4ff] p-3 rounded-lg text-[#002440]">
                <span className="material-symbols-outlined">assignment_return</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm tracking-tight">30-Day Returns</p>
                <p className="font-body text-xs text-slate-500">Hassle-free guarantee</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#eef4ff] p-3 rounded-lg text-[#002440]">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm tracking-tight">Secure Checkout</p>
                <p className="font-body text-xs text-slate-500">256-bit SSL protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#eef4ff] p-3 rounded-lg text-[#002440]">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm tracking-tight">Ethical Sourcing</p>
                <p className="font-body text-xs text-slate-500">Responsible materials</p>
              </div>
            </div>
          </div>
        </section>

        <GenerationHighestSelling
          generation="gen-x"
          generationLabel="Gen X"
          viewAllHref="/clothing?generation=gen-x"
          backgroundClassName="bg-[#f8fbff]"
          accentClassName="bg-[#002440] text-white"
          description="Premium essentials, reliable footwear, and polished accessories that Gen X customers keep coming back for."
          fallbackProducts={bestsellers}
        />

        <section className="py-16 px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#F4A261] font-label text-xs font-bold tracking-[0.2em] uppercase">Signature Essentials</span>
              <h2 className="font-headline text-[2rem] font-bold text-[#002440] mt-2">Clothing</h2>
            </div>
            <Link className="font-label text-sm font-semibold text-[#395f94] hover:underline underline-offset-8 transition-all flex items-center group" href="/clothing?generation=gen-x">
              View More
              <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative overflow-hidden rounded-lg mb-4 h-[340px] bg-[#e7eefb]">
                <img
                  alt="Detailed studio shot of a classic navy blue tailored wool blazer on a invisible mannequin, neutral studio background"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9yyw4ldPquXuSZ1uW_KPBon3VVHfMmYCztzN2Qftvv9bzgHU8QOJPSnFGo23rizCoGpOFRMIyEWYxrO7jYFz6jwG0ESIfa5c3uG1amOvsW2f1Op1lvF8RlwtZMoyjzHgsn2YTPSrz4CVhsiee6rXGou5UnSl4OC4tjaci_26BJoFY2v1ciBqTjJonT7UwjGVZLKw-38wTIchqr-VRjXPPtgj4GPzm-V6-gOf9ka4bDmZ6L5EVyCBlp7S2PHYS6BNP4r5ZwFkGQMS2"
                />
                <ProductHoverActions
                  product={{
                    id: "genx-clothing-tailored-wool-blazer",
                    name: "Tailored Wool Blazer",
                    price: 345,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9yyw4ldPquXuSZ1uW_KPBon3VVHfMmYCztzN2Qftvv9bzgHU8QOJPSnFGo23rizCoGpOFRMIyEWYxrO7jYFz6jwG0ESIfa5c3uG1amOvsW2f1Op1lvF8RlwtZMoyjzHgsn2YTPSrz4CVhsiee6rXGou5UnSl4OC4tjaci_26BJoFY2v1ciBqTjJonT7UwjGVZLKw-38wTIchqr-VRjXPPtgj4GPzm-V6-gOf9ka4bDmZ6L5EVyCBlp7S2PHYS6BNP4r5ZwFkGQMS2",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="font-headline font-semibold text-lg text-[#002440]">Tailored Wool Blazer</h3>
              <p className="font-body text-slate-500 text-sm mb-2">Midnight Navy</p>
              <p className="font-headline font-bold text-[#002440]">₹345.00</p>
            </Link>
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative overflow-hidden rounded-lg mb-4 h-[340px] bg-[#e7eefb]">
                <img
                  alt="Folded luxury cream cashmere sweater showing texture and knit pattern on a dark oak table surface"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VqDYKC0FMJL1_S88iDsyf0bVi5dQQQiNFd8QeBVEK0l7VieoG0dmlceRi1Nos7MPvz58bdL8bjnxhR_h0L9d1I_9HkBq6p8fecT9pbJrj_DcQEn-59Bhjm06HvfpArZhG3OxNFYMmbTPcMuwCxcKeVLkXQlz4oWyyKQX-NBhQ36ew7DMxhD1GjzUbEbXHz-w738BwfWErLGIvp9Kn6RUBQjGBWQ5pk1q8-25ZBISl_NkE29Mar4IbT1f2AFHSZ7soXcBpdqMaEUn"
                />
                <ProductHoverActions
                  product={{
                    id: "genx-clothing-essential-cashmere-vneck",
                    name: "Essential Cashmere V-Neck",
                    price: 295,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8VqDYKC0FMJL1_S88iDsyf0bVi5dQQQiNFd8QeBVEK0l7VieoG0dmlceRi1Nos7MPvz58bdL8bjnxhR_h0L9d1I_9HkBq6p8fecT9pbJrj_DcQEn-59Bhjm06HvfpArZhG3OxNFYMmbTPcMuwCxcKeVLkXQlz4oWyyKQX-NBhQ36ew7DMxhD1GjzUbEbXHz-w738BwfWErLGIvp9Kn6RUBQjGBWQ5pk1q8-25ZBISl_NkE29Mar4IbT1f2AFHSZ7soXcBpdqMaEUn",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="font-headline font-semibold text-lg text-[#002440]">Essential Cashmere V-Neck</h3>
              <p className="font-body text-slate-500 text-sm mb-2">Oatmeal Melange</p>
              <p className="font-headline font-bold text-[#002440]">₹295.00</p>
            </Link>
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative overflow-hidden rounded-lg mb-4 h-[340px] bg-[#e7eefb]">
                <img
                  alt="Pair of wide-leg beige high-waisted trousers hanging on a minimalist brass hanger against a white wall"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDmVzRLA684y3zejXnQ-wAkKr0essj6vfHtUBzODEUUC_RyKb20ugSxWPMTOeaKAOqG1Jo4i3CSN9GU4qTLsnZX_QZcECcOP4rRxaFioiLFblk26Bm1A5pcqyzPSq_YiL9g8g2YHZ6V27oyJ_7EsEVR_riD0Xpck4sIpa_0EElAVNkZ-3f33d_ZBBs3dJngDi2-jgvLiI5pel2mv0MyyF3qrW7QCyYAGNW3oYSTHD9CFKDmoVdpZA5qFc8Wq_aAsSoxLMFiQzvbDM5"
                />
                <ProductHoverActions
                  product={{
                    id: "genx-clothing-pleated-wide-leg-trouser",
                    name: "Pleated Wide-Leg Trouser",
                    price: 185,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDmVzRLA684y3zejXnQ-wAkKr0essj6vfHtUBzODEUUC_RyKb20ugSxWPMTOeaKAOqG1Jo4i3CSN9GU4qTLsnZX_QZcECcOP4rRxaFioiLFblk26Bm1A5pcqyzPSq_YiL9g8g2YHZ6V27oyJ_7EsEVR_riD0Xpck4sIpa_0EElAVNkZ-3f33d_ZBBs3dJngDi2-jgvLiI5pel2mv0MyyF3qrW7QCyYAGNW3oYSTHD9CFKDmoVdpZA5qFc8Wq_aAsSoxLMFiQzvbDM5",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="font-headline font-semibold text-lg text-[#002440]">Pleated Wide-Leg Trouser</h3>
              <p className="font-body text-slate-500 text-sm mb-2">Desert Sand</p>
              <p className="font-headline font-bold text-[#002440]">₹185.00</p>
            </Link>
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative overflow-hidden rounded-lg mb-4 h-[340px] bg-[#e7eefb]">
                <img
                  alt="Minimalist white crisp cotton button-down shirt tucked into dark trousers, focused on the collar and cuff quality"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkuZwVf5iej-xfW-g0MxqkeWIJE4v4kiaSRhUqDqK9uQ6o0Y_hziLal3sBgyk5TekdzoPQZB6CoxpJhu57D1008ojPxweuPgGZykzDon45B5q3I9atb-irKW99clN1zSWi0ya4mliY-ioMPTBx22ANp6DsCLvmzObEZ-97UK8tVFFkCxYi_ToTX-cPqH4OXTdg40LIWVyoRnXL1Ran8-0fMMlnOgYRUA8o9CTwPYpFWGMFIzelo2D_WREJwsLkWR5p-_CjKqgNkDpy"
                />
                <ProductHoverActions
                  product={{
                    id: "genx-clothing-signature-poplin-shirt",
                    name: "Signature Poplin Shirt",
                    price: 120,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkuZwVf5iej-xfW-g0MxqkeWIJE4v4kiaSRhUqDqK9uQ6o0Y_hziLal3sBgyk5TekdzoPQZB6CoxpJhu57D1008ojPxweuPgGZykzDon45B5q3I9atb-irKW99clN1zSWi0ya4mliY-ioMPTBx22ANp6DsCLvmzObEZ-97UK8tVFFkCxYi_ToTX-cPqH4OXTdg40LIWVyoRnXL1Ran8-0fMMlnOgYRUA8o9CTwPYpFWGMFIzelo2D_WREJwsLkWR5p-_CjKqgNkDpy",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="font-headline font-semibold text-lg text-[#002440]">Signature Poplin Shirt</h3>
              <p className="font-body text-slate-500 text-sm mb-2">Optic White</p>
              <p className="font-headline font-bold text-[#002440]">₹120.00</p>
            </Link>
          </div>
        </section>

        <section className="bg-[#f8f9ff] py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <span className="text-[#F4A261] font-label text-xs font-bold tracking-[0.2em] uppercase">The Finishing Touches</span>
              <h2 className="font-headline text-[2rem] font-bold text-[#002440] mt-2 mb-6">Accessories</h2>
              <p className="text-[#43474d] leading-relaxed mb-8">
                The subtle details that transform a look. Hand-selected pieces crafted for durability and timeless appeal.
              </p>
              <Link
                className="bg-[#002440] text-white font-headline font-bold py-3 px-8 rounded-lg editorial-shadow transition-transform hover:scale-105 active:scale-95 inline-block"
                href="/accessories?generation=gen-x"
              >
                Explore Accessories
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link className="bg-white p-6 rounded-lg editorial-shadow group cursor-pointer block" href="/accessories/croissant-leather-bag">
                <div className="relative h-[280px] overflow-hidden rounded-lg mb-6 bg-[#eef4ff]">
                  <img
                    alt="Large minimalist tan leather tote bag standing upright on a grey stone surface with soft lighting"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEN8514iTH3xZfuJDWIHPa0Z7mIEpFUYeV0SvZbr6jymg4-Sxs0d7ayqhPtkiZq0gS-Nn3pzTbZCDyo0OACPfuC3-pD-hj0KDeLRk-OgKV0ofkKOwnumMbQ78B5uQINiIrYLEH0NpUADy08wsgnB--giqScqhOakOpLQPK0M57i7bh94ayxiacnjj3AyUwrJ9uuiPnTIbbf6yq7iyyngDpk3g5ZWWCqhVhDP3FvQx5kBIG2ZrI9LPZ0O5NAbHQmKg6tiGf0cbbBGD4"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genx-accessories-architectural-leather-tote",
                      name: "Architectural Leather Tote",
                      price: 495,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEN8514iTH3xZfuJDWIHPa0Z7mIEpFUYeV0SvZbr6jymg4-Sxs0d7ayqhPtkiZq0gS-Nn3pzTbZCDyo0OACPfuC3-pD-hj0KDeLRk-OgKV0ofkKOwnumMbQ78B5uQINiIrYLEH0NpUADy08wsgnB--giqScqhOakOpLQPK0M57i7bh94ayxiacnjj3AyUwrJ9uuiPnTIbbf6yq7iyyngDpk3g5ZWWCqhVhDP3FvQx5kBIG2ZrI9LPZ0O5NAbHQmKg6tiGf0cbbBGD4",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-headline font-semibold text-[#002440]">Architectural Leather Tote</h3>
                    <p className="font-body text-xs text-slate-500">Vegetable Tanned Leather</p>
                  </div>
                  <p className="font-headline font-bold text-[#002440]">₹495</p>
                </div>
              </Link>
              <Link className="bg-white p-6 rounded-lg editorial-shadow group cursor-pointer transform lg:translate-y-12 block" href="/accessories/croissant-leather-bag">
                <div className="relative h-[280px] overflow-hidden rounded-lg mb-6 bg-[#eef4ff]">
                  <img
                    alt="Elegant silk scarf with abstract geometric print in navy and orange draped over a velvet chair"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmNw3yQF0LHNN8UpbNR2aJjWteZmwBBELJXg3CxR32a8yYn5T5RKTy5IX3fQms7cCQcf-G_W5pBMQRuyKxOOUWSuE7pw3zeIwGcXd05vrhIaprNYoNqgbeOJR13dRU6qaVIRPYwclE-i6PSIkAERyfLI0IRYEhzff9XLtmupIfWKGB9AK3dHAo4GHEfSKbF6xWIE5viVOydMhIHFmInAz7bGK7vFNGTdZ6QvbQ0vmeXoSRQMjRtvfyBMyimy7k3xfH2UsELMMRszsZ"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genx-accessories-abstract-print-silk-scarf",
                      name: "Abstract Print Silk Scarf",
                      price: 110,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDmNw3yQF0LHNN8UpbNR2aJjWteZmwBBELJXg3CxR32a8yYn5T5RKTy5IX3fQms7cCQcf-G_W5pBMQRuyKxOOUWSuE7pw3zeIwGcXd05vrhIaprNYoNqgbeOJR13dRU6qaVIRPYwclE-i6PSIkAERyfLI0IRYEhzff9XLtmupIfWKGB9AK3dHAo4GHEfSKbF6xWIE5viVOydMhIHFmInAz7bGK7vFNGTdZ6QvbQ0vmeXoSRQMjRtvfyBMyimy7k3xfH2UsELMMRszsZ",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-headline font-semibold text-[#002440]">Abstract Print Silk Scarf</h3>
                    <p className="font-body text-xs text-slate-500">100% Mulberry Silk</p>
                  </div>
                  <p className="font-headline font-bold text-[#002440]">₹110</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 max-w-7xl mx-auto mt-10 lg:mt-0">
          <div className="mb-12 text-center">
            <span className="text-[#F4A261] font-label text-xs font-bold tracking-[0.2em] uppercase">Comfort Without Compromise</span>
            <h2 className="font-headline text-[2rem] font-bold text-[#002440] mt-2">Sneakers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link className="bg-white p-4 rounded-lg group cursor-pointer transition-colors hover:bg-[#eef4ff] block" href="/sneakers/nova-form-strider">
              <div className="relative overflow-hidden rounded-lg mb-6 h-[240px]">
                <img
                  alt="Clean white premium leather low-top sneakers in a bright minimalist setting with clean shadows"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJU5mMsIyfh0CosozqFO32YpcvdLtkKYgKEqR3asK8aWnvQrhRvdQCfcPzxhYvvEHUKv4UkDvFfbb_oPYhOf9-hXLAt72byLTwSVVKNYA6j2Vm9OFqHQWLLhAnnZjiuRrBArj3W7c-F-ZkYTMyC9P6VYuKA3nWKwqYGi42BLHN2QxFQqFEOYDkGAPFgA0YRto9WZByiNy0iq0ifQVYNZNrRl833xECdSJZYrS4dCJ9z55rtB02gWyVVfmDQc38iaRp8S2kz-iV3bjN"
                />
                <ProductHoverActions product={{ id: "genx-sneakers-urban-minimalist-leather-low", name: "Urban Minimalist Leather Low", price: 165, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJU5mMsIyfh0CosozqFO32YpcvdLtkKYgKEqR3asK8aWnvQrhRvdQCfcPzxhYvvEHUKv4UkDvFfbb_oPYhOf9-hXLAt72byLTwSVVKNYA6j2Vm9OFqHQWLLhAnnZjiuRrBArj3W7c-F-ZkYTMyC9P6VYuKA3nWKwqYGi42BLHN2QxFQqFEOYDkGAPFgA0YRto9WZByiNy0iq0ifQVYNZNrRl833xECdSJZYrS4dCJ9z55rtB02gWyVVfmDQc38iaRp8S2kz-iV3bjN", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
              </div>
              <div className="px-2">
                <h3 className="font-headline font-semibold text-lg text-[#002440]">Urban Minimalist Leather Low</h3>
                <p className="font-body text-slate-500 text-sm mb-4">Ergonomic footbed, White/Tan</p>
                <div className="flex justify-between items-center">
                  <p className="font-headline font-bold text-[#002440]">₹165.00</p>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#002440] transition-colors">add_shopping_cart</span>
                </div>
              </div>
            </Link>
            <Link className="bg-white p-4 rounded-lg group cursor-pointer transition-colors hover:bg-[#eef4ff] block" href="/sneakers/nova-form-strider">
              <div className="relative overflow-hidden rounded-lg mb-6 h-[240px]">
                <img
                  alt="Elegant leather slip-on loafers in a warm tan color showing clean craftsmanship and flexible sole"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPoHoYCQ5VR1pcke_GFpeq6mmVELXKTa-Rg33YjRkvluGNk3QbgSHig1sKD0ZDUIKILo9BrLiAXzOoedCbjM8UPFS-mO808A0Yrsa3c3tYIqojKizEo10Xoc88C58kkA8C-izwm5WIR9nJyJ0HADyc2WoezyEoJehS4nq_4nJsI9na7kGer57nC1vQaUyi8OjB-M36UbTeykn4wWjS-dTtkt4thr8eo9a5B1cN0d6R_qKBHsK4iwiX_wb6QgJa8nDONrj1Ya26Vb38"
                />
                <ProductHoverActions product={{ id: "genx-sneakers-seamless-leather-slip-on", name: "Seamless Leather Slip-On", price: 140, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPoHoYCQ5VR1pcke_GFpeq6mmVELXKTa-Rg33YjRkvluGNk3QbgSHig1sKD0ZDUIKILo9BrLiAXzOoedCbjM8UPFS-mO808A0Yrsa3c3tYIqojKizEo10Xoc88C58kkA8C-izwm5WIR9nJyJ0HADyc2WoezyEoJehS4nq_4nJsI9na7kGer57nC1vQaUyi8OjB-M36UbTeykn4wWjS-dTtkt4thr8eo9a5B1cN0d6R_qKBHsK4iwiX_wb6QgJa8nDONrj1Ya26Vb38", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
              </div>
              <div className="px-2">
                <h3 className="font-headline font-semibold text-lg text-[#002440]">Seamless Leather Slip-On</h3>
                <p className="font-body text-slate-500 text-sm mb-4">Ultra-flexible sole, Camel</p>
                <div className="flex justify-between items-center">
                  <p className="font-headline font-bold text-[#002440]">₹140.00</p>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#002440] transition-colors">add_shopping_cart</span>
                </div>
              </div>
            </Link>
            <Link className="bg-white p-4 rounded-lg group cursor-pointer transition-colors hover:bg-[#eef4ff] block" href="/sneakers/nova-form-strider">
              <div className="relative overflow-hidden rounded-lg mb-6 h-[240px]">
                <img
                  alt="High-end knit ergonomic athletic sneakers in soft grey tones focused on the supportive heel and mesh texture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7m8ydXHm7WtfN0fUOHwhiM_gK3TEUhqIw5Wyynh3eVmlKkij8ZmW-xQ2K_C421S6SQIQkBZmW1cXwAirD7UwhECA7fJGl1DjzwVIdDSrzcUa1_qozj1pz5tP-tH9wyRvkYQ2m9hZFQVLl32kOWe7z9uEu9_KQGAeEKlUFOvqUlrN4n5YXMOTSImVAV1odP4Jr1tgZD1i4amyERA6yFsb5ImpIRYLCKkGms4FQfqmUl8BlePzQgLhAH-tsECtekMytGjd8BCJVm3k0"
                />
                <ProductHoverActions product={{ id: "genx-sneakers-movement-tech-knit-runner", name: "Movement Tech Knit Runner", price: 195, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7m8ydXHm7WtfN0fUOHwhiM_gK3TEUhqIw5Wyynh3eVmlKkij8ZmW-xQ2K_C421S6SQIQkBZmW1cXwAirD7UwhECA7fJGl1DjzwVIdDSrzcUa1_qozj1pz5tP-tH9wyRvkYQ2m9hZFQVLl32kOWe7z9uEu9_KQGAeEKlUFOvqUlrN4n5YXMOTSImVAV1odP4Jr1tgZD1i4amyERA6yFsb5ImpIRYLCKkGms4FQfqmUl8BlePzQgLhAH-tsECtekMytGjd8BCJVm3k0", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
              </div>
              <div className="px-2">
                <h3 className="font-headline font-semibold text-lg text-[#002440]">Movement Tech Knit Runner</h3>
                <p className="font-body text-slate-500 text-sm mb-4">Breathable mesh, Slate Grey</p>
                <div className="flex justify-between items-center">
                  <p className="font-headline font-bold text-[#002440]">₹195.00</p>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#002440] transition-colors">add_shopping_cart</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-16 text-center">
            <Link
              className="border border-[#c3c7ce]/30 text-[#002440] font-headline font-semibold py-3 px-12 rounded-lg transition-all duration-300 hover:bg-[#002440] hover:text-white inline-block"
              href="/sneakers?generation=gen-x"
            >
              View More Footwear
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .font-headline {
          font-family: "Manrope", sans-serif;
        }

        .font-body,
        .font-label {
          font-family: "Inter", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }

        .editorial-shadow {
          box-shadow: 0px 12px 32px rgba(21, 28, 37, 0.06);
        }
      `}</style>
    </div>
  );
}


