"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { formatDeliveryFromNow } from "@/lib/delivery-estimate";

type PaymentMethod = "razorpay" | "cod";

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutFlowPage() {
  const router = useRouter();
  const { cart, clearCart } = useShop();
  const { isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [validationError, setValidationError] = useState("");
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const taxableAmount = subtotal - discount + deliveryFee;
  const taxes = Math.round(taxableAmount * 0.08);
  const total = taxableAmount + taxes;
  const checkoutDeliveryLabel = useMemo(() => formatDeliveryFromNow(7), []);

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponApplied(false);
      return;
    }
    setCouponApplied(true);
  };

  const placeOrder = async () => {
    setValidationError("");
    if (!cart.length) {
      setValidationError("Your cart is empty.");
      return;
    }
    if (!isAuthenticated) {
      setValidationError("Please login first to place your order.");
      router.push("/auth");
      return;
    }
    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
      setValidationError("Please complete all shipping details.");
      return;
    }

    setPlacingOrder(true);
    try {
      const objectIdRegex = /^[a-f\d]{24}$/i;
      const orderItems = cart
        .filter((item) => objectIdRegex.test(item.id))
        .map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }));

      if (orderItems.length !== cart.length || orderItems.length === 0) {
        setValidationError("Some cart items are demo products. Please add products from catalog view-more pages.");
        return;
      }

      const payload = {
        items: orderItems,
        paymentMethod,
        shippingAddress: {
          fullName,
          phone,
          addressLine1: address,
          city,
          state: stateName,
          pincode,
          country: "India",
        },
        shippingPrice: deliveryFee,
        taxPrice: taxes,
      };

      if (paymentMethod === "razorpay") {
        const scriptLoaded = await loadRazorpayScript();
        const Razorpay = window.Razorpay;
        if (!scriptLoaded || !Razorpay) {
          setValidationError("Unable to load Razorpay checkout. Please try again.");
          return;
        }

        const createResponse = await api.createRazorpayOrder(payload);
        if (!createResponse.success || !createResponse.data) {
          setValidationError(createResponse.error || "Failed to initialize Razorpay payment.");
          return;
        }

        const rzData = createResponse.data;

        const paymentResult = await new Promise<{
          ok: boolean;
          data?: RazorpayHandlerResponse;
          error?: string;
        }>((resolve) => {
          const rzp = new Razorpay({
            key: rzData.keyId,
            amount: rzData.amount,
            currency: rzData.currency || "INR",
            name: "StyleSakhi",
            description: `Order #${rzData.orderNumber}`,
            order_id: rzData.razorpayOrderId,
            prefill: {
              name: fullName,
              email,
              contact: phone,
            },
            theme: { color: "#4b5aa4" },
            handler: (response: RazorpayHandlerResponse) => {
              resolve({ ok: true, data: response });
            },
            modal: {
              ondismiss: () => resolve({ ok: false, error: "Payment cancelled by user." }),
            },
          });
          rzp.open();
        });

        if (!paymentResult.ok || !paymentResult.data) {
          setValidationError(paymentResult.error || "Payment was not completed.");
          return;
        }

        const verifyResponse = await api.verifyRazorpayPayment({
          appOrderId: rzData.appOrderId,
          ...paymentResult.data,
        });

        if (!verifyResponse.success) {
          setValidationError(verifyResponse.error || "Payment verification failed.");
          return;
        }
      } else {
        const response = await api.createOrder(payload);
        if (!response.success) {
          setValidationError(response.error || "Failed to place order. Please try again.");
          return;
        }
      }

      setOrderSuccess(true);
      setShowSuccessModal(true);
      clearCart();
      redirectTimerRef.current = setTimeout(() => {
        router.push("/orders");
      }, 2200);
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2d3335]">
      <Navbar />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .checkout-headline {
          font-family: "Manrope", sans-serif;
        }

        .checkout-body {
          font-family: "Inter", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
        }
      `}</style>

      <main className="checkout-body mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-10">
          <h1 className="checkout-headline mb-2 text-4xl font-extrabold tracking-tight text-[#2d3335] sm:text-5xl">Checkout</h1>
          <p className="text-lg text-[#5a6062]">Complete your order securely.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="space-y-10 lg:col-span-7">
            <section className="rounded-2xl bg-[#f1f4f5] p-6 sm:p-8">
              <div className="mb-6 flex items-center space-x-3">
                <span className="material-symbols-outlined text-[28px] text-[#4b5aa4]">local_shipping</span>
                <h2 className="checkout-headline text-2xl font-bold">Shipping Details</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#5a6062]" htmlFor="fullName">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#adb3b5]">person</span>
                      <input id="fullName" className="w-full rounded-md border-none bg-white py-3 pl-11 pr-4 text-sm text-[#2d3335] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" type="text" value={fullName} />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#5a6062]" htmlFor="phone">Phone</label>
                    <div className="relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#adb3b5]">call</span>
                      <input id="phone" className="w-full rounded-md border-none bg-white py-3 pl-11 pr-4 text-sm text-[#2d3335] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" type="tel" value={phone} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#5a6062]" htmlFor="email">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#adb3b5]">mail</span>
                    <input id="email" className="w-full rounded-md border-none bg-white py-3 pl-11 pr-4 text-sm text-[#2d3335] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email" value={email} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#5a6062]" htmlFor="address">Full Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-3 text-[20px] text-[#adb3b5]">location_on</span>
                    <textarea id="address" className="w-full resize-none rounded-md border-none bg-white py-3 pl-11 pr-4 text-sm text-[#2d3335] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setAddress(e.target.value)} placeholder="123 Ethereal Lane, Apt 4B" rows={3} value={address} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <input className="w-full rounded-md border-none bg-white px-4 py-3 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setCity(e.target.value)} placeholder="City" type="text" value={city} />
                  <input className="w-full rounded-md border-none bg-white px-4 py-3 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setStateName(e.target.value)} placeholder="State" type="text" value={stateName} />
                  <input className="w-full rounded-md border-none bg-white px-4 py-3 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" type="text" value={pincode} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-[#f1f4f5] p-6 sm:p-8">
              <div className="mb-6 flex items-center space-x-3">
                <span className="material-symbols-outlined text-[28px] text-[#4b5aa4]">credit_card</span>
                <h2 className="checkout-headline text-2xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className={`relative flex cursor-pointer flex-col items-start rounded-xl border p-6 transition-all sm:flex-row sm:items-center ${paymentMethod === "razorpay" ? "border-[#4b5aa4] bg-white ring-1 ring-[#4b5aa4]/20 shadow-[0_8px_16px_rgba(45,51,53,0.04)]" : "border-transparent bg-white/70 opacity-80 hover:opacity-100 hover:shadow-[0_12px_24px_rgba(45,51,53,0.04)]"}`}>
                  <input checked={paymentMethod === "razorpay"} className="h-5 w-5 cursor-pointer border-[#adb3b5]/30 text-[#4b5aa4] focus:ring-[#4b5aa4]/20" name="payment_method" onChange={() => setPaymentMethod("razorpay")} type="radio" />
                  <div className="ml-0 mt-3 flex w-full flex-grow flex-col justify-between sm:ml-4 sm:mt-0 sm:flex-row sm:items-center">
                    <div>
                      <span className="mb-1 block text-base font-semibold text-[#2d3335]">Razorpay Secure</span>
                      <span className="block text-sm text-[#5a6062]">Pay securely using UPI, Cards, Net Banking</span>
                    </div>
                    <div className="mt-3 flex items-center space-x-2 text-[#767c7e] sm:mt-0">
                      <span className="material-symbols-outlined text-[24px]">account_balance</span>
                      <span className="material-symbols-outlined text-[24px]">payments</span>
                    </div>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer flex-col items-start rounded-xl border p-6 transition-all sm:flex-row sm:items-center ${paymentMethod === "cod" ? "border-[#4b5aa4] bg-white ring-1 ring-[#4b5aa4]/20 shadow-[0_8px_16px_rgba(45,51,53,0.04)]" : "border-transparent bg-white/70 opacity-80 hover:opacity-100 hover:shadow-[0_12px_24px_rgba(45,51,53,0.04)]"}`}>
                  <input checked={paymentMethod === "cod"} className="h-5 w-5 cursor-pointer border-[#adb3b5]/30 text-[#4b5aa4] focus:ring-[#4b5aa4]/20" name="payment_method" onChange={() => setPaymentMethod("cod")} type="radio" />
                  <div className="ml-0 mt-3 flex w-full flex-grow flex-col justify-between sm:ml-4 sm:mt-0 sm:flex-row sm:items-center">
                    <div>
                      <span className="mb-1 block text-base font-semibold text-[#2d3335]">Cash on Delivery</span>
                      <span className="block text-sm text-[#5a6062]">Pay in cash when your order is delivered</span>
                    </div>
                    <div className="mt-3 flex items-center text-[#767c7e] sm:mt-0">
                      <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="lg:col-span-5">
            <div className="sticky top-12 rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(45,51,53,0.06)]">
              <h2 className="checkout-headline mb-8 text-2xl font-bold">Order Summary</h2>

              <div className="mb-8 space-y-6">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div className="flex items-center space-x-4" key={item.id}>
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#f1f4f5]">
                        <img alt={item.name} className="h-full w-full object-cover" src={item.image} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-[#2d3335]">{item.name}</h3>
                        <p className="mt-1 text-sm text-[#5a6062]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-[#2d3335]">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#5a6062]">No items in cart.</p>
                )}
              </div>

              <div className="mb-8">
                <div className="flex space-x-3">
                  <input className="flex-grow rounded-md border-none bg-[#f1f4f5] px-4 py-3 text-sm text-[#2d3335] shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/20" onChange={(e) => setCouponCode(e.target.value)} placeholder="Gift card or discount code" type="text" value={couponCode} />
                  <button className="rounded-md bg-[#dee3e6] px-6 py-3 text-sm font-semibold text-[#2d3335] transition-colors hover:bg-[#d5dbdd]" onClick={applyCoupon} type="button">
                    Apply
                  </button>
                </div>
              </div>

              <div className="mb-8 space-y-4 border-y border-[#adb3b5]/15 py-6">
                <div className="flex justify-between text-[#5a6062]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2d3335]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#5a6062]">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-[#2d3335]">₹{deliveryFee.toLocaleString()}</span>
                </div>
                {couponApplied ? (
                  <div className="flex justify-between text-[#4b5aa4]">
                    <span>Discount ({couponCode || "SAVE10"})</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                ) : null}
              </div>

              <div className="mb-8 flex justify-between items-end">
                <div>
                  <span className="block text-lg font-semibold text-[#2d3335]">Total</span>
                  <span className="mt-1 block text-xs text-[#5a6062]">Including ₹{taxes.toLocaleString()} in taxes</span>
                </div>
                <span className="checkout-headline text-3xl font-extrabold text-[#2d3335]">₹{total.toLocaleString()}</span>
              </div>

              <motion.button whileHover={{ y: -1, boxShadow: "0 12px 24px rgba(75,90,164,0.3)" }} whileTap={{ scale: 0.98 }} className="mb-4 flex w-full items-center justify-center space-x-2 rounded-full bg-gradient-to-br from-[#4b5aa4] to-[#97a6f7] py-4 text-lg font-semibold text-[#faf8ff] transition-all" disabled={placingOrder} onClick={placeOrder} type="button">
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>{placingOrder ? "Placing..." : "Place Order"}</span>
              </motion.button>

              <Link className="mb-6 block text-center text-sm font-medium text-[#4b5aa4] hover:underline" href="/cart">
                Return to cart
              </Link>

              {validationError ? <p className="mb-4 text-sm font-medium text-[#a8364b]">{validationError}</p> : null}
              {orderSuccess ? <p className="mb-4 rounded-lg bg-[#e8efff] px-3 py-2 text-sm font-medium text-[#1e2e77]">Order placed successfully.</p> : null}

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-2 rounded-full bg-[#f1f4f5] px-4 py-2 text-sm text-[#5a6062]">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Secure Checkout Processing</span>
                </div>
                <p className="text-center text-xs text-[#5a6062]">
                  Estimated delivery: <span className="font-semibold text-[#2d3335]">{checkoutDeliveryLabel}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showSuccessModal ? (
          <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            <motion.div animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl" initial={{ opacity: 0, scale: 0.92, y: 16 }} transition={{ duration: 0.28 }}>
              <motion.div animate={{ scale: [1, 1.08, 1] }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8efff] text-[#4b5aa4]" transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.5 }}>
                <span className="material-symbols-outlined text-[34px]">check_circle</span>
              </motion.div>
              <h3 className="checkout-headline text-2xl font-extrabold text-[#2d3335]">Order Placed Successfully</h3>
              <p className="mt-2 text-sm text-[#5a6062]">Redirecting to your Orders page...</p>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#ebeef0]">
                <motion.div animate={{ x: ["-100%", "0%"] }} className="h-full bg-gradient-to-r from-[#4b5aa4] to-[#97a6f7]" transition={{ duration: 2, ease: "easeOut" }} />
              </div>

              <button className="mt-5 rounded-full border border-[#adb3b5]/30 px-5 py-2 text-sm font-medium text-[#4b5aa4] hover:bg-[#f1f4f5]" onClick={() => router.push("/orders")} type="button">
                Go to Orders Now
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
