"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductHoverActions from "@/components/ProductHoverActions";
import BannerCarousel from "@/components/BannerCarousel";
import GenerationHighestSelling from "@/components/GenerationHighestSelling";
import type { HighestSellingProduct } from "@/components/HighestSellingProducts";

export default function MillennialPage() {
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
      alt: "Millennials Collection Banner 1",
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
      alt: "Millennials Collection Banner 2",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
      alt: "Millennials Collection Banner 3",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
      alt: "Millennials Collection Banner 4",
    },
  ];
  const bestsellers: HighestSellingProduct[] = [
    {
      id: "millennial-bestseller-structured-linen-blazer",
      name: "Structured Linen Blazer",
      price: 245,
      priceLabel: "Rs. 245",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgbmjaWtpS6BJmjsyjsVpe3ryDNUDRnzPssK240gv80JSDtlEtuBbTCAWXCyz5RjPThMEUD1jkQrZJAXY0UdueySarY8aKE0JdBXzLSdz5b0hDX5z9hzT1ahwzNlC5RW1JBoIPCxFQVUONFlg6YE2MLurhjU6j7neCYXCz2ENdGAUu_Qfkz4LXwXxFIsQ4P3X0fnJS0DjESaMS76S4UTActet2hbX0IWSKo9tC8IRIbOFcnNOELBhq5-iCRMOMjDr4MuvEdMzCQEPX",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Workwear hit",
      rating: "4.8",
      soldLabel: "820 sold",
      note: "Capsule staple",
    },
    {
      id: "millennial-bestseller-sculptural-leather-tote",
      name: "Sculptural Leather Tote",
      price: 320,
      priceLabel: "Rs. 320",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSpb5Xo2mLYWYzEbYUyDPunFWZboVHcq3rQSKHMwrDofl8hIQMW2ARJJP5PuC0NL0xjeAOdzgDXQQm6U2wziwer5U3HU7ynSahLy4SkuHQ1IQiuMagCGZm3IcBpHd9L68PbVQvNT-b8ZV1cXKuL_lyTSBGud7a-V4XcCMUHKoPSzI3wOgRINVGSMFTONswI5WuoxeiuQatzG6vphSd2Io12eaIVIVi6RIAQv9xYmIqkxjS0BuYKgxzG3zxX9wofp1xq2DSQ2I0t-Bz",
      category: "Accessories",
      href: "/accessories/croissant-leather-bag",
      badge: "Most saved",
      rating: "4.9",
      soldLabel: "760 sold",
      note: "Editorial look",
    },
    {
      id: "millennial-bestseller-urban-minimalist-leather-low",
      name: "Urban Minimalist Leather Low",
      price: 165,
      priceLabel: "Rs. 165",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDiDc3wXTF3CwZbB-zJ301OKh0puZmNqOhPwrtIEGb97rAiPTUZsMFXOP2ftvDBe4jGZKK89iYDrOMxveCc28FUp_da02scODCTHA-V99_cxO7aHJEV-v7_URSnlXwW7KF41JuflBUzBAhxjEwUdNdlka2A6QKeeMzbxTbdRKZbVjCCO5GUZfNOegWvPG2nx1knK5NtbKLR9hzhd8QrY0c0-_ZoCjjQm2LGcb1MLhcIRQZ3EiBojZNqgPKCsClvy3Qdkj0CKVKay8Ze",
      category: "Sneakers",
      href: "/sneakers/nova-form-strider",
      badge: "Street clean",
      rating: "4.7",
      soldLabel: "710 sold",
      note: "Minimalist",
    },
    {
      id: "millennial-bestseller-silk-slip-dress",
      name: "Silk Slip Dress",
      price: 180,
      priceLabel: "Rs. 180",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYJwE8qEcqe7pYF-a-Z3BB7kg73UpbBxjqeJupUueYmAr-dM31Syhr_QD_4OXCw_tB1c2n4fIlZ3XOuG5qDclaQphMmnuyBQadSNQ67QG1tzu2V4-W94u7r5JxAV8baEkHkf1jgOY2vr9SB4AlW5MjJ-Bvb-lRz117IiOs7Y6Ny1_oQ29kMd0gTey87UC_Pq16uOC4Cx5VrVvMJwMxxRgJC7vD1yU8Kzq_EsE2U6or233QVh2O2VeEMsbcwDQCH9krMi0P9OQFUw5A",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Date-night",
      rating: "4.8",
      soldLabel: "650 sold",
      note: "Easy styling",
    },
  ];
  return (
    <div className="bg-[#fff8f4] text-[#211a13] font-sans selection:bg-[#ffd9e0] selection:text-[#2f121a]">
      <Navbar />

      <main className="pt-16">
        <section className="px-4">
          <div className="max-w-[1265px] mx-auto">
            <BannerCarousel banners={banners} autoPlayInterval={4000} />
          </div>
        </section>

        <GenerationHighestSelling
          generation="millennial"
          generationLabel="Millennials"
          viewAllHref="/clothing?generation=millennial"
          backgroundClassName="bg-[#fff1e7]"
          accentClassName="bg-[#7b535c] text-white"
          description="A quick edit of the pieces Millennial shoppers love most: capsule layers, refined bags, and clean sneakers."
          fallbackProducts={bestsellers}
        />

        <section className="py-24 px-8 max-w-screen-2xl mx-auto">
          <div className="flex items-end justify-between mb-16 px-4 md:px-0">
            <div className="space-y-2">
              <span className="font-sans text-xs tracking-widest text-[#7b535c] uppercase font-semibold">Curation 01</span>
              <h2 className="font-serif text-4xl text-[#211a13]">Clothing</h2>
            </div>
            <Link
              className="text-[#7b535c] font-sans text-sm border-b border-[#7b535c]/20 hover:border-[#7b535c] transition-all pb-1 mb-1"
              href="/clothing?generation=millennial"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  alt="Minimalist linen beige blazer hanging on a wooden rack against a soft cream background with natural lighting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgbmjaWtpS6BJmjsyjsVpe3ryDNUDRnzPssK240gv80JSDtlEtuBbTCAWXCyz5RjPThMEUD1jkQrZJAXY0UdueySarY8aKE0JdBXzLSdz5b0hDX5z9hzT1ahwzNlC5RW1JBoIPCxFQVUONFlg6YE2MLurhjU6j7neCYXCz2ENdGAUu_Qfkz4LXwXxFIsQ4P3X0fnJS0DjESaMS76S4UTActet2hbX0IWSKo9tC8IRIbOFcnNOELBhq5-iCRMOMjDr4MuvEdMzCQEPX"
                />
                <ProductHoverActions
                  product={{
                    id: "millennial-clothing-structured-linen-blazer",
                    name: "Structured Linen Blazer",
                    price: 245,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgbmjaWtpS6BJmjsyjsVpe3ryDNUDRnzPssK240gv80JSDtlEtuBbTCAWXCyz5RjPThMEUD1jkQrZJAXY0UdueySarY8aKE0JdBXzLSdz5b0hDX5z9hzT1ahwzNlC5RW1JBoIPCxFQVUONFlg6YE2MLurhjU6j7neCYXCz2ENdGAUu_Qfkz4LXwXxFIsQ4P3X0fnJS0DjESaMS76S4UTActet2hbX0IWSKo9tC8IRIbOFcnNOELBhq5-iCRMOMjDr4MuvEdMzCQEPX",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="font-sans text-sm text-[#827476]">The Archive Collection</p>
                <h3 className="font-serif text-lg">Structured Linen Blazer</h3>
                <p className="font-serif text-[#7b535c] font-medium">₹245.00</p>
              </div>
            </Link>

            <Link className="group cursor-pointer mt-0 lg:mt-12 block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  alt="Soft sage green silk slip dress draped elegantly over a velvet ottoman in a bright minimal studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYJwE8qEcqe7pYF-a-Z3BB7kg73UpbBxjqeJupUueYmAr-dM31Syhr_QD_4OXCw_tB1c2n4fIlZ3XOuG5qDclaQphMmnuyBQadSNQ67QG1tzu2V4-W94u7r5JxAV8baEkHkf1jgOY2vr9SB4AlW5MjJ-Bvb-lRz117IiOs7Y6Ny1_oQ29kMd0gTey87UC_Pq16uOC4Cx5VrVvMJwMxxRgJC7vD1yU8Kzq_EsE2U6or233QVh2O2VeEMsbcwDQCH9krMi0P9OQFUw5A"
                />
                <ProductHoverActions
                  product={{
                    id: "millennial-clothing-silk-slip-dress",
                    name: "Silk Slip Dress",
                    price: 180,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYJwE8qEcqe7pYF-a-Z3BB7kg73UpbBxjqeJupUueYmAr-dM31Syhr_QD_4OXCw_tB1c2n4fIlZ3XOuG5qDclaQphMmnuyBQadSNQ67QG1tzu2V4-W94u7r5JxAV8baEkHkf1jgOY2vr9SB4AlW5MjJ-Bvb-lRz117IiOs7Y6Ny1_oQ29kMd0gTey87UC_Pq16uOC4Cx5VrVvMJwMxxRgJC7vD1yU8Kzq_EsE2U6or233QVh2O2VeEMsbcwDQCH9krMi0P9OQFUw5A",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="font-sans text-sm text-[#827476]">New Arrivals</p>
                <h3 className="font-serif text-lg">Silk Slip Dress</h3>
                <p className="font-serif text-[#7b535c] font-medium">₹180.00</p>
              </div>
            </Link>

            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  alt="Oversized white poplin shirt tucked into tailored trousers, clean editorial aesthetic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfBVUdlMhOzES7xCn2DHdwZjBR9uR90T27qqwVtx-zTZHIDQebZWNCU-RuwOnfxLZKaSluKDgz2qxzSWvf2Quumid2y_ozKaAHz7lfXSLROXQgiR298QNH3V4rkDOU04Fxy4fDFPwoMbxXf3Ue4gJRXfScbgMl4B7ZBDAQg-hdfTGHZJJzoolESLQTTmHm8ReiWtnyaqoCXbpSKCXGodlgb_x0D6ukRS1PnIu5hyzQbu4Yc74PTqF8oZJ-2eViwFX4vopdDNAZXF1o"
                />
                <ProductHoverActions
                  product={{
                    id: "millennial-clothing-poplin-weekend-shirt",
                    name: "Poplin Weekend Shirt",
                    price: 95,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfBVUdlMhOzES7xCn2DHdwZjBR9uR90T27qqwVtx-zTZHIDQebZWNCU-RuwOnfxLZKaSluKDgz2qxzSWvf2Quumid2y_ozKaAHz7lfXSLROXQgiR298QNH3V4rkDOU04Fxy4fDFPwoMbxXf3Ue4gJRXfScbgMl4B7ZBDAQg-hdfTGHZJJzoolESLQTTmHm8ReiWtnyaqoCXbpSKCXGodlgb_x0D6ukRS1PnIu5hyzQbu4Yc74PTqF8oZJ-2eViwFX4vopdDNAZXF1o",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="font-sans text-sm text-[#827476]">Essential Series</p>
                <h3 className="font-serif text-lg">Poplin Weekend Shirt</h3>
                <p className="font-serif text-[#7b535c] font-medium">₹95.00</p>
              </div>
            </Link>

            <Link className="group cursor-pointer mt-0 lg:mt-12 block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  alt="High waisted wide leg denim in a light wash presented on a minimal stone surface"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPG83k4Q863hZfeYy8qqet-8ofZUQsAS5lG8DtZk8CNP15fC8ch7c-hYgcwwA-5XC_uqIE-d7dpDXLklxMKjtD6L_qfE8_aQGs7QHnFXS8ud3xrwhSroZf_p2lH-CcXNylBehwwU4A3U2LPWiePBUU8A1qCkhoAdpMVFEezG7Nu5fkkqb-9H0xxKusDNfSjQNLXCjt8nsQD4C8EqhI6j0xdB92laZgJWlY6bM0E4rfG3ZlmMndfLPwwQJvGPHBHajwUGlCWtYhHnfa"
                />
                <ProductHoverActions
                  product={{
                    id: "millennial-clothing-wide-leg-raw-denim",
                    name: "Wide Leg Raw Denim",
                    price: 155,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPG83k4Q863hZfeYy8qqet-8ofZUQsAS5lG8DtZk8CNP15fC8ch7c-hYgcwwA-5XC_uqIE-d7dpDXLklxMKjtD6L_qfE8_aQGs7QHnFXS8ud3xrwhSroZf_p2lH-CcXNylBehwwU4A3U2LPWiePBUU8A1qCkhoAdpMVFEezG7Nu5fkkqb-9H0xxKusDNfSjQNLXCjt8nsQD4C8EqhI6j0xdB92laZgJWlY6bM0E4rfG3ZlmMndfLPwwQJvGPHBHajwUGlCWtYhHnfa",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="font-sans text-sm text-[#827476]">Modern Denim</p>
                <h3 className="font-serif text-lg">Wide Leg Raw Denim</h3>
                <p className="font-serif text-[#7b535c] font-medium">₹155.00</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="bg-[#fff1e7] py-24 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col items-center mb-16 text-center">
              <span className="font-sans text-xs tracking-widest text-[#526442] uppercase font-semibold mb-4">The Finishing Touches</span>
              <h2 className="font-serif text-4xl text-[#211a13] mb-4">Accessories</h2>
              <p className="font-sans text-[#827476] max-w-md">Small details that define the aesthetic of the modern atelier.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <Link className="group bg-[#fff8f4] p-6 rounded-lg editorial-shadow transition-all hover:-translate-y-2 block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-6">
                  <img
                    alt="Luxury leather handbag in warm terracotta tone with gold hardware on a minimalist pedestal"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSpb5Xo2mLYWYzEbYUyDPunFWZboVHcq3rQSKHMwrDofl8hIQMW2ARJJP5PuC0NL0xjeAOdzgDXQQm6U2wziwer5U3HU7ynSahLy4SkuHQ1IQiuMagCGZm3IcBpHd9L68PbVQvNT-b8ZV1cXKuL_lyTSBGud7a-V4XcCMUHKoPSzI3wOgRINVGSMFTONswI5WuoxeiuQatzG6vphSd2Io12eaIVIVi6RIAQv9xYmIqkxjS0BuYKgxzG3zxX9wofp1xq2DSQ2I0t-Bz"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-accessories-sculptural-leather-tote",
                      name: "Sculptural Leather Tote",
                      price: 320,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSpb5Xo2mLYWYzEbYUyDPunFWZboVHcq3rQSKHMwrDofl8hIQMW2ARJJP5PuC0NL0xjeAOdzgDXQQm6U2wziwer5U3HU7ynSahLy4SkuHQ1IQiuMagCGZm3IcBpHd9L68PbVQvNT-b8ZV1cXKuL_lyTSBGud7a-V4XcCMUHKoPSzI3wOgRINVGSMFTONswI5WuoxeiuQatzG6vphSd2Io12eaIVIVi6RIAQv9xYmIqkxjS0BuYKgxzG3zxX9wofp1xq2DSQ2I0t-Bz",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <h3 className="font-serif text-xl mb-1">Sculptural Leather Tote</h3>
                <p className="font-serif text-[#7b535c] mb-4">₹320.00</p>
                <div className="w-full py-2 border border-[#d4c2c5] rounded-md font-sans text-xs uppercase tracking-widest text-center hover:bg-[#211a13] hover:text-white transition-colors">
                  Add to Bag
                </div>
              </Link>

              <Link className="group bg-[#fff8f4] p-6 rounded-lg editorial-shadow transition-all hover:-translate-y-2 block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-6">
                  <img
                    alt="Minimal gold layered necklaces resting on a white ceramic plate with gentle morning sunlight"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHZjIh7gwLaYR5k6nBiqafoxNUE_rirJfJlr30UsNN6TPpDm3HmeXSXAlWWa52WGZKkilWhnsfcbr6UsifkWDtdatFKpW7S9RpEkvNkpDFCfnccxa8LXOdvr5OR9jjZW78LoSJZ3Wytk1hSC6IFfxos94Jabey03n8mPA65aY2AI68wslGtbb5CiGGG_rPbQM8ZTf3mdFqHttteAw9OY881WRIUX7uRvTCrft7qkN0MbiFD_QsOONHF8qgseZjXS4z6-3LzeD36ZGu"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-accessories-muted-gold-links",
                      name: "Muted Gold Links",
                      price: 85,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAHZjIh7gwLaYR5k6nBiqafoxNUE_rirJfJlr30UsNN6TPpDm3HmeXSXAlWWa52WGZKkilWhnsfcbr6UsifkWDtdatFKpW7S9RpEkvNkpDFCfnccxa8LXOdvr5OR9jjZW78LoSJZ3Wytk1hSC6IFfxos94Jabey03n8mPA65aY2AI68wslGtbb5CiGGG_rPbQM8ZTf3mdFqHttteAw9OY881WRIUX7uRvTCrft7qkN0MbiFD_QsOONHF8qgseZjXS4z6-3LzeD36ZGu",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <h3 className="font-serif text-xl mb-1">Muted Gold Links</h3>
                <p className="font-serif text-[#7b535c] mb-4">₹85.00</p>
                <div className="w-full py-2 border border-[#d4c2c5] rounded-md font-sans text-xs uppercase tracking-widest text-center hover:bg-[#211a13] hover:text-white transition-colors">
                  Add to Bag
                </div>
              </Link>

              <Link className="group bg-[#fff8f4] p-6 rounded-lg editorial-shadow transition-all hover:-translate-y-2 block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-6">
                  <img
                    alt="Transparent cat-eye glasses with rose gold details sitting on an open art book"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPBQhrfmRK3a_rNDiZC-yokmSqEcZfw2g0HOhH0_TRBPEfRGLKDBWQyCuE4a0i1-bvRvLIUbuqhwnX2mhYLNEbDVLNWeQP_DsHSr8SmANT9ZqKikdhSKychMutXDIAxl4VLNFdoIhD16-7a-FX_Rsuu2oH5LgqD4j2nrvlvh4zkAxG0QC0qkhc1l011HUIY--sIxYTKk6ON_NVJYIp0QAt8K1LAFN17yzVX7gsV1IgIBhJynZ6qSWQj_vaYr7CuKbG8ShBwLmuEVdb"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-accessories-optical-frame-04",
                      name: "Optical Frame 04",
                      price: 140,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPBQhrfmRK3a_rNDiZC-yokmSqEcZfw2g0HOhH0_TRBPEfRGLKDBWQyCuE4a0i1-bvRvLIUbuqhwnX2mhYLNEbDVLNWeQP_DsHSr8SmANT9ZqKikdhSKychMutXDIAxl4VLNFdoIhD16-7a-FX_Rsuu2oH5LgqD4j2nrvlvh4zkAxG0QC0qkhc1l011HUIY--sIxYTKk6ON_NVJYIp0QAt8K1LAFN17yzVX7gsV1IgIBhJynZ6qSWQj_vaYr7CuKbG8ShBwLmuEVdb",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <h3 className="font-serif text-xl mb-1">Optical Frame 04</h3>
                <p className="font-serif text-[#7b535c] mb-4">₹140.00</p>
                <div className="w-full py-2 border border-[#d4c2c5] rounded-md font-sans text-xs uppercase tracking-widest text-center hover:bg-[#211a13] hover:text-white transition-colors">
                  Add to Bag
                </div>
              </Link>
            </div>
            <div className="mt-16 text-center">
              <Link
                className="text-[#526442] font-sans text-sm border-b border-[#526442]/20 hover:border-[#526442] transition-all pb-1 uppercase tracking-widest"
                href="/accessories?generation=millennial"
              >
                View All Accessories
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-8 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-6">
              <span className="font-sans text-xs tracking-widest text-[#7b535c] uppercase font-semibold">Street Sophistication</span>
              <h2 className="font-serif text-5xl text-[#211a13] leading-tight">Sneakers Redefined</h2>
              <p className="font-sans text-[#827476] leading-relaxed">
                Merging comfort with an elevated aesthetic. Our curated footwear collection prioritizes sustainable materials and timeless
                silhouettes.
              </p>
              <Link
                className="bg-[#7b535c] text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide hover:opacity-90 transition-all editorial-shadow inline-block"
                href="/sneakers?generation=millennial"
              >
                View More
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Link className="relative bg-[#f5e6da] rounded-xl overflow-hidden aspect-[4/5] group block" href="/sneakers/nova-form-strider">
                  <img
                    alt="Minimalist white leather sneakers with gum sole on a clean grey concrete background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiDc3wXTF3CwZbB-zJ301OKh0puZmNqOhPwrtIEGb97rAiPTUZsMFXOP2ftvDBe4jGZKK89iYDrOMxveCc28FUp_da02scODCTHA-V99_cxO7aHJEV-v7_URSnlXwW7KF41JuflBUzBAhxjEwUdNdlka2A6QKeeMzbxTbdRKZbVjCCO5GUZfNOegWvPG2nx1knK5NtbKLR9hzhd8QrY0c0-_ZoCjjQm2LGcb1MLhcIRQZ3EiBojZNqgPKCsClvy3Qdkj0CKVKay8Ze"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-sneakers-urban-minimalist-leather-low",
                      name: "Urban Minimalist Leather Low",
                      price: 165,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDiDc3wXTF3CwZbB-zJ301OKh0puZmNqOhPwrtIEGb97rAiPTUZsMFXOP2ftvDBe4jGZKK89iYDrOMxveCc28FUp_da02scODCTHA-V99_cxO7aHJEV-v7_URSnlXwW7KF41JuflBUzBAhxjEwUdNdlka2A6QKeeMzbxTbdRKZbVjCCO5GUZfNOegWvPG2nx1knK5NtbKLR9hzhd8QrY0c0-_ZoCjjQm2LGcb1MLhcIRQZ3EiBojZNqgPKCsClvy3Qdkj0CKVKay8Ze",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </Link>
                <Link className="relative bg-[#f5e6da] rounded-xl overflow-hidden aspect-square group block" href="/sneakers/nova-form-strider">
                  <img
                    alt="Pastel pink and white trainer sneaker shot from a low angle on a soft beige surface"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9fjI2UTroBwVXNVCzuhJ64i9IyLBbKqIFen1Q8n4aKKSp8kSg3ru5LWSGkloK49zyoMtuJv--vio7K39O_Ad1lWdA43bYw_R_jaDY_jdr9s_q6EDWo28y9Khrm8il1wf1sTD1aO-WoxtCcJC-q9wtFQLLYripU8FeKuyj1kexfvEcWYCTJUIDtRJlB4rvyKzSWaTd0R1IRdU6eihm4zVq6Mpyq8SwYy8AwYLF2Kz6IZA8VcqJQWRt2btbJck2wrBwiY-4uSDt6jps"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-sneakers-pastel-pink-runners",
                      name: "Pastel Pink Runners",
                      price: 140,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9fjI2UTroBwVXNVCzuhJ64i9IyLBbKqIFen1Q8n4aKKSp8kSg3ru5LWSGkloK49zyoMtuJv--vio7K39O_Ad1lWdA43bYw_R_jaDY_jdr9s_q6EDWo28y9Khrm8il1wf1sTD1aO-WoxtCcJC-q9wtFQLLYripU8FeKuyj1kexfvEcWYCTJUIDtRJlB4rvyKzSWaTd0R1IRdU6eihm4zVq6Mpyq8SwYy8AwYLF2Kz6IZA8VcqJQWRt2btbJck2wrBwiY-4uSDt6jps",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </Link>
              </div>
              <div className="pt-12 space-y-6">
                <Link className="relative bg-[#f5e6da] rounded-xl overflow-hidden aspect-square group block" href="/sneakers/nova-form-strider">
                  <img
                    alt="Beige suede lifestyle sneakers against a warm textured plaster wall"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6-THRwN-LcgfkIC5L0nHaDWAXMaUzoaqE5uTsE_lS4VphEEtoLNedRPdwKDdORmRHkBKcTzU0vicLASA0v5cx6rJRevkSofwPSUMFiI56D1qttp4seJyEqqJcYWNBzOrBtGWzkJm29A7LN9nK-EpAoXZ_7H1VD97pNbt_YGzFZbZ4M3oXfsT8Be-g_mgIC84X_VipQw6HnA1lcarmj1LhSBHvR8s1xDMlBIqMDA9Z5Ra2Z4JxFM-Gd41cg-ojQCOh9Ah81wiOcD1u"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-sneakers-beige-suede-lifestyle",
                      name: "Beige Suede Lifestyle",
                      price: 170,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuC6-THRwN-LcgfkIC5L0nHaDWAXMaUzoaqE5uTsE_lS4VphEEtoLNedRPdwKDdORmRHkBKcTzU0vicLASA0v5cx6rJRevkSofwPSUMFiI56D1qttp4seJyEqqJcYWNBzOrBtGWzkJm29A7LN9nK-EpAoXZ_7H1VD97pNbt_YGzFZbZ4M3oXfsT8Be-g_mgIC84X_VipQw6HnA1lcarmj1LhSBHvR8s1xDMlBIqMDA9Z5Ra2Z4JxFM-Gd41cg-ojQCOh9Ah81wiOcD1u",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </Link>
                <Link className="relative bg-[#f5e6da] rounded-xl overflow-hidden aspect-[4/5] group block" href="/sneakers/nova-form-strider">
                  <img
                    alt="High top canvas sneakers in a muted sage green color arranged neatly on a wooden floor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-cKwQ5OJLyQeQBTSIJYiS_trb45M76nSLIkcrX_c0NR4TdU_DzUVYOHyMU2lNIZBqj7s0SM_5jeAX9_cYfNTlMbdxTTyvcwG1tQ4f1xaDkk3RXemizQHV1o1HkTMNqZP2ge0JNShyGm6s_lhWEMkZOh7T_5uC1zOh1EkeRYOr6oQDRNAg8gmGIxA1FFgZJEaZK73SWbXvbFhT_Pcccw2cfacgcN9XZm5IsTQwr9igisxzwj3MyFUvpNosuLm8riljDJRz39tXD5Tj"
                  />
                  <ProductHoverActions
                    product={{
                      id: "millennial-sneakers-high-top-canvas-sage",
                      name: "High Top Canvas Sage",
                      price: 175,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cKwQ5OJLyQeQBTSIJYiS_trb45M76nSLIkcrX_c0NR4TdU_DzUVYOHyMU2lNIZBqj7s0SM_5jeAX9_cYfNTlMbdxTTyvcwG1tQ4f1xaDkk3RXemizQHV1o1HkTMNqZP2ge0JNShyGm6s_lhWEMkZOh7T_5uC1zOh1EkeRYOr6oQDRNAg8gmGIxA1FFgZJEaZK73SWbXvbFhT_Pcccw2cfacgcN9XZm5IsTQwr9igisxzwj3MyFUvpNosuLm8riljDJRz39tXD5Tj",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8 bg-[#faebdf]">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="relative z-10 rounded-lg overflow-hidden editorial-shadow">
                <img
                  alt="A collection of high-end fashion magazines and fabric swatches on a clean wooden table with soft side lighting"
                  className="w-full aspect-[4/5] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLAn2pOArMGtUeFubAZSLy7i5h4j3afuJUe4BKNqnTPUwCu3VZbZTl882i9_-4PpGzlYDkGbtMs_pNIQsQoCz-wDWQZNhtd8pPljWBBYhqf2g0FheY23MXhotUZ1AHg_is_vs_UINJrwV4X5NLkY5hNc3Y97HduRYUgkN1bSiMsHENPFByPtE0SBN4JqxYQNILb4ZRSy00hUA-lmlP-v7WS5xoudf7vPg0yO_KxyQQv51RqydurRZGQmQwEDS_SdxxBF154pQwHpU5"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#d8a7b1]/30 rounded-full blur-3xl -z-10"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <span className="font-sans text-xs tracking-widest text-[#504446] uppercase">Atelier Journal</span>
              <h2 className="font-serif text-5xl italic text-[#211a13]">Sustainability in Every Stitch</h2>
              <p className="font-sans text-[#504446] text-lg leading-relaxed">
                We believe that beautiful clothing shouldn&apos;t cost the Earth. Discover how we partner with ethical artisans to bring you pieces
                that are as kind as they are chic.
              </p>
              <a className="inline-flex items-center space-x-4 text-[#7b535c] font-serif italic text-xl group" href="#">
                <span>Read the Full Story</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_right_alt</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .font-serif {
          font-family: "Noto Serif", serif;
        }

        .font-sans {
          font-family: "Inter", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
        }

        .editorial-shadow {
          box-shadow: 0 10px 32px 0 rgba(33, 26, 19, 0.06);
        }

        .bg-primary-gradient {
          background: linear-gradient(135deg, #7b535c 0%, #d8a7b1 100%);
        }
      `}</style>
    </div>
  );
}


