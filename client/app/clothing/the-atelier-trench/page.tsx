"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchProductBySlug, fetchProducts, ProductRecord } from "@/lib/products-api";
import { useShop } from "@/contexts/ShopContext";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

type MediaItem = { type: "image" | "video"; src: string };

export default function ClothingDetailPage() {
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("product") || "the-atelier-trench";

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [related, setRelated] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const item = await fetchProductBySlug(selectedSlug);
        const relatedItems = await fetchProducts({ category: "clothing", generation: item.generation, limit: "12", isActive: "true" });

        if (mounted) {
          setProduct(item);
          setRelated(relatedItems.filter((rel) => rel.slug !== item.slug).slice(0, 4));
          setSelectedImage(0);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load product");
          setProduct(null);
          setRelated([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [selectedSlug]);

  const mediaItems = useMemo(() => {
    const baseImages = product?.images?.length ? product.images : ["https://placehold.co/900x1200?text=No+Image"];
    const items: MediaItem[] = baseImages.map((img) => ({ type: "image", src: img }));
    if (product?.video) {
      items.unshift({ type: "video", src: product.video });
    }
    return items;
  }, [product]);
  const activeMedia = mediaItems[selectedImage] || mediaItems[0];
  const deliveryLabel = useMemo(() => formatDeliveryFromNow(7), []);

  return (
    <div className="font-body text-[#2c2f30] antialiased bg-[#f5f6f7] min-h-screen">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-5 md:px-10 py-24">
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-[#595c5d]">Loading product...</div>
        ) : error || !product ? (
          <div className="rounded-2xl bg-white p-10 text-center text-[#9e3f4e]">{error || "Product not found"}</div>
        ) : (
          <>
            <div className="mb-6 text-sm text-[#595c5d] flex gap-2 items-center">
              <Link className="hover:text-[#644aad]" href="/">Home</Link>
              <span>/</span>
              <Link className="hover:text-[#644aad]" href="/clothing">Clothing</Link>
              <span>/</span>
              <span className="text-[#2c2f30] font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className="lg:col-span-7 flex gap-4">
                <div className="flex flex-col gap-3 w-20">
                  {mediaItems.slice(0, 4).map((media, idx) => (
                    <button key={media.src + idx} className={`rounded-lg overflow-hidden aspect-[3/4] ${selectedImage === idx ? "ring-2 ring-[#644aad]" : "opacity-70"}`} onClick={() => setSelectedImage(idx)} type="button">
                      {media.type === "video" ? (
                        <div className="relative h-full w-full">
                          <video className="h-full w-full object-cover" muted playsInline preload="metadata" src={media.src} />
                          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">VIDEO</span>
                        </div>
                      ) : (
                        <img alt="thumb" className="w-full h-full object-cover" src={media.src} />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden bg-white h-[360px] sm:h-[460px] lg:h-[560px]">
                  {activeMedia?.type === "video" ? (
                    <video className="w-full h-full object-contain" controls playsInline preload="metadata" src={activeMedia.src} />
                  ) : (
                    <img alt={product.name} className="w-full h-full object-contain" src={activeMedia?.src} />
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
                <p className="mb-4 rounded-lg bg-[#f1f4f6] px-3 py-2 text-sm text-[#2b3437]">
                  Expected delivery by <span className="font-semibold">{deliveryLabel}</span>
                </p>
                <p className="text-2xl font-semibold text-[#644aad] mb-4">₹{product.price}</p>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-lg ${star <= Math.round(Number(product.averageRating || 0)) ? "text-amber-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#2b3437]">{Number(product.averageRating || 0).toFixed(1)}</span>
                  <span className="text-xs text-[#586064]">({Number(product.numReviews || 0)} reviews)</span>
                </div>
                <p className="mb-6 whitespace-pre-line break-words text-[#595c5d] leading-relaxed [overflow-wrap:anywhere]">
                  {product.description}
                </p>

                {product.colors.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2">Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span className="rounded-full border border-[#abadae]/30 px-3 py-1 text-xs" key={color}>{color}</span>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span className="rounded-lg bg-[#f1f4f6] px-3 py-1.5 text-xs font-medium" key={size}>{size}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4">
                  <h4 className="font-headline font-bold text-[#2b3437] text-base mb-3">Product details</h4>
                  <div className="space-y-2">
                    {Object.entries(product.productDetails || {}).length > 0 ? (
                      Object.entries(product.productDetails).map(([key, value]) => (
                        <div className="grid grid-cols-2 gap-3 text-sm" key={key}>
                          <span className="font-semibold text-[#2b3437]">{key}</span>
                          <span className="text-[#595c5d]">{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#595c5d]">No additional details</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 rounded-xl bg-[#644aad] px-4 py-3 text-sm font-semibold text-white hover:bg-[#583da0]"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || "https://placehold.co/640x800?text=No+Image",
                        category: "Clothing",
                        href: `/clothing/the-atelier-trench?product=${encodeURIComponent(product.slug || product._id)}`,
                      })
                    }
                    type="button"
                  >
                    Add to Cart
                  </button>
                  <button
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${isWishlisted(product._id) ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30 bg-white text-[#2c2f30]"}`}
                    onClick={() =>
                      toggleWishlist({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || "https://placehold.co/640x800?text=No+Image",
                        category: "Clothing",
                        href: `/clothing/the-atelier-trench?product=${encodeURIComponent(product.slug || product._id)}`,
                      })
                    }
                    type="button"
                  >
                    {isWishlisted(product._id) ? "Wishlisted" : "Wishlist"}
                  </button>
                </div>
              </div>
            </div>

            <ProductReviewsSection className="mb-10 w-full" productId={product._id} />

            {related.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-bold">Related Products</h2>
                  <Link className="text-[#644aad] text-sm hover:underline" href="/clothing">View All</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {related.map((item) => (
                    <Link className="group block" href={`/clothing/the-atelier-trench?product=${encodeURIComponent(item.slug || item._id)}`} key={item._id}>
                      <div className="rounded-xl overflow-hidden bg-white aspect-[3/4] mb-2">
                        {item.video ? (
                          <video autoPlay className="w-full h-full object-cover group-hover:scale-105 transition-transform" loop muted playsInline preload="metadata" src={item.video} />
                        ) : (
                          <img alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.images[0] || "https://placehold.co/400x520?text=No+Image"} />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-[#644aad]">{item.name}</h3>
                      <p className="text-xs text-[#595c5d]">₹{item.price}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
