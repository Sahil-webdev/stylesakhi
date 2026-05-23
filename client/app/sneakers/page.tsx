"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchProducts, ProductRecord } from "@/lib/products-api";
import { useShop } from "@/contexts/ShopContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function SneakersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("recommended");
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const generation = searchParams.get("generation") || "";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const items = await fetchProducts({
          category: "sneakers",
          isActive: "true",
          limit: "200",
          ...(generation ? { generation } : {}),
        });
        if (mounted) setProducts(items);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [generation]);

  const sizeOptions = useMemo(() => Array.from(new Set(products.flatMap((item) => item.sizes))), [products]);
  const brandOptions = useMemo(() => Array.from(new Set(products.map((item) => item.brand).filter(Boolean))) as string[], [products]);
  const colorOptions = useMemo(() => Array.from(new Set(products.flatMap((item) => item.colors))), [products]);

  const filteredProducts = useMemo(() => {
    let items = products.filter((item) => {
      const sizeOk = selectedSizes.size === 0 || item.sizes.some((size) => selectedSizes.has(size));
      const brandOk = selectedBrands.size === 0 || (item.brand && selectedBrands.has(item.brand));
      const colorOk = selectedColors.size === 0 || item.colors.some((color) => selectedColors.has(color));
      return sizeOk && brandOk && colorOk;
    });

    if (sortBy === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") items = [...items].sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [products, selectedSizes, selectedBrands, selectedColors, sortBy]);

  const toggleSet = (value: string, current: Set<string>, setter: (next: Set<string>) => void) => {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const toShopProduct = (product: ProductRecord) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.images[0] || "https://placehold.co/640x800?text=No+Image",
    category: "Sneakers",
    href: `/sneakers/nova-form-strider?product=${encodeURIComponent(product.slug || product._id)}`,
  });

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="pt-4 pb-10 px-4 rounded-3xl bg-gradient-to-br from-[#f5f6f7] to-[#eff1f2] mb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Sneakers</h1>
            <p className="text-base md:text-lg text-[#595c5d]">Discover dynamic sneaker products added from admin panel.</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
            <div className="rounded-2xl border border-[#abadae]/20 bg-white p-5">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  className="text-sm text-[#644aad]"
                  onClick={() => {
                    setSelectedSizes(new Set());
                    setSelectedBrands(new Set());
                    setSelectedColors(new Set());
                    setSortBy("recommended");
                  }}
                  type="button"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-5 mt-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#595c5d]">Sort By</label>
                  <select className="w-full rounded-xl border border-[#abadae]/30 bg-[#f8f9fa] px-3 py-2 text-sm outline-none focus:border-[#644aad]" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>

                {sizeOptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-[#595c5d] uppercase tracking-wider mb-2">Size</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {sizeOptions.map((size) => (
                        <button key={size} className={`py-2 border rounded-md text-sm ${selectedSizes.has(size) ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30 hover:bg-[#f1f4f6]"}`} onClick={() => toggleSet(size, selectedSizes, setSelectedSizes)} type="button">{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {brandOptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-[#595c5d] uppercase tracking-wider mb-2">Brand</h4>
                    <div className="space-y-1.5">
                      {brandOptions.map((brand) => (
                        <label className="flex items-center gap-2 text-sm" key={brand}>
                          <input checked={selectedBrands.has(brand)} onChange={() => toggleSet(brand, selectedBrands, setSelectedBrands)} type="checkbox" />
                          {brand}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {colorOptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-[#595c5d] uppercase tracking-wider mb-2">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button key={color} className={`rounded-full border px-3 py-1 text-xs ${selectedColors.has(color) ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30"}`} onClick={() => toggleSet(color, selectedColors, setSelectedColors)} type="button">{color}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section className="flex-1">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-[#abadae]/40 bg-white p-8 text-center text-[#595c5d]">Loading products...</div>
            ) : error ? (
              <div className="rounded-2xl border border-dashed border-[#abadae]/40 bg-white p-8 text-center text-[#9e3f4e]">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:bg-[#eff1f2]"
                      key={product._id}
                      onClick={() => router.push(`/sneakers/nova-form-strider?product=${encodeURIComponent(product.slug || product._id)}`)}
                    >
                      <div className="relative aspect-[4/5] bg-[#eff1f2] overflow-hidden p-4 flex items-center justify-center">
                        {product.video ? (
                          <video
                            autoPlay
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={product.video}
                          />
                        ) : (
                          <img alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" src={product.images[0] || "https://placehold.co/640x800?text=No+Image"} />
                        )}
                      </div>
                      <div className="pt-4 pb-4 px-3 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-base">{product.name}</h3>
                          <span className="font-medium">₹{product.price}</span>
                        </div>
                        <p className="text-sm text-[#595c5d]">{product.brand || product.subCategory || "Sneakers"}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            aria-label={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${isWishlisted(product._id) ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30 bg-white text-[#595c5d] hover:border-[#644aad]/40 hover:text-[#644aad]"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(toShopProduct(product));
                            }}
                            title={isWishlisted(product._id) ? "Wishlisted" : "Add to Wishlist"}
                            type="button"
                          >
                            <Heart className={`h-4 w-4 ${isWishlisted(product._id) ? "fill-current" : ""}`} />
                          </button>
                          <button
                            className="rounded-lg bg-[#111111] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(toShopProduct(product));
                            }}
                            type="button"
                          >
                            Add to Cart
                          </button>
                          <Link
                            className="text-xs text-[#644aad] hover:underline"
                            href={`/sneakers/nova-form-strider?product=${encodeURIComponent(product.slug || product._id)}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="mt-8 rounded-2xl border border-dashed border-[#abadae]/40 bg-white p-8 text-center text-[#595c5d]">No sneakers found for selected filters.</div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SneakersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f6f7]" />}>
      <SneakersPageContent />
    </Suspense>
  );
}
