"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchProducts, ProductRecord } from "@/lib/products-api";
import { useShop } from "@/contexts/ShopContext";
import { Heart } from "lucide-react";
import PageBackButton from "@/components/PageBackButton";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function AccessoriesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(5000);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const generation = searchParams.get("generation") || "";
  const generationFallbackPath = generation === "boomer" ? "/boomers" : generation ? `/${generation}` : "/";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const items = await fetchProducts({
          category: "accessories",
          isActive: "true",
          limit: "200",
          ...(generation ? { generation } : {}),
        });
        if (mounted) {
          setProducts(items);
          const topPrice = items.length ? Math.max(...items.map((item) => item.price)) : 5000;
          setMaxPrice(Math.max(100, topPrice));
        }
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

  const categoryOptions = useMemo(() => Array.from(new Set(products.map((item) => item.subCategory).filter(Boolean))) as string[], [products]);
  const brandOptions = useMemo(() => Array.from(new Set(products.map((item) => item.brand).filter(Boolean))) as string[], [products]);

  const filteredProducts = useMemo(() => {
    let items = products.filter((item) => {
      const categoryOk = selectedCategories.size === 0 || (item.subCategory && selectedCategories.has(item.subCategory));
      const brandOk = selectedBrands.size === 0 || (item.brand && selectedBrands.has(item.brand));
      const priceOk = item.price <= maxPrice;
      return categoryOk && brandOk && priceOk;
    });

    if (sortBy === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") items = [...items].sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [products, selectedCategories, selectedBrands, maxPrice, sortBy]);

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
    category: "Accessories",
    href: `/accessories/croissant-leather-bag?product=${encodeURIComponent(product.slug || product._id)}`,
  });

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6">
          <PageBackButton className="bg-[#eef3ff] hover:border-[#644aad66] hover:text-[#644aad]" fallbackHref={generationFallbackPath} label="Back" />
        </div>
        <header className="mb-8 rounded-3xl border border-[#abadae]/20 bg-gradient-to-br from-white to-[#eff1f2] px-6 py-10 text-center shadow-sm md:px-10">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Accessories</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#595c5d] md:text-base">Dynamic accessories from admin panel with working filters and sorting.</p>
        </header>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#abadae]/20 bg-white/80 px-4 py-3 text-sm text-[#595c5d]">
          <span>
            Showing <strong className="text-[#2c2f30]">{filteredProducts.length}</strong> of {products.length} items
          </span>
          <span>Max Price: ₹{maxPrice}</span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="sticky top-20 space-y-5 rounded-2xl border border-[#abadae]/20 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  className="text-sm font-medium text-[#644aad] hover:underline"
                  onClick={() => {
                    setSelectedCategories(new Set());
                    setSelectedBrands(new Set());
                    setSortBy("recommended");
                    const topPrice = products.length ? Math.max(...products.map((item) => item.price)) : 5000;
                    setMaxPrice(Math.max(100, topPrice));
                  }}
                  type="button"
                >
                  Clear
                </button>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#595c5d]">Sort By</label>
                <select className="w-full rounded-xl border border-[#abadae]/30 bg-[#f8f9fa] px-3 py-2 text-sm outline-none focus:border-[#644aad]" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>

              {categoryOptions.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#595c5d]">Sub Category</p>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <label className="flex cursor-pointer items-center gap-2 text-sm" key={category}>
                        <input checked={selectedCategories.has(category)} className="h-4 w-4 rounded border-[#abadae]/40 text-[#644aad]" onChange={() => toggleSet(category, selectedCategories, setSelectedCategories)} type="checkbox" />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {brandOptions.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#595c5d]">Brand</p>
                  <div className="flex flex-wrap gap-2">
                    {brandOptions.map((brand) => (
                      <button
                        className={`rounded-full border px-3 py-1 text-xs transition ${selectedBrands.has(brand) ? "border-[#644aad] bg-[#ece7ff] text-[#644aad]" : "border-[#abadae]/30 bg-white text-[#595c5d] hover:border-[#644aad]/40"}`}
                        key={brand}
                        onClick={() => toggleSet(brand, selectedBrands, setSelectedBrands)}
                        type="button"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#595c5d]">Price Range</p>
                <input className="w-full accent-[#644aad]" max={Math.max(100, ...products.map((p) => p.price), 100)} min={100} onChange={(e) => setMaxPrice(Number(e.target.value))} step={10} type="range" value={maxPrice} />
                <div className="mt-1 flex justify-between text-xs text-[#595c5d]">
                  <span>₹100</span>
                  <span>₹{Math.max(100, ...products.map((p) => p.price), 100)}</span>
                </div>
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
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#abadae]/20 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      key={product._id}
                      onClick={() => router.push(`/accessories/croissant-leather-bag?product=${encodeURIComponent(product.slug || product._id)}`)}
                    >
                      <Link href={`/accessories/croissant-leather-bag?product=${encodeURIComponent(product.slug || product._id)}`} onClick={(e) => e.stopPropagation()}>
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#eff1f2]">
                          {product.video ? (
                            <video
                              autoPlay
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              src={product.video}
                            />
                          ) : (
                            <img alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.images[0] || "https://placehold.co/640x800?text=No+Image"} />
                          )}
                        </div>
                      </Link>

                      <div className="space-y-3 p-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#595c5d]">{product.brand || "Accessory"}</p>
                          <Link className="text-lg font-bold hover:text-[#644aad]" href={`/accessories/croissant-leather-bag?product=${encodeURIComponent(product.slug || product._id)}`} onClick={(e) => e.stopPropagation()}>
                            {product.name}
                          </Link>
                          <p className="text-sm font-semibold text-[#644aad]">₹{product.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="flex-1 rounded-lg bg-[#111111] px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(toShopProduct(product));
                            }}
                            type="button"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="mt-8 rounded-2xl border border-dashed border-[#abadae]/40 bg-white p-8 text-center text-[#595c5d]">No accessories found for selected filters.</div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f6f7]" />}>
      <AccessoriesPageContent />
    </Suspense>
  );
}
