"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductHoverActions from "@/components/ProductHoverActions";
import BannerCarousel from "@/components/BannerCarousel";
import GenerationHighestSelling from "@/components/GenerationHighestSelling";
import type { HighestSellingProduct } from "@/components/HighestSellingProducts";

export default function GenZPage() {
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
      alt: "Gen Z Collection Banner 1",
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
      alt: "Gen Z Collection Banner 2",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
      alt: "Gen Z Collection Banner 3",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
      alt: "Gen Z Collection Banner 4",
    },
  ];
  const bestsellers: HighestSellingProduct[] = [
    {
      id: "genz-bestseller-velocity-low",
      name: "Velocity Low",
      price: 225,
      priceLabel: "Rs. 225",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAxSjE4iXtocw-zVI76kriOcYVuwrMKwv7kM4msoaJ4zc7y77f67tAauJVBxBLJ2gQpDgB1N5GqzLOmiOVlkI6bhTnaare6hnuVAfzjSGw05Bcr3Nqj9riHhljCHErTCSjHrqWvC1Sq6jXiVeP_8LyQrmTt1Qj76h0zLLwXJZ06uYqasVagBFaBbxragE3mMtZjxL10cTcEsIvXpdezLz7-38AstNg2_g4NxrZCXzNdEI0lD6NSZwATn1biFAI-DzK_24STsi7SSIN8",
      category: "Sneakers",
      href: "/sneakers/nova-form-strider",
      badge: "Hot drop",
      rating: "4.9",
      soldLabel: "1.2k sold",
      note: "Drop favorite",
    },
    {
      id: "genz-bestseller-oversized-lavender-knit",
      name: "Oversized Lavender Knit",
      price: 89,
      priceLabel: "Rs. 89",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDrjT26GbhnZOp9XJTCJhf26mKuCUKYxomQ34fnYXl7oizqaIBTD9Bdu1RD1wotUaLLsMYuIUyqBgZ9junrhIScWCZACZVnsV1Yd5s7xVlzuki5Foc5U-4ElUURkkp-zCXQLbH-0clm2K6EJzWOmUqh9Y-qcr4WGsGioapJtgtMQfMcvbmfm9IrU4wS5iTzNe-U3qQwlRPsKHahLXK8AoKg36vb5H5k1GdcXqlUuEsfev2fY_7sOaRakmCiIKpxZI-OCdk20Nqvmfhb",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Most loved",
      rating: "4.8",
      soldLabel: "980 sold",
      note: "Soft street",
    },
    {
      id: "genz-bestseller-tote-de-luxe",
      name: "Tote de Luxe",
      price: 210,
      priceLabel: "Rs. 210",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvUakNEGtNVYBPHn1jKGtweP6oNcSIF0fs2eN612hgJ923Ec5Ivtjq_R7wyJ7cdHcRHo-zWfufaNtOauBBCnIT8S364yJ2zjMSJWzKeALlEAylnvmo37MMZ34FMQ_RKuMRDiATsCLlSzZwbNYCjXa-_gZxH1Tg1OoqKlRs50XL8yPNe4f0N0iIHuEQ-y1EcBnKvwyYW9dPDyEOpQnEAQt5esZg20L_fYDoZh3QMi5e9r2mGfaoW3hM0a-wK-hNRo-wOsKwdomykYc3",
      category: "Accessories",
      href: "/accessories/croissant-leather-bag",
      badge: "Aesthetic",
      rating: "4.7",
      soldLabel: "910 sold",
      note: "Viral bag",
    },
    {
      id: "genz-bestseller-patchwork-denim",
      name: "Patchwork Denim",
      price: 120,
      priceLabel: "Rs. 120",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDN-sgpOjFkz_vz3lefbu5CSYGxttKx7pxAW3WM4A1SjsD_8NLhBiFuOKDcYkABv7XeSEWpWpGx8SqFu5iGXe9jK1VUVDJ6whOGEiKjH63mTVlpyrKvBkmODBfme833IviBmc7cDAY6qBcpy5eu7KtxotWa1oilKIiAtvNeG5ObF0hRg8N288f-Tq_u1aQNqNb_0oSe6c62hHK2gDXnM2Zdh5bAa6XB8Eig97hw84Z4sAUoVFFA54U_Zc43vcOzVAJbYuTWYcU0QXuB",
      category: "Clothing",
      href: "/clothing/the-atelier-trench",
      badge: "Trend pick",
      rating: "4.8",
      soldLabel: "870 sold",
      note: "Layer hero",
    },
  ];
  return (
    <div className="bg-[#fafafa] font-body text-[#2f3334] antialiased selection:bg-[#f1d6ff] selection:text-[#5c486a] overflow-x-hidden">
      <Navbar />

      <main>
        <section className="pt-16 pb-8 px-4">
          <div className="max-w-[1265px] mx-auto">
            <BannerCarousel banners={banners} autoPlayInterval={4000} />
          </div>
        </section>

        <GenerationHighestSelling
          generation="gen-z"
          generationLabel="Gen Z"
          viewAllHref="/sneakers?generation=gen-z"
          backgroundClassName="bg-[#f1d6ff]/30"
          accentClassName="bg-[#111111] text-white"
          description="The most clicked and most bought pieces from Gen Z shoppers, ranked for fast discovery."
          fallbackProducts={bestsellers}
        />

        <section className="py-12 px-8 bg-[#f1d6ff]/30" id="clothing">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-3xl font-black text-[#111111] tracking-tighter mb-2">The Wardrobe</h2>
                <p className="text-[#5f4b6d] text-sm font-medium">Redefining classic silhouettes with an edgy twist.</p>
              </div>
              <Link
                className="bg-[#111111] text-white px-5 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                href="/clothing?generation=gen-z"
              >
                View More
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
                <div className="relative rounded-xl overflow-hidden bg-white aspect-[3/4] mb-4">
                  <img
                    alt="trendy lavender oversized hoodie on minimalist clothing rack with soft artistic lighting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrjT26GbhnZOp9XJTCJhf26mKuCUKYxomQ34fnYXl7oizqaIBTD9Bdu1RD1wotUaLLsMYuIUyqBgZ9junrhIScWCZACZVnsV1Yd5s7xVlzuki5Foc5U-4ElUURkkp-zCXQLbH-0clm2K6EJzWOmUqh9Y-qcr4WGsGioapJtgtMQfMcvbmfm9IrU4wS5iTzNe-U3qQwlRPsKHahLXK8AoKg36vb5H5k1GdcXqlUuEsfev2fY_7sOaRakmCiIKpxZI-OCdk20Nqvmfhb"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-clothing-oversized-lavender-knit",
                      name: "Oversized Lavender Knit",
                      price: 89,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDrjT26GbhnZOp9XJTCJhf26mKuCUKYxomQ34fnYXl7oizqaIBTD9Bdu1RD1wotUaLLsMYuIUyqBgZ9junrhIScWCZACZVnsV1Yd5s7xVlzuki5Foc5U-4ElUURkkp-zCXQLbH-0clm2K6EJzWOmUqh9Y-qcr4WGsGioapJtgtMQfMcvbmfm9IrU4wS5iTzNe-U3qQwlRPsKHahLXK8AoKg36vb5H5k1GdcXqlUuEsfev2fY_7sOaRakmCiIKpxZI-OCdk20Nqvmfhb",
                      category: "Clothing",
                      href: "/clothing/the-atelier-trench",
                    }}
                  />
                </div>
                <h3 className="font-headline font-bold text-[#111111]">Oversized Lavender Knit</h3>
                <p className="text-zinc-500">₹89.00</p>
              </Link>
              <Link className="group cursor-pointer mt-0 lg:mt-8 block" href="/clothing/the-atelier-trench">
                <div className="relative rounded-xl overflow-hidden bg-white aspect-[3/4] mb-4">
                  <img
                    alt="aesthetic editorial shot of vintage denim jacket with patchwork details on pale purple background"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN-sgpOjFkz_vz3lefbu5CSYGxttKx7pxAW3WM4A1SjsD_8NLhBiFuOKDcYkABv7XeSEWpWpGx8SqFu5iGXe9jK1VUVDJ6whOGEiKjH63mTVlpyrKvBkmODBfme833IviBmc7cDAY6qBcpy5eu7KtxotWa1oilKIiAtvNeG5ObF0hRg8N288f-Tq_u1aQNqNb_0oSe6c62hHK2gDXnM2Zdh5bAa6XB8Eig97hw84Z4sAUoVFFA54U_Zc43vcOzVAJbYuTWYcU0QXuB"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-clothing-patchwork-denim",
                      name: "Patchwork Denim",
                      price: 120,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDN-sgpOjFkz_vz3lefbu5CSYGxttKx7pxAW3WM4A1SjsD_8NLhBiFuOKDcYkABv7XeSEWpWpGx8SqFu5iGXe9jK1VUVDJ6whOGEiKjH63mTVlpyrKvBkmODBfme833IviBmc7cDAY6qBcpy5eu7KtxotWa1oilKIiAtvNeG5ObF0hRg8N288f-Tq_u1aQNqNb_0oSe6c62hHK2gDXnM2Zdh5bAa6XB8Eig97hw84Z4sAUoVFFA54U_Zc43vcOzVAJbYuTWYcU0QXuB",
                      category: "Clothing",
                      href: "/clothing/the-atelier-trench",
                    }}
                  />
                </div>
                <h3 className="font-headline font-bold text-[#111111]">Patchwork Denim</h3>
                <p className="text-zinc-500">₹120.00</p>
              </Link>
              <Link className="group cursor-pointer block" href="/clothing/the-atelier-trench">
                <div className="relative rounded-xl overflow-hidden bg-white aspect-[3/4] mb-4">
                  <img
                    alt="clean minimal black graphic t-shirt with aesthetic white typography worn by person in studio lighting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHR1oncLDfQmF1HxQqHvfiGgg6ffT8v2YAMAU6vWKOwDSrk0KCKMHu-ygzDq5Kkw1TvHee4tcOLhDhJwL2V0IKPvlDQIbmfKvoRIYmP3-pd5rhyqYGyXAaeUv-3PAI4E4meT3jE86QcIAwvL9pUiZDeecYRtRjKb0Jb2-4eQf4Tn5cQsjO7tUEVXL8R5D7AENiUhkjCIFahUyK2sNiybzZFWVaSmk8kyCxFOvUcdabazo-tFzpqOIBBQa1qd6B1UcBlPTPKHwoqVln"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-clothing-digital-print-tee",
                      name: "Digital Print Tee",
                      price: 45,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCHR1oncLDfQmF1HxQqHvfiGgg6ffT8v2YAMAU6vWKOwDSrk0KCKMHu-ygzDq5Kkw1TvHee4tcOLhDhJwL2V0IKPvlDQIbmfKvoRIYmP3-pd5rhyqYGyXAaeUv-3PAI4E4meT3jE86QcIAwvL9pUiZDeecYRtRjKb0Jb2-4eQf4Tn5cQsjO7tUEVXL8R5D7AENiUhkjCIFahUyK2sNiybzZFWVaSmk8kyCxFOvUcdabazo-tFzpqOIBBQa1qd6B1UcBlPTPKHwoqVln",
                      category: "Clothing",
                      href: "/clothing/the-atelier-trench",
                    }}
                  />
                </div>
                <h3 className="font-headline font-bold text-[#111111]">Digital Print Tee</h3>
                <p className="text-zinc-500">₹45.00</p>
              </Link>
              <Link className="group cursor-pointer mt-0 lg:mt-8 block" href="/clothing/the-atelier-trench">
                <div className="relative rounded-xl overflow-hidden bg-white aspect-[3/4] mb-4">
                  <img
                    alt="fashionable cargo pants in soft cream color neatly folded on purple background"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1aL2nbGlHe26yPg46RwnaGJpFNUeNMCXvsnwV5Q4qG9VP6fqQwr45beuo3BgMkFqdsiwkyS5-Bxi_ZUGYa7Qcc85xef66deY93v6SYSQO8I6wVOQ_T3TqR-6mF3_swkFGm7NO0rrPPfTKdmiQRdLhgY3CgPVL0nRjIwu4CNEMA-6EgJ__tqXEfyNB33yrvri2vaDKGuRNDHEcvc4zL4LGfiG6C4Xj4CdjsXOKJOg2DT6eJ_F78eR3VG6ixz3koYiBFF3gPDNcYsZq"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-clothing-utility-cargo-pants",
                      name: "Utility Cargo Pants",
                      price: 110,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1aL2nbGlHe26yPg46RwnaGJpFNUeNMCXvsnwV5Q4qG9VP6fqQwr45beuo3BgMkFqdsiwkyS5-Bxi_ZUGYa7Qcc85xef66deY93v6SYSQO8I6wVOQ_T3TqR-6mF3_swkFGm7NO0rrPPfTKdmiQRdLhgY3CgPVL0nRjIwu4CNEMA-6EgJ__tqXEfyNB33yrvri2vaDKGuRNDHEcvc4zL4LGfiG6C4Xj4CdjsXOKJOg2DT6eJ_F78eR3VG6ixz3koYiBFF3gPDNcYsZq",
                      category: "Clothing",
                      href: "/clothing/the-atelier-trench",
                    }}
                  />
                </div>
                <h3 className="font-headline font-bold text-[#111111]">Utility Cargo Pants</h3>
                <p className="text-zinc-500">₹110.00</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-8 bg-[#ffdad2]/40" id="accessories">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col justify-center">
              <h2 className="font-headline text-3xl font-black text-[#111111] tracking-tighter mb-4 leading-none">
                Curated <br />
                Accents
              </h2>
              <p className="text-[#7b4437] text-sm font-medium mb-6 max-w-sm">
                The small details that define a persona. Handpicked accessories for the modern curator.
              </p>
              <Link
                className="bg-[#111111] text-white px-5 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 w-fit"
                href="/accessories?generation=gen-z"
              >
                View More
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-2 gap-8">
              <Link className="relative group bg-white/40 p-4 rounded-xl backdrop-blur-md border border-white/20 custom-shadow block" href="/accessories/croissant-leather-bag">
                <div className="relative rounded-lg overflow-hidden h-52 mb-4">
                  <img
                    alt="luxury minimalist leather handbag in peach color sitting on a white marble surface"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvUakNEGtNVYBPHn1jKGtweP6oNcSIF0fs2eN612hgJ923Ec5Ivtjq_R7wyJ7cdHcRHo-zWfufaNtOauBBCnIT8S364yJ2zjMSJWzKeALlEAylnvmo37MMZ34FMQ_RKuMRDiATsCLlSzZwbNYCjXa-_gZxH1Tg1OoqKlRs50XL8yPNe4f0N0iIHuEQ-y1EcBnKvwyYW9dPDyEOpQnEAQt5esZg20L_fYDoZh3QMi5e9r2mGfaoW3hM0a-wK-hNRo-wOsKwdomykYc3"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-accessories-tote-de-luxe",
                      name: "Tote de Luxe",
                      price: 210,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvUakNEGtNVYBPHn1jKGtweP6oNcSIF0fs2eN612hgJ923Ec5Ivtjq_R7wyJ7cdHcRHo-zWfufaNtOauBBCnIT8S364yJ2zjMSJWzKeALlEAylnvmo37MMZ34FMQ_RKuMRDiATsCLlSzZwbNYCjXa-_gZxH1Tg1OoqKlRs50XL8yPNe4f0N0iIHuEQ-y1EcBnKvwyYW9dPDyEOpQnEAQt5esZg20L_fYDoZh3QMi5e9r2mGfaoW3hM0a-wK-hNRo-wOsKwdomykYc3",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-zinc-400">Essential</p>
                    <h3 className="font-headline font-bold text-[#111111]">Tote de Luxe</h3>
                  </div>
                  <span className="text-xl font-bold">₹210</span>
                </div>
              </Link>
              <Link className="relative group bg-white/40 p-4 rounded-xl backdrop-blur-md border border-white/20 custom-shadow mt-0 block" href="/accessories/croissant-leather-bag">
                <div className="relative rounded-lg overflow-hidden h-52 mb-4">
                  <img
                    alt="aesthetic chunky gold rings and pearl necklaces laid out on a silk fabric background"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdICoc7vPgSfxV0Tq7mz7jv0b8oBlOZJGkpj3fuZ91XXjFnYLlP4sgMYRvnoDHHlY_3MH2ZuoQnnjjXeBtlxz-f1138WVnPdBhm7XXeo3Misys6CiJMaSz3vrjtSmtEJX6me4ObrLys3JD6NoQoANZCeXS9o14aJjoymYsPmf_EjPfOov8deaGJDvg2rTDUkuY8LGjjvW5y4SJ_bTkhGnUTih9xe38KFTbjPPDI5twRAjMv3xTiON3WF0m5EMx-scPtM4tBz2TBNqC"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-accessories-chain-layer-set",
                      name: "Chain Layer Set",
                      price: 55,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdICoc7vPgSfxV0Tq7mz7jv0b8oBlOZJGkpj3fuZ91XXjFnYLlP4sgMYRvnoDHHlY_3MH2ZuoQnnjjXeBtlxz-f1138WVnPdBhm7XXeo3Misys6CiJMaSz3vrjtSmtEJX6me4ObrLys3JD6NoQoANZCeXS9o14aJjoymYsPmf_EjPfOov8deaGJDvg2rTDUkuY8LGjjvW5y4SJ_bTkhGnUTih9xe38KFTbjPPDI5twRAjMv3xTiON3WF0m5EMx-scPtM4tBz2TBNqC",
                      category: "Accessories",
                      href: "/accessories/croissant-leather-bag",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-zinc-400">Adornments</p>
                    <h3 className="font-headline font-bold text-[#111111]">Chain Layer Set</h3>
                  </div>
                  <span className="text-xl font-bold">₹55</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-8 bg-[#a1d1fe]/20 relative" id="sneakers">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-headline text-4xl font-black text-[#111111] tracking-tighter mb-2">Street Soles</h2>
              <p className="text-[#22577e] text-sm font-medium">Limited drops and heritage classics.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <Link className="bg-white rounded-xl p-8 custom-shadow flex flex-col items-center group block" href="/sneakers/nova-form-strider">
                <div className="relative w-full h-44">
                  <img
                    alt="streetwear style sneakers in white and blue colorway levitating in a bright minimal studio"
                    className="w-full h-44 object-contain group-hover:-rotate-12 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTvfluOIEPWylHWDvDGRiNqWfLsHpQ_YFpyh5l9eBxQzgD0Ax0vOB2w4IkKHBLzo0B5gUOl7HD5qvHBhDQoDTOacF1LY7jR9m6w9WiicltCWcad5ITsG41xTxu-kyPVz1vdyFVCGHZASCgfg5ojq162gd9TjZrOD9Ht6hyH8glUOYYUkT-G49Rh5GGGUH1_71XZSm36_eKdmeWJlWBH3FintSjilAxunGZTXfRaKcB0kJEA9sr-zszLhxcVEKpqAgzmd_7HodsTMLm"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-sneakers-cloud-walker-1s",
                      name: "Cloud Walker 1s",
                      price: 160,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTvfluOIEPWylHWDvDGRiNqWfLsHpQ_YFpyh5l9eBxQzgD0Ax0vOB2w4IkKHBLzo0B5gUOl7HD5qvHBhDQoDTOacF1LY7jR9m6w9WiicltCWcad5ITsG41xTxu-kyPVz1vdyFVCGHZASCgfg5ojq162gd9TjZrOD9Ht6hyH8glUOYYUkT-G49Rh5GGGUH1_71XZSm36_eKdmeWJlWBH3FintSjilAxunGZTXfRaKcB0kJEA9sr-zszLhxcVEKpqAgzmd_7HodsTMLm",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </div>
                <div className="w-full mt-8">
                  <p className="font-label text-[10px] tracking-widest uppercase font-bold text-[#31638a] mb-1">Top Rated</p>
                  <h3 className="font-headline font-bold text-xl text-[#111111] mb-2">Cloud Walker 1s</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">₹160.00</span>
                    <span className="w-10 h-10 rounded-full bg-[#6c5779] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm material-fill">add</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link className="bg-white rounded-xl p-8 custom-shadow flex flex-col items-center group scale-105 border-2 border-[#6c5779]/10 block" href="/sneakers/nova-form-strider">
                <div className="relative w-full h-44">
                  <img
                    alt="luxury designer sneakers with bold red accents on a crisp white background"
                    className="w-full h-44 object-contain group-hover:-rotate-12 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxSjE4iXtocw-zVI76kriOcYVuwrMKwv7kM4msoaJ4zc7y77f67tAauJVBxBLJ2gQpDgB1N5GqzLOmiOVlkI6bhTnaare6hnuVAfzjSGw05Bcr3Nqj9riHhljCHErTCSjHrqWvC1Sq6jXiVeP_8LyQrmTt1Qj76h0zLLwXJZ06uYqasVagBFaBbxragE3mMtZjxL10cTcEsIvXpdezLz7-38AstNg2_g4NxrZCXzNdEI0lD6NSZwATn1biFAI-DzK_24STsi7SSIN8"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-sneakers-velocity-low",
                      name: "Velocity Low",
                      price: 225,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAxSjE4iXtocw-zVI76kriOcYVuwrMKwv7kM4msoaJ4zc7y77f67tAauJVBxBLJ2gQpDgB1N5GqzLOmiOVlkI6bhTnaare6hnuVAfzjSGw05Bcr3Nqj9riHhljCHErTCSjHrqWvC1Sq6jXiVeP_8LyQrmTt1Qj76h0zLLwXJZ06uYqasVagBFaBbxragE3mMtZjxL10cTcEsIvXpdezLz7-38AstNg2_g4NxrZCXzNdEI0lD6NSZwATn1biFAI-DzK_24STsi7SSIN8",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </div>
                <div className="w-full mt-8">
                  <p className="font-label text-[10px] tracking-widest uppercase font-bold text-[#ac3149] mb-1">Hot Drop</p>
                  <h3 className="font-headline font-bold text-xl text-[#111111] mb-2">Velocity Low</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">₹225.00</span>
                    <span className="w-10 h-10 rounded-full bg-[#6c5779] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm material-fill">add</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link className="bg-white rounded-xl p-8 custom-shadow flex flex-col items-center group block" href="/sneakers/nova-form-strider">
                <div className="relative w-full h-44">
                  <img
                    alt="fashionable platform sneakers with pastel accents in a minimalist aesthetic composition"
                    className="w-full h-44 object-contain group-hover:-rotate-12 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsRxlCzhO9zQle6vbJOGDqGGM0Qdv5-bY9SVjStBurexIljK6U5ApI7sohlwNHpUsNUoD0xK65BQoYIk6_EZpZrCEu2Zefjcit-1IlalVyons2UYlhiDaO5nQVtXBxmJOogFIyJE15Xfu_azDarRb_V2y98oOyWD9mZqH2QI4K2Ax_IHdcHR2yn1MGIl42Qm7ISimQdLx1EBGMrqFkd01PB9uwaw0yV5E0tzfObSGBKkFlWXb7MmqxadsehxS7b1WT3MKXbyIFMlVy"
                  />
                  <ProductHoverActions
                    product={{
                      id: "genz-sneakers-pastel-pivot",
                      name: "Pastel Pivot",
                      price: 140,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCsRxlCzhO9zQle6vbJOGDqGGM0Qdv5-bY9SVjStBurexIljK6U5ApI7sohlwNHpUsNUoD0xK65BQoYIk6_EZpZrCEu2Zefjcit-1IlalVyons2UYlhiDaO5nQVtXBxmJOogFIyJE15Xfu_azDarRb_V2y98oOyWD9mZqH2QI4K2Ax_IHdcHR2yn1MGIl42Qm7ISimQdLx1EBGMrqFkd01PB9uwaw0yV5E0tzfObSGBKkFlWXb7MmqxadsehxS7b1WT3MKXbyIFMlVy",
                      category: "Sneakers",
                      href: "/sneakers/nova-form-strider",
                    }}
                  />
                </div>
                <div className="w-full mt-8">
                  <p className="font-label text-[10px] tracking-widest uppercase font-bold text-[#31638a] mb-1">New In</p>
                  <h3 className="font-headline font-bold text-xl text-[#111111] mb-2">Pastel Pivot</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">₹140.00</span>
                    <span className="w-10 h-10 rounded-full bg-[#6c5779] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm material-fill">add</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <div className="mt-10 text-center">
              <Link
                className="bg-[#111111] text-white px-8 py-3 rounded-xl font-headline font-bold text-sm hover:scale-105 transition-transform inline-flex items-center gap-3"
                href="/sneakers?generation=gen-z"
              >
                View More Sneakers
                <span className="material-symbols-outlined">bolt</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500&family=Be+Vietnam+Pro:wght@400;500;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .font-headline {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .font-body {
          font-family: "Inter", sans-serif;
        }

        .font-label {
          font-family: "Be Vietnam Pro", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
        }

        .material-fill {
          font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 24;
        }

        .tonal-shift-bg {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
        }

        .custom-shadow {
          box-shadow: 0 10px 30px rgba(108, 87, 121, 0.08);
        }
      `}</style>
    </div>
  );
}


