import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type AdminOrder = {
  _id: string;
  orderNumber: string;
  status: AdminOrderStatus;
  totalPrice: number;
  createdAt: string;
  shippingAddress?: {
    fullName?: string;
  };
  items: Array<{
    name: string;
  }>;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const statusClass: Record<string, string> = {
  delivered: "status-delivered",
  out_for_delivery: "status-processing",
  shipped: "status-processing",
  processing: "status-processing",
  confirmed: "status-pending",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const toLabel = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatInr = (amount: number) => `\u20B9${Number(amount || 0).toLocaleString("en-IN")}`;

export const RecentOrdersTable = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const renderState = (message: string, tone: "default" | "error" = "default") => (
    <div
      className={`px-5 py-6 text-sm ${
        tone === "error" ? "text-red-500" : "text-muted-foreground"
      }`}
    >
      {message}
    </div>
  );

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/admin/orders?limit=6`, {
          headers: getAdminAuthHeaders(),
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to fetch recent orders");
        }

        const nextOrders: AdminOrder[] = Array.isArray(payload?.data?.items) ? payload.data.items : [];
        setOrders(nextOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch recent orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className="border-b border-border/50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
            <p className="mt-1 text-xs text-muted-foreground md:hidden">
              Latest orders in a mobile-friendly view
            </p>
          </div>
          {!loading && !error ? (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {orders.length} shown
            </span>
          ) : null}
        </div>
      </div>

      <div className="md:hidden">
        {loading ? renderState("Loading recent orders...") : null}
        {!loading && error ? renderState(error, "error") : null}
        {!loading && !error && orders.length === 0 ? renderState("No recent orders found.") : null}

        {!loading && !error && orders.length > 0 ? (
          <div className="space-y-3 p-3">
            {orders.map((order, i) => (
              <motion.article
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
                className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Order ID
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                      #{order.orderNumber}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      statusClass[order.status] || "status-pending"
                    }`}
                  >
                    {toLabel(order.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Customer
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {order.shippingAddress?.fullName || "Customer"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Amount
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatInr(order.totalPrice || 0)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-muted/40 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Product
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                    {order.items?.[0]?.name || "Product"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.items?.length > 1 ? `+${order.items.length - 1} more item(s)` : "1 item"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Order date</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-border/50">
              {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={6}>
                  Loading recent orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-5 py-6 text-sm text-red-500" colSpan={6}>
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={6}>
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="cursor-pointer border-b border-border/30 transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-3.5 font-mono text-sm font-medium text-foreground">#{order.orderNumber}</td>
                  <td className="px-5 py-3.5 text-sm text-foreground">{order.shippingAddress?.fullName || "Customer"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    <div className="max-w-[220px]">
                      <p className="truncate text-sm text-foreground">{order.items?.[0]?.name || "Product"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length > 1 ? `+${order.items.length - 1} more item(s)` : "1 item"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{formatInr(order.totalPrice || 0)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${statusClass[order.status] || "status-pending"}`}>
                      {toLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

