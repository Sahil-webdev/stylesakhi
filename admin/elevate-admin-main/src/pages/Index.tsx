import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart, OrdersChart, CategoryChart } from "@/components/dashboard/Charts";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrders";
import { DollarSign, ShoppingCart, TrendingUp, Truck, Users } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

type DashboardStat = {
  key: string;
  title: string;
  value: number;
  change: number;
  changeType: "positive" | "negative";
};

const formatInr = (amount: number) => `\u20B9${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const formatPct = (value: number) => `${value >= 0 ? "+" : ""}${Number(value || 0).toFixed(2)}%`;

const iconByKey = {
  revenue: DollarSign,
  orders: ShoppingCart,
  customers: Users,
  conversionRate: TrendingUp,
  deliveredRate: Truck,
} as const;

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [statsPayload, setStatsPayload] = useState<DashboardStat[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: getAdminAuthHeaders(),
        });
        const payload = await response.json();

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to fetch dashboard stats");
        }

        const stats = Array.isArray(payload?.data?.stats) ? (payload.data.stats as DashboardStat[]) : [];
        setStatsPayload(stats);
      } catch {
        setStatsPayload([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const fallback: DashboardStat[] = [
      { key: "revenue", title: "Total Revenue", value: 0, change: 0, changeType: "positive" },
      { key: "orders", title: "Total Orders", value: 0, change: 0, changeType: "positive" },
      { key: "customers", title: "Customers", value: 0, change: 0, changeType: "positive" },
      { key: "conversionRate", title: "Conversion Rate", value: 0, change: 0, changeType: "positive" },
    ];

    const source = statsPayload.length > 0 ? statsPayload : fallback;

    return source.slice(0, 4).map((item) => {
      const icon = iconByKey[item.key as keyof typeof iconByKey] || TrendingUp;
      const numericValue = Number(item.value || 0);
      const value =
        item.key === "revenue"
          ? formatInr(numericValue)
          : item.key === "conversionRate" || item.key === "deliveredRate"
            ? `${numericValue.toFixed(2)}%`
            : numericValue.toLocaleString("en-IN");

      return {
        title: item.title,
        value: loading ? "..." : value,
        change: formatPct(Number(item.change || 0)),
        changeType: item.changeType === "negative" ? "negative" : "positive",
        icon,
      };
    });
  }, [loading, statsPayload]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatsCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <CategoryChart />
      </div>
    </DashboardLayout>
  );
};

export default Index;
