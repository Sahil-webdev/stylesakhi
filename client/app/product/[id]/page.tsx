"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/contexts/ShopContext";
import { fetchProductBySlug, type ProductRecord } from "@/lib/products-api";
import { resolveProductHref } from "@/lib/product-link";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

const colorPalette: Record<string, string> = {
  black: "#111827",
  white: "#ffffff",
  blue: "#3b82f6",
  navy: "#1e3a8a",
  red: "#dc2626",
  green: "#16a34a",
  pink: "#ec4899",
  yellow: "#eab308",
  beige: "#d6c7a1",
  brown: "#8b5e3c",
  grey: "#6b7280",
  gray: "#6b7280",
  purple: "#7c3aed",
  orange: "#f97316",
};

const toColorHex = (color: string) => {
  const value = String(color || "").trim();
  if (!value) return "#d1d5db";
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(value)) return value;
  return colorPalette[value.toLowerCase()] || "#d1d5db";
};

const formatInr = (value: number) => `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = String(params?.id || "");

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductBySlug(productId);
        if (!active) return;
        if (!data?._id) {
          setError("Product not found");
          setProduct(null);
          return;
        }
        setProduct(data);
        setSelectedImage(0);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
      } catch {
        if (!active) return;
        setError("Product not found");
        setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (productId) {
      void loadProduct();
    } else {
      setLoading(false);
      setError("Invalid product");
    }

    return () => {
      active = false;
    };
  }, [productId]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    return ["/hero/hero.jpeg"];
  }, [product]);

  const shopProduct = useMemo(() => {
    if (!product) return null;
    return {
      id: product._id,
      name: product.name,
      price: Number(product.discountPrice ?? product.price ?? 0),
      image: images[0],
      video: product.video,
      category: product.subCategory || product.category,
      href: resolveProductHref({ id: product.slug || product._id, href: `/product/${product.slug || product._id}` }),
    };
  }, [images, product]);

  const rating = Number(product?.averageRating || 0);
  const reviews = Number(product?.numReviews || 0);
  const mrp = Number(product?.price || 0);
  const sellingPrice = Number(product?.discountPrice ?? product?.price ?? 0);
  const hasDiscount = mrp > sellingPrice;
  const discountPct = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const wishlisted = Boolean(shopProduct && isWishlisted(shopProduct.id));
  const deliveryLabel = formatDeliveryFromNow(7);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-white/80" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-white/80" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-white/80" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-white/80" />
              <div className="h-10 w-40 animate-pulse rounded bg-white/80" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Product not found</h1>
          <p className="mt-3 text-sm text-gray-600">Yeh product ab available nahi hai ya link invalid hai.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/" className="rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a31919]">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-5">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#B91C1C66] hover:text-[#B91C1C]">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href={`/${product.generation}`} className="hover:text-gray-900">
            {String(product.generation || "").toUpperCase()}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="group relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-white">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" />

              {discountPct > 0 ? (
                <div className="absolute left-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                  {discountPct}% OFF
                </div>
              ) : null}

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow transition group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow transition group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="grid grid-cols-5 gap-3">
                {images.map((image, idx) => (
                  <button
                    key={`${image}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 ${
                      selectedImage === idx ? "border-gray-900" : "border-gray-200"
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">{product.brand || "StyleSakhi"}</p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-1 text-sm text-gray-600">{product.subCategory || product.category}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-5 w-5 ${idx < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-600">({reviews} reviews)</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatInr(sellingPrice)}</span>
              {hasDiscount ? <span className="text-xl text-gray-400 line-through">{formatInr(mrp)}</span> : null}
              {hasDiscount ? <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">{discountPct}% OFF</span> : null}
            </div>

            <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
              Expected delivery by <span className="font-semibold">{deliveryLabel}</span>
            </p>

            {product.colors?.length ? (
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-9 w-9 rounded-full border-2 ${selectedColor === color ? "border-gray-900" : "border-gray-300"}`}
                      title={color}
                      style={{ backgroundColor: toColorHex(color) }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {product.sizes?.length ? (
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border-2 px-5 py-2 text-sm font-semibold ${
                        selectedSize === size ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-800"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Quantity</p>
              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                <span className="min-w-10 border-x border-gray-300 px-4 py-2 text-center font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((prev) => prev + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (shopProduct) addToCart(shopProduct, quantity);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold tracking-wide text-white hover:bg-teal-700"
              >
                <ShoppingCart className="h-5 w-5" />
                ADD TO CART
              </button>
              <button
                type="button"
                onClick={() => {
                  if (shopProduct) toggleWishlist(shopProduct);
                }}
                className={`rounded-xl border-2 px-5 ${wishlisted ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-gray-400"}`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-pink-500 text-pink-500" : "text-gray-700"}`} />
              </button>
            </div>

            {product.description ? (
              <div className="rounded-xl bg-white p-4">
                <h2 className="text-base font-bold text-gray-900">Description</h2>
                <p className="mt-2 text-sm leading-7 text-gray-700">{product.description}</p>
              </div>
            ) : null}

            {product.productDetails && Object.keys(product.productDetails).length > 0 ? (
              <div className="rounded-xl bg-white p-4">
                <h2 className="text-base font-bold text-gray-900">Specifications</h2>
                <div className="mt-3 divide-y divide-gray-200">
                  {Object.entries(product.productDetails).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-3 py-2 text-sm">
                      <span className="font-semibold text-gray-900">{key}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

