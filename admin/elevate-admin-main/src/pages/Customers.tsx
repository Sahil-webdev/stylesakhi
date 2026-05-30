import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, MoreHorizontal, Eye, Info, Pencil, RotateCcw, MessageCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuthHeaders } from "@/lib/adminAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

type CustomerRow = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  stats?: {
    ordersCount?: number;
    totalSpent?: number;
  };
};

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const formatDateTime = (value?: string) => {
  if (!value) return "Never";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Never";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initials = (name?: string) => {
  const safe = String(name || "User").trim();
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "U";
};

const formatInr = (amount: number) => `\u20B9${Number(amount || 0).toLocaleString("en-IN")}`;

const CustomersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuState, setMenuState] = useState<{ id: string; x: number; y: number } | null>(null);
  const [busyId, setBusyId] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [editModalCustomer, setEditModalCustomer] = useState<CustomerRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [withdrawModalCustomer, setWithdrawModalCustomer] = useState<CustomerRow | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("0");

  const [remarkModalCustomer, setRemarkModalCustomer] = useState<CustomerRow | null>(null);
  const [remarkText, setRemarkText] = useState("");

  const { hasModuleAccess } = useAuth();
  const canEditCustomers = hasModuleAccess("customers", "can_edit");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (query.trim()) params.set("search", query.trim());
      const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: getAdminAuthHeaders(),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) throw new Error(payload?.error || "Failed to fetch customers");
      setCustomers(Array.isArray(payload?.data?.items) ? payload.data.items : []);
      setPagination((prev) => ({ ...prev, ...(payload?.data?.pagination || {}) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(search);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  useEffect(() => {
    if (!menuState) return;

    const recalcMenu = () => {
      const triggerNode = triggerRefs.current[menuState.id];
      if (!triggerNode) {
        setMenuState(null);
        return;
      }
      const rect = triggerNode.getBoundingClientRect();
      setMenuState((prev) =>
        prev
          ? {
              ...prev,
              x: Math.max(16, rect.right - 280),
              y: rect.bottom + 8,
            }
          : prev,
      );
    };

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const triggerNode = triggerRefs.current[menuState.id];
      if (menuRef.current?.contains(target)) return;
      if (triggerNode?.contains(target)) return;
      setMenuState(null);
    };

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("resize", recalcMenu);
    window.addEventListener("scroll", recalcMenu, true);

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("resize", recalcMenu);
      window.removeEventListener("scroll", recalcMenu, true);
    };
  }, [menuState]);

  const rows = useMemo(() => customers, [customers]);

  const updateEnabled = async (customer: CustomerRow, enabled: boolean) => {
    setBusyId(customer._id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${customer._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAdminAuthHeaders() },
        body: JSON.stringify({ isActive: enabled }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) throw new Error(payload?.error || "Failed to update status");

      setCustomers((prev) => prev.map((c) => (c._id === customer._id ? { ...c, isActive: enabled } : c)));
      toast.success(`User ${enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setBusyId("");
    }
  };

  const actionRequest = async (customer: CustomerRow, path: string, options?: RequestInit) => {
    setBusyId(customer._id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${customer._id}${path}`, {
        ...options,
        headers: {
          ...(options?.headers || {}),
          ...getAdminAuthHeaders(),
        },
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) throw new Error(payload?.error || "Action failed");
      return payload?.data;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
      return null;
    } finally {
      setBusyId("");
    }
  };

  const openEditModal = (customer: CustomerRow) => {
    setEditModalCustomer(customer);
    setEditName(customer.name || "");
    setEditPhone(customer.phone || "");
    setEditEmail(customer.email || "");
  };

  const openWithdrawModal = (customer: CustomerRow) => {
    setWithdrawModalCustomer(customer);
    setWithdrawAmount("0");
  };

  const openRemarkModal = (customer: CustomerRow) => {
    setRemarkModalCustomer(customer);
    setRemarkText("");
  };

  const submitEdit = async () => {
    if (!editModalCustomer) return;
    const data = await actionRequest(editModalCustomer, "/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, phone: editPhone, email: editEmail }),
    });
    if (!data) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c._id === editModalCustomer._id
          ? { ...c, name: data.name || c.name, phone: data.phone || c.phone, email: data.email || c.email }
          : c,
      ),
    );
    toast.success("Customer profile updated");
    setEditModalCustomer(null);
  };

  const submitWithdraw = async () => {
    if (!withdrawModalCustomer) return;
    const amount = Number(withdrawAmount || 0);
    if (Number.isNaN(amount) || amount < 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const data = await actionRequest(withdrawModalCustomer, "/withdraw-credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!data) return;
    toast.success(`Withdraw request recorded: ${formatInr(Number(data.amount || 0))}`);
    setWithdrawModalCustomer(null);
  };

  const submitRemark = async () => {
    if (!remarkModalCustomer) return;
    if (!remarkText.trim()) {
      toast.error("Remark text is required");
      return;
    }
    const data = await actionRequest(remarkModalCustomer, "/remarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: remarkText.trim() }),
    });
    if (!data) return;
    toast.success("Remark added");
    setRemarkModalCustomer(null);
  };

  const menuAction = async (key: string, customer: CustomerRow) => {
    if (busyId) return;

    if (key === "details") {
      const data = await actionRequest(customer, "");
      if (data) toast.message(`User: ${data.name} | ${data.email} | ${data.phone || "No phone"}`);
      return;
    }

    if (key === "edit") {
      openEditModal(customer);
      return;
    }

    if (key === "withdraw") {
      openWithdrawModal(customer);
      return;
    }

    if (key === "reset") {
      const data = await actionRequest(customer, "/reset-password", { method: "POST" });
      if (data) toast.success("Password reset successful.");
      return;
    }

    if (key === "remark") {
      openRemarkModal(customer);
      return;
    }

    if (key === "purchases") {
      const data = await actionRequest(customer, "/purchases");
      if (Array.isArray(data)) toast.message(`${customer.name} has ${data.length} purchase(s)`);
      return;
    }

    if (key === "report") {
      const data = await actionRequest(customer, "/report");
      if (data) {
        toast.message(`Orders: ${data.totalOrders} | Delivered: ${data.deliveredOrders} | Spent: ${formatInr(Number(data.totalSpent || 0))}`);
      }
      return;
    }

    if (key === "chat") {
      const data = await actionRequest(customer, "/chat", { method: "POST" });
      if (data?.email) window.open(`mailto:${data.email}?subject=StyleSakhi%20Support`, "_blank");
    }
  };

  const menuItems = [
    { key: "details", label: "View User Details", icon: Eye },
    { key: "edit", label: "Edit Profile", icon: Pencil },
    { key: "withdraw", label: "Withdraw Credit", icon: CreditCard },
    { key: "reset", label: "Reset Password", icon: RotateCcw },
    { key: "remark", label: "Add Remark", icon: Pencil },
    { key: "purchases", label: "View Purchases", icon: Eye },
    { key: "report", label: "View User Report", icon: Eye },
    { key: "chat", label: "Chat with User", icon: MessageCircle },
  ];

  const openMenuFor = (id: string) => {
    const triggerNode = triggerRefs.current[id];
    if (!triggerNode) return;
    if (menuState?.id === id) {
      setMenuState(null);
      return;
    }

    const rect = triggerNode.getBoundingClientRect();
    setMenuState({
      id,
      x: Math.max(16, rect.right - 280),
      y: rect.bottom + 8,
    });
  };

  const activeCustomer = menuState ? rows.find((c) => c._id === menuState.id) : null;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pagination.total} total customers</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full rounded-xl border border-transparent bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder="Search customers..."
          value={search}
        />
      </div>

      {error ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div> : null}

      <motion.div animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Customer", "Orders", "Total Spent", "Login Date & Time", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={5}>
                    Loading customers...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={5}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                rows.map((c, i) => (
                  <motion.tr
                    key={c._id}
                    animate={{ opacity: 1 }}
                    className="border-b border-border/30 transition-colors hover:bg-muted/30"
                    initial={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <span className="text-xs font-semibold text-primary">{initials(c.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{Number(c.stats?.ordersCount || 0)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{formatInr(Number(c.stats?.totalSpent || 0))}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{formatDateTime(c.lastLoginAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      {canEditCustomers ? (
                        <button
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/50"
                          onClick={() => openMenuFor(c._id)}
                          ref={(node) => {
                            triggerRefs.current[c._id] = node;
                          }}
                          type="button"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      ) : null}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          Page {pagination.page} of {pagination.totalPages} • {pagination.total.toLocaleString("en-IN")} customers
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

      {typeof window !== "undefined" && activeCustomer && menuState
        ? createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                animate={{ opacity: 1, y: 0 }}
                className="fixed z-[9999] w-[280px] rounded-2xl border border-border bg-background p-2 text-left shadow-xl"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: -6 }}
                style={{ left: menuState.x, top: menuState.y }}
              >
                <button
                  className="mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => updateEnabled(activeCustomer, !(activeCustomer.isActive ?? true))}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Enabled
                  </span>
                  <span className={`inline-flex h-6 w-11 items-center rounded-full transition ${activeCustomer.isActive !== false ? "bg-primary" : "bg-muted"}`}>
                    <span className={`h-4 w-4 rounded-full bg-white transition ${activeCustomer.isActive !== false ? "ml-6" : "ml-1"}`} />
                  </span>
                </button>

                <div className="my-1 h-px bg-border" />

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-60"
                      disabled={busyId === activeCustomer._id}
                      onClick={async () => {
                        await menuAction(item.key, activeCustomer);
                        setMenuState(null);
                      }}
                      type="button"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}

      {editModalCustomer ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Edit Customer Profile</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => setEditModalCustomer(null)} type="button">Cancel</button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => void submitEdit()} type="button">Save</button>
            </div>
          </div>
        </div>
      ) : null}

      {withdrawModalCustomer ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Withdraw Credit</h3>
            <p className="mt-1 text-sm text-muted-foreground">{withdrawModalCustomer.name}</p>
            <input
              className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => setWithdrawModalCustomer(null)} type="button">Cancel</button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => void submitWithdraw()} type="button">Submit</button>
            </div>
          </div>
        </div>
      ) : null}

      {remarkModalCustomer ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Add Admin Remark</h3>
            <textarea
              className="mt-4 h-28 w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Write remark"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => setRemarkModalCustomer(null)} type="button">Cancel</button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => void submitRemark()} type="button">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default CustomersPage;
