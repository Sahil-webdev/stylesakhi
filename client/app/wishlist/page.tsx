"use client";

import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { rememberAuthRedirect } from "@/lib/auth-redirect";
import { resolveProductHref } from "@/lib/product-link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();
  const { isAuthenticated, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6">
          <PageBackButton className="bg-rose-50/80 hover:border-[#B91C1C66] hover:text-[#B91C1C]" fallbackHref="/" label="Back" />
        </div>
        {!authLoading && !isAuthenticated ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Login to view your wishlist</h1>
            <p className="mb-6 text-sm text-gray-600">Please login before saving products to wishlist.</p>
            <Link
              href="/auth"
              onClick={() => rememberAuthRedirect("Please login first to open your wishlist.")}
              className="inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a31919]"
            >
              Login
            </Link>
          </div>
        ) : (
          <>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-600">{wishlist.length} saved items</p>
          </div>
          <Heart className="h-7 w-7 text-[#B91C1C]" />
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Wishlist is empty</h2>
            <p className="mb-6 text-sm text-gray-600">Tap heart icons on product cards to save items here.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a31919]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {wishlist.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg">
                <button
                  className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm transition hover:text-red-500"
                  onClick={() => removeFromWishlist(item.id)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>

                <Link href={resolveProductHref(item)}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} />
                  </div>
                </Link>

                <div className="space-y-2 p-3">
                  <Link className="line-clamp-1 text-sm font-bold text-gray-900 transition hover:text-teal-700" href={resolveProductHref(item)}>
                    {item.name}
                  </Link>
                  <p className=" text-xs text-gray-500">{item.category}</p>
                  <p className="text-base font-bold text-gray-900">{"\u20B9"}{item.price.toLocaleString()}</p>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
                    onClick={() => addToCart(item)}
                    type="button"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    MOVE TO CART
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
