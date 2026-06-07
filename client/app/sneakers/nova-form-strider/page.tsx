"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { fetchProductBySlug, fetchProducts, ProductRecord } from "@/lib/products-api";
import { buildCategoryDetailHref } from "@/lib/product-link";
import { useShop } from "@/contexts/ShopContext";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

type MediaItem = { type: "image" | "video"; src: string };

function SneakersDetailPageContent() {
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("product") || "nova-form-strider";

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [related, setRelated] = useState<ProductRecord[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useShop();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const item = await fetchProductBySlug(selectedSlug);
        const relatedItems = await fetchProducts({ category: "sneakers", generation: item.generation, limit: "12", isActive: "true" });

        if (mounted) {
          setProduct(item);
          setRelated(relatedItems.filter((rel) => rel.slug !== item.slug).slice(0, 4));
          setSelectedImage(0);
          setSelectedSize(item.sizes[0] || "");
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load product");
          setProduct(null);
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
    <div className="bg-[#f5f6f7] text-[#2c2f30] font-body antialiased">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {loading ? (
          <div className="lg:col-span-2 rounded-2xl bg-white p-10 text-center text-[#595c5d]">Loading product...</div>
        ) : error || !product ? (
          <div className="lg:col-span-2 rounded-2xl bg-white p-10 text-center text-[#9e3f4e]">{error || "Product not found"}</div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <div className="w-full h-[360px] sm:h-[460px] lg:h-[540px] bg-white rounded-2xl overflow-hidden">
                {activeMedia?.type === "video" ? (
                  <video className="w-full h-full object-contain" controls playsInline preload="metadata" src={activeMedia.src} />
                ) : (
                  <img alt={product.name} className="w-full h-full object-contain" src={activeMedia?.src} />
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {mediaItems.slice(0, 4).map((media, idx) => (
                  <button key={media.src + idx} className={`aspect-square rounded-xl overflow-hidden ${selectedImage === idx ? "ring-2 ring-[#644aad]" : "opacity-70"}`} onClick={() => setSelectedImage(idx)} type="button">
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
            </div>

            <div className="flex flex-col pt-2">
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-3">{product.name}</h1>
                <p className="mb-4 rounded-lg bg-[#f1f4f6] px-3 py-2 text-sm text-[#2b3437]">
                  Expected delivery by <span className="font-semibold">{deliveryLabel}</span>
                </p>
                <span className="text-3xl font-medium text-[#644aad]">₹{product.price}</span>
                <div className="mt-3 flex items-center gap-2">
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
              </div>

              <p className="mb-8 text-lg leading-relaxed text-[#595c5d] whitespace-pre-line break-words [overflow-wrap:anywhere]">
                {product.description}
              </p>

              {product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Select Size</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        className={`py-3 rounded-lg border text-sm font-medium ${selectedSize === size ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30"}`}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Color options</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span className="rounded-full border border-[#abadae]/30 px-3 py-1 text-xs" key={color}>{color}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4 mb-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ea]">
                  <h4 className="font-headline font-bold text-[#2b3437] text-base">Product details</h4>
                  <span className="material-symbols-outlined text-[#586064]">expand_less</span>
                </div>
                <div className="pt-4 space-y-2">
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

              <button
                className="w-full bg-[#644aad] text-white py-4 rounded-xl font-semibold hover:bg-[#583da0]"
                onClick={() =>
                  addToCart({
                    id: product._id,
                    name: selectedSize ? `${product.name} (EU ${selectedSize})` : product.name,
                    price: product.price,
                    image: product.images[0] || "https://placehold.co/640x800?text=No+Image",
                    category: "Sneakers",
                    href: buildCategoryDetailHref("sneakers", product.slug || product._id),
                  })
                }
                type="button"
              >
                Add to Cart
              </button>
            </div>

            <div className="lg:col-span-2">
              <ProductReviewsSection className="mb-6 w-full" productId={product._id} />
            </div>

            {related.length > 0 && (
              <section className="lg:col-span-2 w-full pt-8 border-t border-[#e0e3e4]">
                <div className="mb-8 flex justify-between items-end">
                  <h2 className="text-2xl font-extrabold tracking-tight">Related Products</h2>
                  <Link className="text-[#644aad] hover:underline text-sm" href="/sneakers">View All</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map((item) => (
                    <Link className="group block bg-white rounded-2xl overflow-hidden border border-[#abadae]/30" href={buildCategoryDetailHref("sneakers", item.slug || item._id)} key={item._id}>
                      <div className="aspect-square bg-[#eff1f2] overflow-hidden">
                        {item.video ? (
                          <video autoPlay className="w-full h-full object-cover group-hover:scale-105 transition-transform" loop muted playsInline preload="metadata" src={item.video} />
                        ) : (
                          <img alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.images[0] || "https://placehold.co/400x400?text=No+Image"} />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-1 group-hover:text-[#644aad]">{item.name}</h4>
                        <div className="text-[#644aad] font-medium">₹{item.price}</div>
                      </div>
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

export default function SneakersDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f6f7]" />}>
      <SneakersDetailPageContent />
    </Suspense>
  );
}
