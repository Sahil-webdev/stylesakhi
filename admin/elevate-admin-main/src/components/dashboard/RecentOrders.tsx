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

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

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

const formatInr = (amount: number) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export const RecentOrdersTable = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
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
