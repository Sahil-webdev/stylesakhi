"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatDeliveryDate, resolveExpectedDeliveryDate } from "@/lib/delivery-estimate";

type OrderStatusUI = "active" | "delivered" | "cancelled";
type StepStage = "placed" | "confirmed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

type OrderItemCard = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  variant: string;
};

type OrderCard = {
  id: string;
  orderNo: string;
  dateLabel: string;
  amount: number;
  status: OrderStatusUI;
  paymentLabel: string;
  progressLabel: string;
  currentStage: StepStage;
  expectedDeliveryLabel: string;
  items: OrderItemCard[];
  address: string;
};

type ApiOrderItemRaw = {
  name?: string;
  image?: string;
  quantity?: number;
  size?: string;
  color?: string;
};

type ApiOrderRaw = {
  _id?: string;
  orderNumber?: string;
  totalPrice?: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  expectedDeliveryDate?: string;
  shippingAddress?: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items?: ApiOrderItemRaw[];
};

const ORDER_STEPS = [
  { id: "placed", label: "Placed", icon: "check" },
  { id: "confirmed", label: "Confirmed", icon: "check" },
  { id: "shipped", label: "Shipped", icon: "check" },
  { id: "out_for_delivery", label: "Out for Delivery", icon: "local_shipping" },
  { id: "delivered", label: "Delivered", icon: "home" },
] as const;

function getStepIndex(stage: StepStage) {
  if (stage === "cancelled") return 0;
  const index = ORDER_STEPS.findIndex((step) => step.id === stage);
  return index < 0 ? 0 : index;
}

function mapStatusToUI(status: string): OrderStatusUI {
  if (status === "delivered") return "delivered";
  if (status === "cancelled") return "cancelled";
  return "active";
}

function mapStatusToStage(status: string): StepStage {
  if (status === "cancelled") return "cancelled";
  if (status === "delivered") return "delivered";
  if (status === "out_for_delivery") return "out_for_delivery";
  if (status === "shipped") return "shipped";
  if (status === "processing") return "shipped";
  if (status === "confirmed") return "confirmed";
  return "placed";
}

function mapStatusLabel(status: string): string {
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  if (status === "out_for_delivery") return "Out for Delivery";
  if (status === "shipped") return "Shipped";
  if (status === "processing") return "Shipped";
  if (status === "confirmed") return "Confirmed";
  return "Placed";
}

function formatDate(value?: string): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatVariant(item: ApiOrderItemRaw) {
  const parts: string[] = [];
  if (item?.size) parts.push(`Size: ${item.size}`);
  if (item?.color) parts.push(`Color: ${item.color}`);
  return parts.join(" | ") || `Qty: ${item?.quantity || 1}`;
}

function toOrderCard(raw: ApiOrderRaw): OrderCard {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  const shippingAddress = raw?.shippingAddress || {};
  return {
    id: raw?._id || raw?.orderNumber || Math.random().toString(36).slice(2),
    orderNo: raw?.orderNumber || "N/A",
    dateLabel: formatDate(raw?.createdAt),
    amount: Number(raw?.totalPrice || 0),
    status: mapStatusToUI(raw?.status || "pending"),
    paymentLabel: `${String(raw?.paymentMethod || "COD").toUpperCase()} • ${String(raw?.paymentStatus || "pending")}`,
    progressLabel: mapStatusLabel(raw?.status || "pending"),
    currentStage: mapStatusToStage(raw?.status || "pending"),
    expectedDeliveryLabel: formatDeliveryDate(resolveExpectedDeliveryDate(raw?.expectedDeliveryDate, raw?.createdAt)),
    items: items.map((item: ApiOrderItemRaw, idx: number) => ({
      id: `${raw?._id || "order"}-${idx}`,
      name: item?.name || "Product",
      image: item?.image || "https://placehold.co/300x400?text=No+Image",
      quantity: Number(item?.quantity || 1),
      variant: formatVariant(item),
    })),
    address: [
      shippingAddress?.fullName,
      shippingAddress?.addressLine1,
      shippingAddress?.addressLine2,
      shippingAddress?.city,
      shippingAddress?.state,
      shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", "),
  };
}

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | OrderStatusUI>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<OrderCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const showActionMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 1800);
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const response = await api.getOrders({ limit: "100" });
      if (!response.success) {
        setError(response.error || "Failed to fetch orders");
        setOrders([]);
        setLoading(false);
        return;
      }

      const rawItems = response.data?.items || [];
      const mapped = rawItems.map(toOrderCard);
      setOrders(mapped);
      setExpandedId((prev) => {
        if (!mapped.length) return "";
        if (!prev) return mapped[0].id;
        return mapped.some((order) => order.id === prev) ? prev : mapped[0].id;
      });
      setLoading(false);
    };

    loadOrders();
    return;
  }, [authLoading, isAuthenticated]);

  const handleCancelOrder = async (id: string, orderNo: string) => {
    setCancellingId(id);
    const response = await api.cancelOrder(id, "Cancelled by customer");
    setCancellingId("");
    if (!response.success) {
      showActionMessage(response.error || "Unable to cancel order");
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "cancelled",
              progressLabel: "Cancelled",
              currentStage: "cancelled",
            }
          : order,
      ),
    );
    showActionMessage(`Order ${orderNo} cancelled`);
  };

  const filteredOrders = useMemo(() => {
    const tabFiltered = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab);
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(
      (order) =>
        order.orderNo.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q)),
    );
  }, [activeTab, orders, search]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2d3335]">
      <Navbar />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
        .orders-headline { font-family: "Manrope", sans-serif; }
        .orders-body { font-family: "Inter", sans-serif; }
      `}</style>

      <main className="orders-body mx-auto w-full max-w-5xl px-4 pb-24 pt-24 md:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-10 md:mb-14">
          <h1 className="orders-headline mb-3 text-4xl font-bold tracking-tight text-[#2d3335] md:text-5xl">Your Orders</h1>
          <p className="text-lg text-[#5a6062]">Track, manage and revisit your purchases.</p>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
              {[
                { id: "all", label: "All Orders" },
                { id: "active", label: "Active" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-[#e4dffd] text-[#524f67]" : "border border-[#adb3b5]/20 bg-white text-[#2d3335] hover:bg-[#f1f4f5]"}`}
                  onClick={() => setActiveTab(tab.id as "all" | OrderStatusUI)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6062]">search</span>
              <input
                className="w-full rounded-md border border-[#adb3b5]/15 bg-white py-3 pl-12 pr-4 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#4b5aa4]/25"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                type="text"
                value={search}
              />
            </div>
          </div>
        </motion.div>

        {!isAuthenticated && !authLoading ? (
          <div className="rounded-xl border border-dashed border-[#adb3b5]/30 bg-white p-10 text-center">
            <p className="mb-4 text-[#5a6062]">Please login to see your orders.</p>
            <Link className="inline-flex rounded-full bg-[#4b5aa4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3e4d97]" href="/auth">
              Go to Login
            </Link>
          </div>
        ) : loading ? (
          <div className="rounded-xl border border-dashed border-[#adb3b5]/30 bg-white p-10 text-center text-[#5a6062]">Loading orders...</div>
        ) : error ? (
          <div className="rounded-xl border border-dashed border-[#adb3b5]/30 bg-white p-10 text-center text-[#a8364b]">{error}</div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => {
                const expanded = expandedId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="relative z-10 rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(45,51,53,0.06)] transition-all hover:shadow-[0_25px_50px_rgba(45,51,53,0.1)]"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                      <div className="flex w-full flex-col gap-2 md:w-1/4">
                        <span className="text-sm uppercase tracking-wider text-[#5a6062]">{order.dateLabel}</span>
                        <span className="text-sm text-[#767c7e]">#{order.orderNo}</span>
                        <p className="text-xs text-[#4b5aa4]">Expected by: {order.expectedDeliveryLabel}</p>
                        <div className={`mt-2 inline-flex w-max items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${order.status === "active" ? "bg-[#97a6f7]/20 text-[#3e4d97]" : order.status === "delivered" ? "bg-[#dbe3f0] text-[#4c545e]" : "bg-[#f97386]/20 text-[#a8364b]"}`}>
                          <span className="material-symbols-outlined text-[15px]">{order.status === "active" ? "local_shipping" : order.status === "delivered" ? "done_all" : "cancel"}</span>
                          <span>{order.progressLabel}</span>
                        </div>
                      </div>

                      <div className="flex w-full items-center gap-4 md:w-1/2">
                        <div className="h-20 w-16 overflow-hidden rounded-lg bg-[#f1f4f5]">
                          <img alt={order.items[0]?.name || "Product"} className={`h-full w-full object-cover ${order.status === "cancelled" ? "grayscale opacity-70" : ""}`} src={order.items[0]?.image || "https://placehold.co/300x400?text=No+Image"} />
                        </div>
                        <div>
                          <span className={`orders-headline text-lg font-semibold text-[#2d3335] ${order.status === "cancelled" ? "line-through opacity-70" : ""}`}>{order.items[0]?.name || "Order Item"}</span>
                          <p className="text-sm text-[#5a6062]">{order.items[0]?.variant || "Qty: 1"}</p>
                          {order.items.length > 1 ? <p className="mt-1 text-xs text-[#4b5aa4]">+{order.items.length - 1} more items</p> : null}
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between md:w-1/4 md:flex-col md:items-end">
                        <div className="text-right">
                          <span className="orders-headline text-2xl font-bold text-[#2d3335]">₹{order.amount.toFixed(2)}</span>
                          <p className="mt-1 text-xs text-[#5a6062]">{order.paymentLabel}</p>
                        </div>
                        <button className="p-2 text-[#5a6062] transition-colors hover:text-[#4b5aa4]" onClick={() => setExpandedId(expanded ? "" : order.id)} type="button">
                          <span className="material-symbols-outlined">{expanded ? "expand_less" : "expand_more"}</span>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 border-t border-[#adb3b5]/20 pt-6">
                            {order.status !== "cancelled" ? (
                              <div className="mb-7">
                                <div className="relative pb-1">
                                  <div className="absolute left-0 right-0 top-4 h-[2px] bg-[#dee3e6]" />
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(getStepIndex(order.currentStage) / (ORDER_STEPS.length - 1)) * 100}%` }}
                                    transition={{ duration: 0.65, ease: "easeOut" }}
                                    className="absolute left-0 top-4 h-[2px] bg-[#4b5aa4]"
                                  />
                                  <div className="relative grid grid-cols-5 gap-2">
                                    {ORDER_STEPS.map((step, stepIndex) => {
                                      const currentIndex = getStepIndex(order.currentStage);
                                      const completed = stepIndex < currentIndex;
                                      const current = stepIndex === currentIndex;
                                      const upcoming = stepIndex > currentIndex;

                                      return (
                                        <div key={step.id} className="flex flex-col items-center">
                                          <motion.div
                                            initial={{ scale: 0.94, opacity: 0.9 }}
                                            animate={{
                                              scale: current ? [1, 1.08, 1] : 1,
                                              opacity: 1,
                                            }}
                                            transition={{
                                              duration: current ? 1.2 : 0.25,
                                              repeat: current ? Infinity : 0,
                                              repeatDelay: 0.5,
                                            }}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[16px] ${
                                              completed
                                                ? "border-[#4b5aa4] bg-[#4b5aa4] text-white"
                                                : current
                                                  ? "border-[#4b5aa4] bg-[#97a6f7]/25 text-[#3e4d97] shadow-[0_0_0_4px_rgba(151,166,247,0.22)]"
                                                  : "border-[#dee3e6] bg-[#f1f4f5] text-[#767c7e]"
                                            }`}
                                          >
                                            <span className="material-symbols-outlined !text-[16px]">{step.icon}</span>
                                          </motion.div>
                                          <p
                                            className={`mt-2 text-center text-xs ${
                                              current ? "font-semibold text-[#4b5aa4]" : upcoming ? "text-[#767c7e]" : "text-[#5a6062]"
                                            }`}
                                          >
                                            {step.label}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                              <div className="md:w-1/2">
                                <p className="mb-1 text-xs uppercase tracking-wider text-[#5a6062]">Delivery Address</p>
                                <p className="text-sm text-[#2d3335]">{order.address || "Address unavailable"}</p>
                                <p className="mt-2 text-sm text-[#3e4d97]">
                                  Expected delivery by <span className="font-semibold">{order.expectedDeliveryLabel}</span>
                                </p>
                              </div>
                              <div className="flex w-full gap-3 md:w-auto">
                                <button className="flex-1 rounded-full border border-[#adb3b5]/20 bg-transparent px-5 py-2.5 text-sm font-medium text-[#4b5aa4] transition hover:bg-[#f1f4f5] md:flex-none" onClick={() => showActionMessage(`Details viewed for ${order.orderNo}`)} type="button">
                                  View Details
                                </button>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <button className="rounded-full border border-[#adb3b5]/20 px-4 py-2 text-sm text-[#2d3335] transition hover:bg-[#f1f4f5]" onClick={() => showActionMessage(`Invoice downloaded for ${order.orderNo}`)} type="button">
                                Download Invoice
                              </button>
                              {order.status !== "cancelled" && order.status !== "delivered" ? (
                                <button
                                  className="rounded-full border border-[#f97386]/30 px-4 py-2 text-sm text-[#a8364b] transition hover:bg-[#f97386]/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={cancellingId === order.id}
                                  onClick={() => handleCancelOrder(order.id, order.orderNo)}
                                  type="button"
                                >
                                  {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                                </button>
                              ) : null}
                              {order.status === "delivered" ? (
                                <button className="rounded-full border border-[#97a6f7]/30 px-4 py-2 text-sm text-[#3e4d97] transition hover:bg-[#97a6f7]/15" onClick={() => showActionMessage(`Review opened for ${order.orderNo}`)} type="button">
                                  Write Review
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {!filteredOrders.length ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-dashed border-[#adb3b5]/30 bg-white p-10 text-center">
                <p className="mb-4 text-[#5a6062]">No orders found for this filter.</p>
                <Link className="inline-flex rounded-full bg-[#4b5aa4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3e4d97]" href="/">
                  Continue Shopping
                </Link>
              </motion.div>
            ) : null}
          </div>
        )}

        <AnimatePresence>
          {message ? (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="fixed bottom-6 right-6 z-50 rounded-full bg-[#2d3335] px-5 py-2.5 text-sm text-white shadow-lg">
              {message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
