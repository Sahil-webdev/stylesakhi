"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductHoverActions from "@/components/ProductHoverActions";
import BannerCarousel from "@/components/BannerCarousel";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { defaultGenerationBanners, fetchBannerConfig, type BannerItem } from "@/lib/banner-config";

export default function BoomersPage() {
  const [banners, setBanners] = useState<BannerItem[]>(() => defaultGenerationBanners["boomer"]);

  useEffect(() => {
    let active = true;
    const loadBanners = async () => {
      try {
        const config = await fetchBannerConfig();
        if (active) setBanners(config.generationBanners["boomer"]);
      } catch {
        // Keep fallback data
      }
    };
    void loadBanners();
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="bg-[#fff8f1] text-[#1e1b17] font-body selection:bg-[#ffdad7]">
      <Navbar />

      <main className="pt-16">
        <section>
          <BannerCarousel banners={banners} autoPlayInterval={4000} />
        </section>

        <section className="border-y border-[#b8dff5]/70 bg-[#eaf6ff] py-6 md:py-7">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              <div className="rounded-xl border border-[#c7e4f6] bg-white/70 p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-[#e9f3ff] p-2 text-[20px] text-[#004490]">local_shipping</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-headline font-bold text-[#1e1b17]">Free Shipping</h3>
                    <p className="truncate text-xs text-[#434751]">Orders over ₹75 in USA</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#c7e4f6] bg-white/70 p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-[#e9f3ff] p-2 text-[20px] text-[#004490]">assignment_return</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-headline font-bold text-[#1e1b17]">Easy Returns</h3>
                    <p className="truncate text-xs text-[#434751]">30-day hassle-free policy</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 rounded-xl border border-[#c7e4f6] bg-white/70 p-3 md:col-span-1 md:p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-[#e9f3ff] p-2 text-[20px] text-[#004490]">verified_user</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-headline font-bold text-[#1e1b17]">Secure Checkout</h3>
                    <p className="truncate text-xs text-[#434751]">Your data stays protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
            <h2 className="font-headline text-[1.8rem] text-[#1e1b17] sm:text-4xl">Clothing</h2>
            <Link className="text-[#004490] font-bold border-b border-[#004490] pb-1 hover:text-[#ac3231] hover:border-[#ac3231] transition-colors" href="/clothing?generation=boomer">
              View All Clothing
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[4/5] bg-[#e8e1da] rounded-lg overflow-hidden mb-4">
                <img
                  alt="Sophisticated light grey cashmere cardigan draped over a chair in a bright airy room with soft natural lighting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUeRIK9XuNinJ8luNk9euKcRKE9ZA7DhOVi-ZpkdpwWfe7XQbGt-1_TJbtzqIf2jbpZ4yqcSsFtlhDzSt-c5qt1ChbzrgSEXky1gsS3gZeoNMtM5I2aNVD5wjzlApFI3CeqjLwkzD8IpjCOgRz-dLpWt8SCiHwGtJby_IHnP6fK2hziMsumztiUKuwZCZc0eH1tPXDa6HyqrjpcmwsudPoQoUBQNkj6ZWihqVJGYQvN0vm-GyHI8-C0-VCn3H0KSobfyPGoeWBVSjw"
                />
                <ProductHoverActions
                  product={{
                    id: "boomers-clothing-essential-cashmere-cardigan",
                    name: "Essential Cashmere Cardigan",
                    price: 128,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUeRIK9XuNinJ8luNk9euKcRKE9ZA7DhOVi-ZpkdpwWfe7XQbGt-1_TJbtzqIf2jbpZ4yqcSsFtlhDzSt-c5qt1ChbzrgSEXky1gsS3gZeoNMtM5I2aNVD5wjzlApFI3CeqjLwkzD8IpjCOgRz-dLpWt8SCiHwGtJby_IHnP6fK2hziMsumztiUKuwZCZc0eH1tPXDa6HyqrjpcmwsudPoQoUBQNkj6ZWihqVJGYQvN0vm-GyHI8-C0-VCn3H0KSobfyPGoeWBVSjw",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Essential Cashmere Cardigan</h3>
              <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Heather Grey</p>
              <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹128.00</p>
            </Link>
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[4/5] bg-[#e8e1da] rounded-lg overflow-hidden mb-4">
                <img
                  alt="Wide-leg linen trousers in soft sand color hanging on a minimalist wooden rail against a cream textured wall"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdgSwt3VUN7Ok-rXXdd6B0BpO_HsBC956z2Rqna8JRiefKCaX0W3S7K5XmXvlQ0Y2o6dpbm7Eo2Y_MNiXT5ZpOiTD0L0Y3WQ09F0V1B0yn56GJfoGJraExfpRCwfNA2CPymPFELV13bqfLYYt2LvKO_hgy7eNCX3dR5fMM9fRNlhGmUaeveVG8vMENxDat5by7_jnua0eZ42UUx9X44VnVMXHujvcVjTnCQ1B9sGBw3z-60wOiywH2YviSaZDr7MmepX4_Q_co32Fa"
                />
                <ProductHoverActions
                  product={{
                    id: "boomers-clothing-easy-fit-linen-trousers",
                    name: "Easy-Fit Linen Trousers",
                    price: 89,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdgSwt3VUN7Ok-rXXdd6B0BpO_HsBC956z2Rqna8JRiefKCaX0W3S7K5XmXvlQ0Y2o6dpbm7Eo2Y_MNiXT5ZpOiTD0L0Y3WQ09F0V1B0yn56GJfoGJraExfpRCwfNA2CPymPFELV13bqfLYYt2LvKO_hgy7eNCX3dR5fMM9fRNlhGmUaeveVG8vMENxDat5by7_jnua0eZ42UUx9X44VnVMXHujvcVjTnCQ1B9sGBw3z-60wOiywH2YviSaZDr7MmepX4_Q_co32Fa",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Easy-Fit Linen Trousers</h3>
              <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Sand Dune</p>
              <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹89.00</p>
            </Link>
            <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
              <div className="relative aspect-[4/5] bg-[#e8e1da] rounded-lg overflow-hidden mb-4">
                <img
                  alt="Navy blue silk blouse with delicate button detailing close-up showing soft fabric drape and subtle sheen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqgip-PZ73yUxeFDH8F6eh0jZifPOyCm1hsBkJV_k1sOMltiOmH6wcJSy6BUfaVlSd7L0cfSkFer5Y5-9nQ7UEvKpmNInk3hNtS-1Fj2bUK3TWoNqABIxItqYJV1j5TumVRXInfKoVkwQYJ1vIG59BxobcCOntSmYFP9dJhXu8hkDFD6u8XOzmrplv-bt_VhsnqKg6JSoGPgfP5rNtD610jZTzm4MQ2b9JJyQjBtpNuDCMoc0HQg0zQcMPLRV1i0jyv0_MmnurCx_Z"
                />
                <ProductHoverActions
                  product={{
                    id: "boomers-clothing-classic-silk-button-down",
                    name: "Classic Silk Button-Down",
                    price: 145,
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqgip-PZ73yUxeFDH8F6eh0jZifPOyCm1hsBkJV_k1sOMltiOmH6wcJSy6BUfaVlSd7L0cfSkFer5Y5-9nQ7UEvKpmNInk3hNtS-1Fj2bUK3TWoNqABIxItqYJV1j5TumVRXInfKoVkwQYJ1vIG59BxobcCOntSmYFP9dJhXu8hkDFD6u8XOzmrplv-bt_VhsnqKg6JSoGPgfP5rNtD610jZTzm4MQ2b9JJyQjBtpNuDCMoc0HQg0zQcMPLRV1i0jyv0_MmnurCx_Z",
                    category: "Clothing",
                    href: "/clothing/the-atelier-trench",
                  }}
                />
              </div>
              <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Classic Silk Button-Down</h3>
              <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Deep Navy</p>
              <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹145.00</p>
            </Link>
          </div>
          <div className="mt-16 text-center">
            <Link className="bg-[#004490] inline-block text-white px-12 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/clothing?generation=boomer">
              View More Clothing
            </Link>
          </div>
        </section>

        <section className="bg-[#f9f3eb] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
              <h2 className="font-headline text-[1.8rem] text-[#1e1b17] sm:text-4xl">Accessories</h2>
              <Link className="text-[#004490] font-bold border-b border-[#004490] pb-1 hover:text-[#ac3231] hover:border-[#ac3231] transition-colors" href="/accessories?generation=boomer">
                View All Accessories
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              <Link className="group cursor-pointer block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Handcrafted leather tote bag in warm cognac brown sitting on a rustic stone bench with soft afternoon sun shadows"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg-jt_wCKw3m7Ah4EulZ6ndotlJ4MJcceVi485hBKc0JBHUxHNkLcvOZxFXgGcXN2xKf9Xe2ujQiPjG98lakQ_0ucU6CObCk66vOSNkRFhbO33xv4kvX3q_rPs1Ak6blcROuwNkcUWkJ9NlWxUdETsLKuLBLRXetXWSkJnkSI3u8CrGZgPPhs-A1bm9DSmr3eud6zepVBtup53B-poIn0i8GAIegeJtwiTlT7dNehurcMKk8K3E1JnUY-Wj_ynfMjlp9db1td9fDS3"
                  />
                  <ProductHoverActions product={{ id: "boomers-accessories-hand-stitched-leather-tote", name: "Hand-Stitched Leather Tote", price: 210, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-jt_wCKw3m7Ah4EulZ6ndotlJ4MJcceVi485hBKc0JBHUxHNkLcvOZxFXgGcXN2xKf9Xe2ujQiPjG98lakQ_0ucU6CObCk66vOSNkRFhbO33xv4kvX3q_rPs1Ak6blcROuwNkcUWkJ9NlWxUdETsLKuLBLRXetXWSkJnkSI3u8CrGZgPPhs-A1bm9DSmr3eud6zepVBtup53B-poIn0i8GAIegeJtwiTlT7dNehurcMKk8K3E1JnUY-Wj_ynfMjlp9db1td9fDS3", category: "Accessories", href: "/accessories/croissant-leather-bag" }} />
                </div>
                <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Hand-Stitched Leather Tote</h3>
                <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Cognac Brown</p>
                <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹210.00</p>
              </Link>
              <Link className="group cursor-pointer block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Beautifully patterned silk scarf in muted floral tones laid flat on a white marble surface with a gold jewelry tray"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6e-oExkALBJFibTu4sNBE4N6w3fmdU8H_BVej7t7wWDiR7EOa66dbMFVtE0hSKsgibWZyVJqvHJY4rAP0uxKDaoJ015TSs0V70qCqpdSSaicLQujXfW3OQ7NeUdgzZ2eyuTR7-xx_3ZOChxd8oG-FnBySzCfljizCkGX33LSmEqJzddR7xaX9SZbzC-PyRmFJhJON2EFl_kF3DImnUEswbYbmdfAHmRrNJSrWqBBsoiZ884VZ09X0HTW4J_gX73dr7L9e1x6Z83k1"
                  />
                  <ProductHoverActions product={{ id: "boomers-accessories-heritage-floral-silk-scarf", name: "Heritage Floral Silk Scarf", price: 55, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6e-oExkALBJFibTu4sNBE4N6w3fmdU8H_BVej7t7wWDiR7EOa66dbMFVtE0hSKsgibWZyVJqvHJY4rAP0uxKDaoJ015TSs0V70qCqpdSSaicLQujXfW3OQ7NeUdgzZ2eyuTR7-xx_3ZOChxd8oG-FnBySzCfljizCkGX33LSmEqJzddR7xaX9SZbzC-PyRmFJhJON2EFl_kF3DImnUEswbYbmdfAHmRrNJSrWqBBsoiZ884VZ09X0HTW4J_gX73dr7L9e1x6Z83k1", category: "Accessories", href: "/accessories/croissant-leather-bag" }} />
                </div>
                <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Heritage Floral Silk Scarf</h3>
                <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Rose &amp; Sage</p>
                <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹55.00</p>
              </Link>
              <Link className="group cursor-pointer block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Elegant gold rimmed reading glasses resting on an open book next to a warm cup of tea"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNOhtu7R58uFsyNpMjr46boKRNPUwKT7UHuxsJWciDe3x1LJfhTriOeXD6Xdpm_7VHQQ37W4qJ3ScU-VYUP0c9v4_ogX4BaTuhBdc-RTJNY80Hrnn9QnL3fgTg9kXSD-q2kdFNfAOukqgu0na8KYqmZFVGEseIk01k9RYGFqM-Ut7fi7wLHR21rgTIDkxDflglIDnfy1Ptyjk2eofpuhFv9Y50V0gZ1-4U2x0Ge9UkjvSdoZUCy1m2nv7R0md_fe4sXmQNur1HZW0C"
                  />
                  <ProductHoverActions product={{ id: "boomers-accessories-lightweight-reading-frames", name: "Lightweight Reading Frames", price: 78, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNOhtu7R58uFsyNpMjr46boKRNPUwKT7UHuxsJWciDe3x1LJfhTriOeXD6Xdpm_7VHQQ37W4qJ3ScU-VYUP0c9v4_ogX4BaTuhBdc-RTJNY80Hrnn9QnL3fgTg9kXSD-q2kdFNfAOukqgu0na8KYqmZFVGEseIk01k9RYGFqM-Ut7fi7wLHR21rgTIDkxDflglIDnfy1Ptyjk2eofpuhFv9Y50V0gZ1-4U2x0Ge9UkjvSdoZUCy1m2nv7R0md_fe4sXmQNur1HZW0C", category: "Accessories", href: "/accessories/croissant-leather-bag" }} />
                </div>
                <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Lightweight Reading Frames</h3>
                <p className="mb-1 text-xs text-[#434751] sm:mb-2 sm:text-base">Classic Gold</p>
                <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹78.00</p>
              </Link>
            </div>
            <div className="mt-16 text-center">
              <Link className="bg-[#004490] inline-block text-white px-12 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/accessories?generation=boomer">
                View More Accessories
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:mb-16 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-1">
              <h2 className="mb-4 font-headline text-[1.8rem] text-[#1e1b17] sm:mb-6 sm:text-4xl">Sneakers Built for Comfort</h2>
              <p className="text-[#434751] mb-8 leading-relaxed">
                Say goodbye to sore feet. Our sneaker collection features orthotic-friendly insoles, breathable fabrics, and slip-resistant soles
                without compromising on style.
              </p>
              <Link className="bg-[#004490] inline-block text-white px-10 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/sneakers?generation=boomer">
                View All Sneakers
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:col-span-2 lg:gap-8">
              <Link className="group cursor-pointer block" href="/sneakers/nova-form-strider">
                <div className="relative aspect-[4/3] bg-[#eee7df] rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Minimalist white leather sneakers with soft cushioned collars and flat soles against a clean neutral background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDgdQQvsycPGbV8jIeagAj9a6g87EQSOsFhnXcfWGBrv_TipcUZVkJkGKjq80lFo6MR4oZhD3wuILDwLxo0PztpsvNCYPnlAdqEtbdJ5dFHji9FAL961W5lA1saVD69FIzVkP5dQx2JP1xlcqJeXz6COwoYbUTn1CIGgiW3p-mxP3H4rrdJIaK5J_iMw5kseoJhIafZBuB8SnyDjNvY-rJHEASVN_TMYiEt-ldDhxFfAaDxK7DGC3HKi1GGPVOTo7062BUxdVwUgN2"
                  />
                  <ProductHoverActions product={{ id: "boomers-sneakers-cloudwalk-leather-trainer", name: "CloudWalk Leather Trainer", price: 115, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDgdQQvsycPGbV8jIeagAj9a6g87EQSOsFhnXcfWGBrv_TipcUZVkJkGKjq80lFo6MR4oZhD3wuILDwLxo0PztpsvNCYPnlAdqEtbdJ5dFHji9FAL961W5lA1saVD69FIzVkP5dQx2JP1xlcqJeXz6COwoYbUTn1CIGgiW3p-mxP3H4rrdJIaK5J_iMw5kseoJhIafZBuB8SnyDjNvY-rJHEASVN_TMYiEt-ldDhxFfAaDxK7DGC3HKi1GGPVOTo7062BUxdVwUgN2", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
                </div>
                <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">CloudWalk Leather Trainer</h3>
                <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹115.00</p>
              </Link>
              <Link className="group cursor-pointer block" href="/sneakers/nova-form-strider">
                <div className="relative aspect-[4/3] bg-[#eee7df] rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Comfortable slip-on mesh sneakers in a soft mauve color with white ergonomic soles for everyday walking"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXQBxyi81hcXbar5t5DnMu-spV2H8ZxI2tqZhAnaXsbVeWMfLq4rrFWRzQ3UCeCJFCbAI3QURevrrI130VaZQHw5XevXJ6nbo5qipKaqJZD8YJVFg_c4c-EkUUuiBJnYKxxGlrNixXudy1hI48-hoOIpSzlf3P8WCgD-Bz3qf19KeFDN3pnwbWUYW714ybrEQoUMo37KrMUGObd33_sEwYiGgLUBU7gxc5H74h37mJtgw2jyHzwqL2sqMBfmy-WazEuFdifhe1tpV_"
                  />
                  <ProductHoverActions product={{ id: "boomers-sneakers-air-mesh-comfort-slip-on", name: "Air-Mesh Comfort Slip-On", price: 95, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXQBxyi81hcXbar5t5DnMu-spV2H8ZxI2tqZhAnaXsbVeWMfLq4rrFWRzQ3UCeCJFCbAI3QURevrrI130VaZQHw5XevXJ6nbo5qipKaqJZD8YJVFg_c4c-EkUUuiBJnYKxxGlrNixXudy1hI48-hoOIpSzlf3P8WCgD-Bz3qf19KeFDN3pnwbWUYW714ybrEQoUMo37KrMUGObd33_sEwYiGgLUBU7gxc5H74h37mJtgw2jyHzwqL2sqMBfmy-WazEuFdifhe1tpV_", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
                </div>
                <h3 className="mb-1 font-body text-base font-semibold leading-tight text-[#1e1b17] sm:text-xl">Air-Mesh Comfort Slip-On</h3>
                <p className="text-sm font-bold text-[#ac3231] sm:text-lg">₹95.00</p>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <Link className="bg-[#004490] inline-block text-white px-12 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/sneakers?generation=boomer">
              View More Sneakers
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton bgColorClass="bg-[#004490]" shadowClass="shadow-[0_10px_30px_rgba(0,68,144,0.35)]" />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:opsz,ital,wght@6..72,0,200..800;6..72,1,200..800&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .font-headline {
          font-family: "Newsreader", serif;
        }

        .font-body {
          font-family: "Public Sans", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}






