import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Building } from "lucide-react";

const transactions = [
  { id: "TXN-001", customer: "Sarah Chen", amount: "+$2,499", type: "Payment", method: "Credit Card", status: "Completed", date: "Mar 25, 2026" },
  { id: "TXN-002", customer: "Mike Johnson", amount: "+$549", type: "Payment", method: "PayPal", status: "Completed", date: "Mar 25, 2026" },
  { id: "TXN-003", customer: "Lisa Park", amount: "-$1,199", type: "Refund", method: "Credit Card", status: "Processing", date: "Mar 24, 2026" },
  { id: "TXN-004", customer: "Emily Davis", amount: "+$799", type: "Payment", method: "Debit Card", status: "Completed", date: "Mar 24, 2026" },
  { id: "TXN-005", customer: "Alex Rivera", amount: "+$899", type: "Payment", method: "Bank Transfer", status: "Pending", date: "Mar 23, 2026" },
  { id: "TXN-006", customer: "Tom Baker", amount: "+$1,599", type: "Payment", method: "Credit Card", status: "Completed", date: "Mar 23, 2026" },
];

const statusClass: Record<string, string> = {
  Completed: "status-delivered",
  Processing: "status-processing",
  Pending: "status-pending",
};

const cards = [
  { title: "Total Revenue", value: "$48,295", change: "+12.5%", positive: true, icon: DollarSign },
  { title: "Card Payments", value: "$32,180", change: "+8.1%", positive: true, icon: CreditCard },
  { title: "Digital Wallets", value: "$12,450", change: "+22.3%", positive: true, icon: Wallet },
  { title: "Bank Transfers", value: "$3,665", change: "-4.2%", positive: false, icon: Building },
];

const PaymentsPage = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">Payments</h1>
      <p className="text-sm text-muted-foreground mt-1">Track revenue and transactions</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <card.icon className="w-4 h-4 text-primary" />
            </div>
            <div className={`flex items-center gap-0.5 text-xs font-medium ${card.positive ? "text-emerald-500" : "text-red-500"}`}>
              {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {card.change}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{card.title}</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{card.value}</p>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Transaction", "Customer", "Amount", "Method", "Status", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 text-sm font-mono font-medium text-foreground">{t.id}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{t.customer}</td>
                <td className={`px-5 py-3.5 text-sm font-semibold ${t.amount.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>{t.amount}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.method}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass[t.status]}`}>{t.status}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </DashboardLayout>
);

export default PaymentsPage;
