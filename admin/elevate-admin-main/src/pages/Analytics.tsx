import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RevenueChart, OrdersChart, CategoryChart } from "@/components/dashboard/Charts";
import { TrendingUp, TrendingDown, Eye, MousePointer, ShoppingCart, BarChart3 } from "lucide-react";

const metrics = [
  { title: "Page Views", value: "124,892", change: "+18.2%", positive: true, icon: Eye },
  { title: "Click Rate", value: "4.8%", change: "+2.1%", positive: true, icon: MousePointer },
  { title: "Cart Abandonment", value: "32.5%", change: "-5.4%", positive: true, icon: ShoppingCart },
  { title: "Avg. Session", value: "4m 32s", change: "-0.8%", positive: false, icon: BarChart3 },
];

const AnalyticsPage = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Performance metrics and insights</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, i) => (
        <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <m.icon className="w-4 h-4 text-primary" />
            </div>
            <div className={`flex items-center gap-0.5 text-xs font-medium ${m.positive ? "text-emerald-500" : "text-red-500"}`}>
              {m.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {m.change}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{m.title}</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{m.value}</p>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <RevenueChart />
      <OrdersChart />
    </div>

    <CategoryChart />
  </DashboardLayout>
);

export default AnalyticsPage;
