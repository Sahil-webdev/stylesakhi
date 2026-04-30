import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldAlert, Eye } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roles: { role: AppRole | "all"; label: string; description: string; icon: typeof Shield; gradient: string }[] = [
  { role: "all", label: "All Members", description: "View all team members", icon: Shield, gradient: "from-muted/80 to-muted/40" },
  { role: "super_admin", label: "Super Admin", description: "Full unrestricted access", icon: ShieldAlert, gradient: "from-primary/20 to-primary/5" },
  { role: "admin", label: "Admin", description: "Manage products, orders, customers", icon: ShieldCheck, gradient: "from-blue-500/20 to-blue-500/5" },
  { role: "manager", label: "Manager", description: "Orders & customers control", icon: Shield, gradient: "from-amber-500/20 to-amber-500/5" },
  { role: "staff", label: "Staff", description: "View-only access", icon: Eye, gradient: "from-muted/60 to-muted/20" },
];

interface RoleCardsProps {
  roleCounts: Record<string, number>;
  selectedRole: AppRole | "all";
  onSelectRole: (role: AppRole | "all") => void;
}

export const RoleCards = ({ roleCounts, selectedRole, onSelectRole }: RoleCardsProps) => {
  const total = Object.values(roleCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {roles.map((r, i) => {
        const count = r.role === "all" ? total : (roleCounts[r.role] ?? 0);
        const isSelected = selectedRole === r.role;

        return (
          <motion.button
            key={r.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelectRole(r.role)}
            className={`relative p-4 rounded-2xl border text-left transition-all duration-300 ${
              isSelected
                ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border/50 bg-card/70 hover:border-border hover:shadow-md"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="role-highlight"
                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-3`}>
              <r.icon className="w-5 h-5 text-foreground/70" />
            </div>
            <p className="text-sm font-semibold text-foreground">{r.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.description}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{count}</p>
          </motion.button>
        );
      })}
    </div>
  );
};
