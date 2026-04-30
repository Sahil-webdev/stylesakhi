"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchProductBySlug, fetchProducts, ProductRecord } from "@/lib/products-api";
import { useShop } from "@/contexts/ShopContext";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

type MediaItem = { type: "image" | "video"; src: string };

export default function AccessoriesDetailPage() {
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("product") || "croissant-leather-bag";

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [related, setRelated] = useState<ProductRecord[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
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
        const relatedItems = await fetchProducts({ category: "accessories", generation: item.generation, limit: "12", isActive: "true" });

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
      <main className="flex-grow flex flex-col items-center pt-24 pb-8 px-5 md:px-8 max-w-5xl mx-auto w-full">
        {loading ? (
          <div className="w-full rounded-2xl bg-white p-10 text-center text-[#595c5d]">Loading product...</div>
        ) : error || !product ? (
          <div className="w-full rounded-2xl bg-white p-10 text-center text-[#9e3f4e]">{error || "Product not found"}</div>
        ) : (
          <>
            <div className="w-full mb-6 text-xs md:text-sm text-[#595c5d] flex gap-2 items-center">
              <Link className="hover:text-[#644aad] transition-colors" href="/">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <Link className="hover:text-[#644aad] transition-colors" href="/accessories">Accessories</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#2c2f30] font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mb-12">
              <div className="flex flex-col gap-3">
                <div className="w-full h-[360px] sm:h-[460px] lg:h-[520px] bg-white rounded-xl overflow-hidden">
                  {activeMedia?.type === "video" ? (
                    <video className="w-full h-full object-contain" controls playsInline preload="metadata" src={activeMedia.src} />
                  ) : (
                    <img alt={product.name} className="w-full h-full object-contain" src={activeMedia?.src} />
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {mediaItems.slice(0, 4).map((media, idx) => (
                    <button key={media.src + idx} onClick={() => setSelectedImage(idx)} className={`aspect-square rounded-lg overflow-hidden ${idx === selectedImage ? "ring-2 ring-[#644aad]" : "opacity-70"}`} type="button">
                      {media.type === "video" ? (
                        <div className="relative h-full w-full">
                          <video className="h-full w-full object-cover" muted playsInline preload="metadata" src={media.src} />
                          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">VIDEO</span>
                        </div>
                      ) : (
                        <img alt="thumbnail" className="w-full h-full object-cover" src={media.src} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col pt-1">
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
                <p className="mb-4 rounded-lg bg-[#f1f4f6] px-3 py-2 text-sm text-[#2b3437]">
                  Expected delivery by <span className="font-semibold">{deliveryLabel}</span>
                </p>
                <p className="font-headline text-xl text-[#595c5d] font-medium mb-4">₹{product.price}</p>
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
                <p className="mb-6 text-sm leading-relaxed text-[#595c5d] whitespace-pre-line break-words [overflow-wrap:anywhere] md:text-base">
                  {product.description}
                </p>

                <div className="rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4 mb-5">
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

                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-[#644aad] text-[#f7f0ff] font-headline font-bold text-sm md:text-base py-3 rounded-xl hover:bg-[#583da0] transition-colors"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || "https://placehold.co/640x800?text=No+Image",
                        category: "Accessories",
                        href: `/accessories/croissant-leather-bag?product=${encodeURIComponent(product.slug || product._id)}`,
                      })
                    }
                    type="button"
                  >
                    Add to Cart
                  </button>
                  <Link className="w-full bg-[#dadddf] text-[#644aad] font-headline font-bold text-sm md:text-base py-3 rounded-xl hover:bg-[#e0e3e4] transition-colors text-center" href="/cart">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>

            <ProductReviewsSection className="mb-10 w-full" productId={product._id} />

            {related.length > 0 && (
              <div className="w-full">
                <h2 className="font-headline text-xl md:text-2xl font-bold tracking-tight mb-5">Related Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {related.map((item) => (
                    <Link key={item._id} href={`/accessories/croissant-leather-bag?product=${encodeURIComponent(item.slug || item._id)}`} className="group flex flex-col">
                      <div className="w-full aspect-[4/5] bg-white rounded-xl overflow-hidden mb-2.5">
                        {item.video ? (
                          <video autoPlay className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loop muted playsInline preload="metadata" src={item.video} />
                        ) : (
                          <img alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.images[0] || "https://placehold.co/400x520?text=No+Image"} />
                        )}
                      </div>
                      <h3 className="font-headline font-semibold text-sm md:text-base group-hover:text-[#644aad] transition-colors">{item.name}</h3>
                      <p className="text-[#595c5d] mt-1 text-xs md:text-sm">₹{item.price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800;900&family=Inter:wght@400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
        .font-headline { font-family: "Plus Jakarta Sans", sans-serif; }
        .font-body { font-family: "Inter", sans-serif; }
        .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; }
      `}</style>
    </div>
  );
}
