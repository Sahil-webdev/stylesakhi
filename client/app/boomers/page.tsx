"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductHoverActions from "@/components/ProductHoverActions";
import BannerCarousel from "@/components/BannerCarousel";
import GenerationHighestSelling from "@/components/GenerationHighestSelling";
import type { HighestSellingProduct } from "@/components/HighestSellingProducts";

export default function BoomersPage() {
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
      alt: "Boomers Collection Banner 1",
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
      alt: "Boomers Collection Banner 2",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
      alt: "Boomers Collection Banner 3",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
      alt: "Boomers Collection Banner 4",
    },
  ];
  const bestsellers: HighestSellingProduct[] = [
    {
      id: "boomers-bestseller-essential-cashmere-cardigan",
      name: "Essential Cashmere Cardigan",
      price: 128,
      priceLabel: "Rs. 128",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBUeRIK9XuNinJ8luNk9euKcRKE9ZA7DhOVi-ZpkdpwWfe7XQbGt-1_TJbtzqIf2jbpZ4yqcSsFtlhDzSt-c5qt1ChbzrgSEXky1gsS3gZeoNMtM5I2aNVD5wjzlApFI3CeqjLwkzD8IpjCOgRz-dLpWt8SCiHwGtJby_IHnP6fK2hziMsumztiUKuwZCZc0eH1tPXDa6HyqrjpcmwsudPoQoUBQNkj6ZWihqVJGYQvN0vm-GyHI8-C0-VCn3H0KSobfyPGoeWBVSjw",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Bestseller",
      rating: "4.9",
      soldLabel: "640 sold",
      note: "Soft comfort",
    },
    {
      id: "boomers-bestseller-hand-stitched-leather-tote",
      name: "Hand-Stitched Leather Tote",
      price: 210,
      priceLabel: "Rs. 210",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-jt_wCKw3m7Ah4EulZ6ndotlJ4MJcceVi485hBKc0JBHUxHNkLcvOZxFXgGcXN2xKf9Xe2ujQiPjG98lakQ_0ucU6CObCk66vOSNkRFhbO33xv4kvX3q_rPs1Ak6blcROuwNkcUWkJ9NlWxUdETsLKuLBLRXetXWSkJnkSI3u8CrGZgPPhs-A1bm9DSmr3eud6zepVBtup53B-poIn0i8GAIegeJtwiTlT7dNehurcMKk8K3E1JnUY-Wj_ynfMjlp9db1td9fDS3",
      category: "Accessories",
      href: "/accessories/croissant-leather-bag",
      badge: "Most gifted",
      rating: "4.8",
      soldLabel: "510 sold",
      note: "Daily carry",
    },
    {
      id: "boomers-bestseller-cloudwalk-leather-trainer",
      name: "CloudWalk Leather Trainer",
      price: 115,
      priceLabel: "Rs. 115",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCDgdQQvsycPGbV8jIeagAj9a6g87EQSOsFhnXcfWGBrv_TipcUZVkJkGKjq80lFo6MR4oZhD3wuILDwLxo0PztpsvNCYPnlAdqEtbdJ5dFHji9FAL961W5lA1saVD69FIzVkP5dQx2JP1xlcqJeXz6COwoYbUTn1CIGgiW3p-mxP3H4rrdJIaK5J_iMw5kseoJhIafZBuB8SnyDjNvY-rJHEASVN_TMYiEt-ldDhxFfAaDxK7DGC3HKi1GGPVOTo7062BUxdVwUgN2",
      category: "Sneakers",
      href: "/sneakers/nova-form-strider",
      badge: "Comfort pick",
      rating: "4.9",
      soldLabel: "470 sold",
      note: "Walk ready",
    },
    {
      id: "boomers-bestseller-classic-silk-button-down",
      name: "Classic Silk Button-Down",
      price: 145,
      priceLabel: "Rs. 145",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqgip-PZ73yUxeFDH8F6eh0jZifPOyCm1hsBkJV_k1sOMltiOmH6wcJSy6BUfaVlSd7L0cfSkFer5Y5-9nQ7UEvKpmNInk3hNtS-1Fj2bUK3TWoNqABIxItqYJV1j5TumVRXInfKoVkwQYJ1vIG59BxobcCOntSmYFP9dJhXu8hkDFD6u8XOzmrplv-bt_VhsnqKg6JSoGPgfP5rNtD610jZTzm4MQ2b9JJyQjBtpNuDCMoc0HQg0zQcMPLRV1i0jyv0_MmnurCx_Z",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Top rated",
      rating: "4.7",
      soldLabel: "430 sold",
      note: "Polished look",
    },
  ];
  return (
    <div className="bg-[#fff8f1] text-[#1e1b17] font-body selection:bg-[#ffdad7]">
      <Navbar />

      <main className="pt-16">
        <section className="px-4">
          <div className="max-w-[1265px] mx-auto">
            <BannerCarousel banners={banners} autoPlayInterval={4000} />
          </div>
        </section>

        <section className="bg-[#eaf6ff] py-7 border-y border-[#b8dff5]/70">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[#004490] text-3xl">local_shipping</span>
              <h3 className="text-lg font-headline font-bold">Free Shipping</h3>
              <p className="text-sm leading-relaxed text-[#434751]">On all orders over ₹75 within the USA.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[#004490] text-3xl">assignment_return</span>
              <h3 className="text-lg font-headline font-bold">Easy Returns</h3>
              <p className="text-sm leading-relaxed text-[#434751]">30-day no-hassle return policy for your peace of mind.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[#004490] text-3xl">verified_user</span>
              <h3 className="text-lg font-headline font-bold">Secure Checkout</h3>
              <p className="text-sm leading-relaxed text-[#434751]">Your privacy and security are our top priorities.</p>
            </div>
          </div>
        </section>

        <GenerationHighestSelling
          generation="boomer"
          generationLabel="Boomers"
          viewAllHref="/clothing?generation=boomer"
          backgroundClassName="bg-[#f4fbff]"
          accentClassName="bg-[#004490] text-white"
          description="Trusted classics with comfort-first details, selected from the products customers buy most often."
          fallbackProducts={bestsellers}
        />

        <section className="py-24 max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-headline text-[#1e1b17]">Clothing</h2>
            <Link className="text-[#004490] font-bold border-b border-[#004490] pb-1 hover:text-[#ac3231] hover:border-[#ac3231] transition-colors" href="/clothing?generation=boomer">
              View All Clothing
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Essential Cashmere Cardigan</h3>
              <p className="text-[#434751] mb-2">Heather Grey</p>
              <p className="text-lg font-bold text-[#ac3231]">₹128.00</p>
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
              <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Easy-Fit Linen Trousers</h3>
              <p className="text-[#434751] mb-2">Sand Dune</p>
              <p className="text-lg font-bold text-[#ac3231]">₹89.00</p>
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
              <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Classic Silk Button-Down</h3>
              <p className="text-[#434751] mb-2">Deep Navy</p>
              <p className="text-lg font-bold text-[#ac3231]">₹145.00</p>
            </Link>
          </div>
          <div className="mt-16 text-center">
            <Link className="bg-[#004490] inline-block text-white px-12 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/clothing?generation=boomer">
              View More Clothing
            </Link>
          </div>
        </section>

        <section className="py-24 bg-[#f9f3eb]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-headline text-[#1e1b17]">Accessories</h2>
              <Link className="text-[#004490] font-bold border-b border-[#004490] pb-1 hover:text-[#ac3231] hover:border-[#ac3231] transition-colors" href="/accessories?generation=boomer">
                View All Accessories
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link className="group cursor-pointer block" href="/accessories/croissant-leather-bag">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Handcrafted leather tote bag in warm cognac brown sitting on a rustic stone bench with soft afternoon sun shadows"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg-jt_wCKw3m7Ah4EulZ6ndotlJ4MJcceVi485hBKc0JBHUxHNkLcvOZxFXgGcXN2xKf9Xe2ujQiPjG98lakQ_0ucU6CObCk66vOSNkRFhbO33xv4kvX3q_rPs1Ak6blcROuwNkcUWkJ9NlWxUdETsLKuLBLRXetXWSkJnkSI3u8CrGZgPPhs-A1bm9DSmr3eud6zepVBtup53B-poIn0i8GAIegeJtwiTlT7dNehurcMKk8K3E1JnUY-Wj_ynfMjlp9db1td9fDS3"
                  />
                  <ProductHoverActions product={{ id: "boomers-accessories-hand-stitched-leather-tote", name: "Hand-Stitched Leather Tote", price: 210, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-jt_wCKw3m7Ah4EulZ6ndotlJ4MJcceVi485hBKc0JBHUxHNkLcvOZxFXgGcXN2xKf9Xe2ujQiPjG98lakQ_0ucU6CObCk66vOSNkRFhbO33xv4kvX3q_rPs1Ak6blcROuwNkcUWkJ9NlWxUdETsLKuLBLRXetXWSkJnkSI3u8CrGZgPPhs-A1bm9DSmr3eud6zepVBtup53B-poIn0i8GAIegeJtwiTlT7dNehurcMKk8K3E1JnUY-Wj_ynfMjlp9db1td9fDS3", category: "Accessories", href: "/accessories/croissant-leather-bag" }} />
                </div>
                <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Hand-Stitched Leather Tote</h3>
                <p className="text-[#434751] mb-2">Cognac Brown</p>
                <p className="text-lg font-bold text-[#ac3231]">₹210.00</p>
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
                <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Heritage Floral Silk Scarf</h3>
                <p className="text-[#434751] mb-2">Rose &amp; Sage</p>
                <p className="text-lg font-bold text-[#ac3231]">₹55.00</p>
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
                <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Lightweight Reading Frames</h3>
                <p className="text-[#434751] mb-2">Classic Gold</p>
                <p className="text-lg font-bold text-[#ac3231]">₹78.00</p>
              </Link>
            </div>
            <div className="mt-16 text-center">
              <Link className="bg-[#004490] inline-block text-white px-12 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/accessories?generation=boomer">
                View More Accessories
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-headline text-[#1e1b17] mb-6">Sneakers Built for Comfort</h2>
              <p className="text-[#434751] mb-8 leading-relaxed">
                Say goodbye to sore feet. Our sneaker collection features orthotic-friendly insoles, breathable fabrics, and slip-resistant soles
                without compromising on style.
              </p>
              <Link className="bg-[#004490] inline-block text-white px-10 py-4 rounded-lg font-bold hover:bg-[#004490]/90 transition-colors" href="/sneakers?generation=boomer">
                View All Sneakers
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Link className="group cursor-pointer block" href="/sneakers/nova-form-strider">
                <div className="relative aspect-[4/3] bg-[#eee7df] rounded-lg overflow-hidden mb-4">
                  <img
                    alt="Minimalist white leather sneakers with soft cushioned collars and flat soles against a clean neutral background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDgdQQvsycPGbV8jIeagAj9a6g87EQSOsFhnXcfWGBrv_TipcUZVkJkGKjq80lFo6MR4oZhD3wuILDwLxo0PztpsvNCYPnlAdqEtbdJ5dFHji9FAL961W5lA1saVD69FIzVkP5dQx2JP1xlcqJeXz6COwoYbUTn1CIGgiW3p-mxP3H4rrdJIaK5J_iMw5kseoJhIafZBuB8SnyDjNvY-rJHEASVN_TMYiEt-ldDhxFfAaDxK7DGC3HKi1GGPVOTo7062BUxdVwUgN2"
                  />
                  <ProductHoverActions product={{ id: "boomers-sneakers-cloudwalk-leather-trainer", name: "CloudWalk Leather Trainer", price: 115, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDgdQQvsycPGbV8jIeagAj9a6g87EQSOsFhnXcfWGBrv_TipcUZVkJkGKjq80lFo6MR4oZhD3wuILDwLxo0PztpsvNCYPnlAdqEtbdJ5dFHji9FAL961W5lA1saVD69FIzVkP5dQx2JP1xlcqJeXz6COwoYbUTn1CIGgiW3p-mxP3H4rrdJIaK5J_iMw5kseoJhIafZBuB8SnyDjNvY-rJHEASVN_TMYiEt-ldDhxFfAaDxK7DGC3HKi1GGPVOTo7062BUxdVwUgN2", category: "Sneakers", href: "/sneakers/nova-form-strider" }} />
                </div>
                <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">CloudWalk Leather Trainer</h3>
                <p className="text-lg font-bold text-[#ac3231]">₹115.00</p>
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
                <h3 className="text-xl font-body font-semibold text-[#1e1b17] mb-1">Air-Mesh Comfort Slip-On</h3>
                <p className="text-lg font-bold text-[#ac3231]">₹95.00</p>
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


