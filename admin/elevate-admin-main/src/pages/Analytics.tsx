import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, IndianRupee, RefreshCw, Star, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

type AnalyticsPayload = {
  metrics: {
    averageOrderValue: number;
    repeatCustomerRate: number;
    reviewAverage: number;
    reviewCount: number;
  };
  orderTrend: Array<{
    key: string;
    month: string;
    orders: number;
    revenue: number;
  }>;
  categories: Array<{
    name: string;
    units: number;
    revenue: number;
    color: string;
  }>;
};

const formatInr = (value: number) => `\u20B9${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
          headers: getAdminAuthHeaders(),
        });
        const payload = await response.json();

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to fetch analytics");
        }

        setData(payload.data as AnalyticsPayload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cards = useMemo(() => {
    const metrics = data?.metrics;
    return [
      {
        title: "Avg Order Value",
        value: formatInr(metrics?.averageOrderValue || 0),
        sub: "Real-time business metric",
        icon: IndianRupee,
      },
      {
        title: "Repeat Customers",
        value: `${Number(metrics?.repeatCustomerRate || 0).toFixed(2)}%`,
        sub: "Customers with 2+ orders",
        icon: Users,
      },
      {
        title: "Average Rating",
        value: Number(metrics?.reviewAverage || 0).toFixed(2),
        sub: "Across all product reviews",
        icon: Star,
      },
      {
        title: "Total Reviews",
        value: Number(metrics?.reviewCount || 0).toLocaleString("en-IN"),
        sub: "Customer feedback count",
        icon: BarChart3,
      },
    ];
  }, [data]);

  const trendData = data?.orderTrend || [];
  const categoryData = data?.categories || [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance metrics and insights</p>
      </div>

      {error ? (
        <div className="glass-card p-5 mb-6 text-sm text-red-500">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <card.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{loading ? "..." : card.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `\u20B9${Math.round(Number(value || 0) / 1000)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatInr(Number(value || 0))}
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={categoryData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={62} paddingAngle={3}>
              {categoryData.map((entry, idx) => (
                <Cell key={`${entry.name}-${idx}`} fill={entry.color || "hsl(var(--primary))"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name, item) => [formatInr(Number(value || 0)), item?.payload?.name || "Category"]}
              contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categoryData.map((item) => (
            <div key={item.name} className="rounded-lg border border-border/60 px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color || "hsl(var(--primary))" }} />
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
              <p className="text-muted-foreground mt-1">Units: {Number(item.units || 0).toLocaleString("en-IN")}</p>
              <p className="text-foreground font-medium">{formatInr(Number(item.revenue || 0))}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
