"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { rememberAuthRedirect } from "@/lib/auth-redirect";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useShop();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 2000 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {!authLoading && !isAuthenticated ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Login to view your cart</h1>
            <p className="mb-6 text-sm text-gray-600">Please login before adding products to cart.</p>
            <Link
              href="/auth"
              onClick={() => rememberAuthRedirect("Please login first to open your cart.")}
              className="inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a31919]"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600">{cart.length} products in your cart</p>
          </div>
          {cart.length > 0 ? (
            <button
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
              onClick={clearCart}
              type="button"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Cart is empty</h2>
            <p className="mb-6 text-sm text-gray-600">Add items from product cards to see them here.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a31919]"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img alt={item.name} className="h-full w-full object-cover" src={item.image} />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <button
                        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">{"\u20B9"}{item.price.toLocaleString()}</p>
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                        <button
                          className="p-2 transition hover:bg-gray-100"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-9 border-x border-gray-300 px-3 py-1 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="p-2 transition hover:bg-gray-100"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:h-fit">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{"\u20B9"}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? "FREE" : `\u20B9${shipping}`}</span>
                </div>
              </div>
              <div className="my-4 h-px bg-gray-200" />
              <div className="mb-6 flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{"\u20B9"}{total.toLocaleString()}</span>
              </div>
              <Link className="mb-3 block w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-bold tracking-wide text-white transition hover:bg-teal-700" href="/checkout-flow">
                PROCEED TO CHECKOUT
              </Link>
              <Link className="block w-full rounded-xl border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50" href="/">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
