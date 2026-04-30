import { motion } from "framer-motion";

const orders = [
  { id: "#ORD-7291", customer: "Sarah Chen", product: "MacBook Pro 16\"", amount: "$2,499", status: "Delivered", date: "Mar 25, 2026" },
  { id: "#ORD-7290", customer: "Mike Johnson", product: "AirPods Max", amount: "$549", status: "Processing", date: "Mar 25, 2026" },
  { id: "#ORD-7289", customer: "Emily Davis", product: "iPad Air", amount: "$799", status: "Pending", date: "Mar 24, 2026" },
  { id: "#ORD-7288", customer: "Alex Rivera", product: "Apple Watch Ultra", amount: "$899", status: "Delivered", date: "Mar 24, 2026" },
  { id: "#ORD-7287", customer: "Lisa Park", product: "iPhone 16 Pro", amount: "$1,199", status: "Cancelled", date: "Mar 23, 2026" },
  { id: "#ORD-7286", customer: "Tom Baker", product: "Studio Display", amount: "$1,599", status: "Delivered", date: "Mar 23, 2026" },
];

const statusClass: Record<string, string> = {
  Delivered: "status-delivered",
  Processing: "status-processing",
  Pending: "status-pending",
  Cancelled: "status-cancelled",
};

export const RecentOrdersTable = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.4 }}
    className="glass-card overflow-hidden"
  >
    <div className="px-5 py-4 border-b border-border/50">
      <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <td className="px-5 py-3.5 text-sm font-mono font-medium text-foreground">{order.id}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{order.customer}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.product}</td>
              <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{order.amount}</td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.date}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);
