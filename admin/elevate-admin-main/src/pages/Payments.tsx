import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowDownRight, ArrowUpRight, CreditCard, IndianRupee, Search, Wallet } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

type PaymentCard = {
  key: string;
  title: string;
  value: number;
  change: number;
};

type PaymentItem = {
  id: string;
  customer: string;
  amount: number;
  amountDirection: "credit" | "debit";
  type: "Payment" | "Refund";
  method: string;
  status: string;
  date: string;
};

type PaymentsPayload = {
  cards: PaymentCard[];
  items: PaymentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const formatInr = (value: number) => `\u20B9${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const formatChange = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
const toTitle = (input: string) =>
  String(input || "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const iconByCardKey: Record<string, typeof IndianRupee> = {
  totalRevenue: IndianRupee,
  cardPayments: CreditCard,
  codPayments: Wallet,
};

const statusClass = (status: string) => {
  const key = String(status || "").toLowerCase();
  if (key === "paid") return "bg-emerald-100 text-emerald-700";
  if (key === "failed" || key === "refunded") return "bg-red-100 text-red-700";
  if (key === "pending") return "bg-amber-100 text-amber-700";
  return "bg-muted text-muted-foreground";
};

const PaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<PaymentsPayload>({
    cards: [],
    items: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "20");
        if (status && status !== "all") params.set("status", status);
        if (search.trim()) params.set("search", search.trim());

        const response = await fetch(`${API_BASE_URL}/admin/payments?${params.toString()}`, {
          headers: getAdminAuthHeaders(),
        });
        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.error || "Failed to fetch payments");
        }

        setPayload(result.data as PaymentsPayload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, search, status]);

  const cards = useMemo(() => payload.cards || [], [payload.cards]);
  const items = useMemo(() => payload.items || [], [payload.items]);
  const pagination = payload.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track revenue and transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => {
          const Icon = iconByCardKey[card.key] || IndianRupee;
          const positive = Number(card.change || 0) >= 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}>
                  {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatChange(Number(card.change || 0))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{card.title}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatInr(Number(card.value || 0))}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search order/customer"
                className="h-9 w-full rounded-lg border border-border/60 bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 sm:w-64"
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Transaction", "Customer", "Amount", "Method", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={6}>
                    Loading payments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-red-500" colSpan={6}>
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={6}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                items.map((t) => (
                  <tr key={t.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-foreground">{t.id}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{t.customer}</td>
                    <td className={`px-5 py-3.5 text-sm font-semibold ${t.amountDirection === "credit" ? "text-emerald-500" : "text-red-500"}`}>
                      {t.amountDirection === "credit" ? "+" : "-"}
                      {formatInr(Number(t.amount || 0))}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{toTitle(t.method)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${statusClass(t.status)}`}>{toTitle(t.status)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/50 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Page {pagination.page} of {pagination.totalPages} • Total {pagination.total} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={pagination.page <= 1 || loading}
              className="rounded-lg border border-border/60 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="rounded-lg border border-border/60 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
