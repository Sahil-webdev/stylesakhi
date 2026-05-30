import { Fragment, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuthHeaders } from "@/lib/adminAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

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
  expectedDeliveryDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalPrice: number;
  createdAt: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  items: Array<{
    product?: string;
    name: string;
    image?: string;
    price?: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
};

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

const statusOptions = ["all", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"];
const adminUpdateOptions: AdminOrderStatus[] = ["confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"];

const toLabel = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatInr = (amount: number) => `\u20B9${Number(amount || 0).toLocaleString("en-IN")}`;

const getDateAfterDays = (baseDate: Date, days: number) => {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return next;
};

const toDateInputValue = (value?: string, createdAt?: string) => {
  const parsed = value ? new Date(value) : createdAt ? getDateAfterDays(new Date(createdAt), 7) : getDateAfterDays(new Date(), 7);
  if (Number.isNaN(parsed.getTime())) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDeliveryLabel = (value?: string, createdAt?: string) => {
  const parsed = value ? new Date(value) : createdAt ? getDateAfterDays(new Date(createdAt), 7) : getDateAfterDays(new Date(), 7);
  if (Number.isNaN(parsed.getTime())) return "Not set";
  return parsed.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const buildAddressLines = (shippingAddress?: AdminOrder["shippingAddress"]) => {
  if (!shippingAddress) return [];

  const cityStatePin = [shippingAddress.city, shippingAddress.state, shippingAddress.pincode].filter(Boolean).join(" - ");

  return [shippingAddress.addressLine1, shippingAddress.addressLine2, cityStatePin, shippingAddress.country]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
};

const OrdersPage = () => {
  const { hasModuleAccess } = useAuth();
  const canEditOrders = hasModuleAccess("orders", "can_edit");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [statusDrafts, setStatusDrafts] = useState<Record<string, AdminOrderStatus>>({});
  const [deliveryDateDrafts, setDeliveryDateDrafts] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`${API_BASE_URL}/admin/orders?${params.toString()}`, {
        headers: getAdminAuthHeaders(),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to fetch orders");
      }

      const nextOrders: AdminOrder[] = Array.isArray(payload?.data?.items) ? payload.data.items : [];
      setOrders(nextOrders);
      setPagination((prev) => ({ ...prev, ...(payload?.data?.pagination || {}) }));

      setStatusDrafts((prev) => {
        const next = { ...prev };
        for (const order of nextOrders) {
          next[order._id] = next[order._id] || order.status;
        }
        return next;
      });
      setDeliveryDateDrafts((prev) => {
        const next = { ...prev };
        for (const order of nextOrders) {
          next[order._id] = next[order._id] || toDateInputValue(order.expectedDeliveryDate, order.createdAt);
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, pagination.page, pagination.limit]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedStatus]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchOrders();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const handleOrderUpdate = async (order: AdminOrder) => {
    if (!canEditOrders) {
      toast.error("You do not have permission to update order status");
      return;
    }
    const orderId = order._id;
    const status = statusDrafts[orderId] || order.status;
    const deliveryDateDraft = deliveryDateDrafts[orderId] || toDateInputValue(order.expectedDeliveryDate, order.createdAt);
    const deliveryDateIso = deliveryDateDraft ? new Date(`${deliveryDateDraft}T12:00:00`).toISOString() : undefined;

    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          status,
          expectedDeliveryDate: deliveryDateIso,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update order");
      }

      const updatedOrder: AdminOrder = payload.data;
      setOrders((prev) =>
        prev.map((currentOrder) =>
          currentOrder._id === orderId
            ? {
                ...currentOrder,
                ...updatedOrder,
              }
            : currentOrder,
        ),
      );
      setStatusDrafts((prev) => ({ ...prev, [orderId]: status }));
      setDeliveryDateDrafts((prev) => ({
        ...prev,
        [orderId]: toDateInputValue(updatedOrder.expectedDeliveryDate, updatedOrder.createdAt),
      }));
      toast.success("Order updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update order";
      setError(message);
      toast.error(message);
    } finally {
      setUpdatingOrderId("");
    }
  };

  const rows = useMemo(() => orders, [orders]);

  const handleSearchInput = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const normalized = value.trim();
        if (normalized) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage and track all real-time orders</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-xl border border-transparent bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search orders..."
            value={search}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === "all" ? "All" : toLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
      ) : null}

      <motion.div animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Order ID", "Customer", "Items", "Amount", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={7}>
                    Loading orders...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={7}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                rows.map((order) => (
                  <Fragment key={order._id}>
                    <tr
                      className="cursor-pointer border-b border-border/30 transition-colors hover:bg-muted/30"
                      onClick={() => setExpandedRow(expandedRow === order._id ? null : order._id)}
                    >
                      <td className="px-5 py-3.5 font-mono text-sm font-medium text-foreground">#{order.orderNumber}</td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.shippingAddress?.fullName || "Customer"}</p>
                          <p className="text-xs text-muted-foreground">
                            {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(", ") ||
                              "Address pending"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        <div className="max-w-[260px]">
                          <p className="truncate text-sm text-foreground">{order.items?.[0]?.name || "Product"}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.items?.length > 1 ? `+${order.items.length - 1} more item(s)` : `${order.items?.[0]?.quantity || 1} qty`}
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
                      <td className="px-5 py-3.5">
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedRow === order._id ? "rotate-180" : ""}`} />
                      </td>
                    </tr>

                    {expandedRow === order._id ? (
                      <tr>
                        <td className="bg-muted/20 px-5 py-4" colSpan={7}>
                          <motion.div
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4 text-sm"
                            initial={{ opacity: 0, height: 0 }}
                          >
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                                <p className="text-xs text-muted-foreground">Total Items</p>
                                <p className="font-medium text-foreground">
                                  {order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} item(s)
                                </p>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                                <p className="text-xs text-muted-foreground">Payment</p>
                                <p className="font-medium text-foreground">
                                  {String(order.paymentMethod || "cod").toUpperCase()} • {String(order.paymentStatus || "pending").toUpperCase()}
                                </p>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="font-medium text-foreground">
                                  {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(", ") || "N/A"}
                                </p>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                                <p className="text-xs text-muted-foreground">Expected Delivery</p>
                                <p className="font-medium text-foreground">{formatDeliveryLabel(order.expectedDeliveryDate, order.createdAt)}</p>
                              </div>
                            </div>

                            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                              <p className="mb-2 text-xs text-muted-foreground">Shipping Address</p>
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
                                  <p className="text-xs text-muted-foreground">Recipient</p>
                                  <p className="font-medium text-foreground">{order.shippingAddress?.fullName || "N/A"}</p>
                                  <p className="mt-0.5 text-sm text-muted-foreground">{order.shippingAddress?.phone || "Phone not available"}</p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
                                  <p className="text-xs text-muted-foreground">Delivery Address</p>
                                  {buildAddressLines(order.shippingAddress).length ? (
                                    <div className="space-y-0.5 text-sm text-foreground">
                                      {buildAddressLines(order.shippingAddress).map((line, index) => (
                                        <p key={`${order._id}-address-${index}`}>{line}</p>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Address not available</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                              <p className="mb-2 text-xs text-muted-foreground">Ordered Products</p>
                              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                {order.items.map((item, idx) => (
                                  <div key={`${order._id}-${idx}`} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-2.5 py-2">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted/40">
                                      {item.image ? (
                                        <img
                                          alt={item.name || "Product"}
                                          className="h-full w-full object-cover"
                                          src={item.image}
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                          No image
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-foreground">{item.name || "Product"}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity || 1}
                                        {item.size ? ` • Size: ${item.size}` : ""}
                                        {item.color ? ` • ${item.color}` : ""}
                                      </p>
                                      <p className="text-xs font-medium text-foreground">{formatInr(item.price || 0)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {canEditOrders ? (
                              <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
                                <p className="mb-2 text-xs text-muted-foreground">Update Status & Delivery Date</p>
                                <div className="flex flex-col gap-2 md:flex-row" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
                                    disabled={updatingOrderId === order._id}
                                    onChange={(e) =>
                                      setStatusDrafts((prev) => ({
                                        ...prev,
                                        [order._id]: e.target.value as AdminOrderStatus,
                                      }))
                                    }
                                    value={statusDrafts[order._id] || order.status}
                                  >
                                    {adminUpdateOptions.map((status) => (
                                      <option key={status} value={status}>
                                        {toLabel(status)}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
                                    disabled={updatingOrderId === order._id}
                                    onChange={(e) =>
                                      setDeliveryDateDrafts((prev) => ({
                                        ...prev,
                                        [order._id]: e.target.value,
                                      }))
                                    }
                                    type="date"
                                    value={deliveryDateDrafts[order._id] || toDateInputValue(order.expectedDeliveryDate, order.createdAt)}
                                  />
                                  <button
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={
                                      updatingOrderId === order._id ||
                                      (
                                        (statusDrafts[order._id] || order.status) === order.status &&
                                        (deliveryDateDrafts[order._id] || toDateInputValue(order.expectedDeliveryDate, order.createdAt)) ===
                                          toDateInputValue(order.expectedDeliveryDate, order.createdAt)
                                      )
                                    }
                                    onClick={() => handleOrderUpdate(order)}
                                    type="button"
                                  >
                                    {updatingOrderId === order._id ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </motion.div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          Page {pagination.page} of {pagination.totalPages} • {pagination.total.toLocaleString("en-IN")} orders
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pagination.page <= 1 || loading}
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.totalPages, prev.page + 1),
              }))
            }
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
