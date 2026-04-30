import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  CreditCard,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
} from "lucide-react";
import { useAuth, type PermissionModule } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/", module: "dashboard" as PermissionModule },
  { title: "Orders", icon: ShoppingCart, path: "/orders", module: "orders" as PermissionModule },
  { title: "Products", icon: Package, path: "/products", module: "products" as PermissionModule },
  { title: "Customers", icon: Users, path: "/customers", module: "customers" as PermissionModule },
  { title: "Analytics", icon: BarChart3, path: "/analytics", module: "analytics" as PermissionModule },
  { title: "Payments", icon: CreditCard, path: "/payments", module: "payments" as PermissionModule },
  { title: "Reviews", icon: Star, path: "/reviews", module: "reviews" as PermissionModule },
  { title: "Team", icon: Shield, path: "/team", module: "team" as PermissionModule },
  { title: "Settings", icon: Settings, path: "/settings", module: "settings" as PermissionModule },
];

export const AppSidebar = () => {
  const { hasModuleAccess } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("admin.sidebar.collapsed");
    return stored === "true";
  });
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem("admin.sidebar.collapsed", String(collapsed));
    window.dispatchEvent(new CustomEvent("admin-sidebar:toggle", { detail: { collapsed } }));
  }, [collapsed]);

  const visibleMenuItems = menuItems.filter((item) => hasModuleAccess(item.module, "can_view"));

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      initial={false}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-foreground whitespace-nowrap overflow-hidden"
            >
              StyleSakhi
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
            >
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="w-5 h-5 shrink-0 relative z-10" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden relative z-10"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
