
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  CreditCard,
  Star,
  Images,
  Shield,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuth, type PermissionModule } from "@/contexts/AuthContext";

const items = [
  { title: "Home", icon: LayoutDashboard, path: "/", module: "dashboard" as PermissionModule },
  { title: "Orders", icon: ShoppingCart, path: "/orders", module: "orders" as PermissionModule },
  { title: "Products", icon: Package, path: "/products", module: "products" as PermissionModule },
  { title: "Customers", icon: Users, path: "/customers", module: "customers" as PermissionModule },
  { title: "Analytics", icon: BarChart3, path: "/analytics", module: "analytics" as PermissionModule },
  { title: "Payments", icon: CreditCard, path: "/payments", module: "payments" as PermissionModule },
  { title: "Reviews", icon: Star, path: "/reviews", module: "reviews" as PermissionModule },
  { title: "Banners", icon: Images, path: "/banners", module: "settings" as PermissionModule },
  { title: "Team", icon: Shield, path: "/team", module: "team" as PermissionModule },
  { title: "Settings", icon: Settings, path: "/settings", module: "settings" as PermissionModule },
];

export const MobileNav = () => {
  const { hasModuleAccess } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const visibleItems = items.filter((item) => hasModuleAccess(item.module, "can_view"));

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-[60] rounded-xl border border-border/50 bg-card/90 p-2.5 text-foreground shadow-sm backdrop-blur-xl"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-[60] h-full w-72 border-r border-border/50 bg-card/95 backdrop-blur-xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            >
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
                <span className="text-sm font-semibold text-foreground">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
