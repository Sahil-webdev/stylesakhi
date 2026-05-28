import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart, OrdersChart, CategoryChart } from "@/components/dashboard/Charts";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrders";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const Index = () => {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/orders?limit=1`, { headers: getAdminAuthHeaders() }),
          fetch(`${API_BASE_URL}/admin/users?limit=1`, { headers: getAdminAuthHeaders() }),
        ]);

        const [ordersPayload, usersPayload] = await Promise.all([ordersRes.json(), usersRes.json()]);

        if (ordersRes.ok && ordersPayload?.success) {
          setTotalOrders(Number(ordersPayload?.data?.pagination?.total || 0));
        }
        if (usersRes.ok && usersPayload?.success) {
          setTotalCustomers(Number(usersPayload?.data?.pagination?.total || 0));
        }
      } catch {
        // Keep fallback values if request fails
      }
    };

    fetchDashboardCounts();
  }, []);

  const stats = useMemo(
    () => [
      { title: "Total Revenue", value: "₹48,295", change: "+12.5%", changeType: "positive" as const, icon: DollarSign },
      {
        title: "Total Orders",
        value: totalOrders === null ? "..." : totalOrders.toLocaleString("en-IN"),
        change: "+8.2%",
        changeType: "positive" as const,
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        value: totalCustomers === null ? "..." : totalCustomers.toLocaleString("en-IN"),
        change: "+15.3%",
        changeType: "positive" as const,
        icon: Users,
      },
      { title: "Conversion Rate", value: "3.24%", change: "-2.1%", changeType: "negative" as const, icon: TrendingUp },
    ],
    [totalOrders, totalCustomers],
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, John. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatsCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      {/* Charts */}
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
