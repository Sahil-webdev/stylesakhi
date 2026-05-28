import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6800 },
  { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 9100 },
];

const ordersData = [
  { month: "Jan", orders: 120 },
  { month: "Feb", orders: 180 },
  { month: "Mar", orders: 150 },
  { month: "Apr", orders: 220 },
  { month: "May", orders: 200 },
  { month: "Jun", orders: 260 },
  { month: "Jul", orders: 290 },
];

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(250, 80%, 60%)" },
  { name: "Clothing", value: 25, color: "hsl(220, 90%, 56%)" },
  { name: "Home", value: 20, color: "hsl(280, 80%, 60%)" },
  { name: "Sports", value: 12, color: "hsl(142, 71%, 45%)" },
  { name: "Other", value: 8, color: "hsl(215, 16%, 47%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{payload[0].name}: {typeof payload[0].value === 'number' && payload[0].name === 'revenue' ? `$${payload[0].value.toLocaleString()}` : payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.4 }}
    className="glass-card p-5"
  >
    <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Overview</h3>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} />
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
);

export const OrdersChart = () => {
  const [chartData, setChartData] = useState(ordersData);

  useEffect(() => {
    const fetchOrdersOverview = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/orders-overview`, {
          headers: getAdminAuthHeaders(),
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) return;

        const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
        if (items.length > 0) {
          setChartData(
            items.map((item: { month?: string; orders?: number }) => ({
              month: item.month || "",
              orders: Number(item.orders || 0),
            })),
          );
        }
      } catch {
        // keep fallback chart data
      }
    };

    fetchOrdersOverview();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Orders Overview</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const CategoryChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.4 }}
    className="glass-card p-5"
  >
    <h3 className="text-sm font-semibold text-foreground mb-4">Sales by Category</h3>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-wrap gap-3 mt-2">
      {categoryData.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  </motion.div>
);
