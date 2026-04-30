import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const displayName = user?.name || "Admin";
  const initials =
    displayName
      .split(" ")
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  const searchableRoutes: Record<string, string> = {
    "/products": "Search products...",
    "/orders": "Search orders...",
    "/customers": "Search customers...",
    "/reviews": "Search reviews...",
    "/team": "Search team members...",
  };
  const isSearchable = Boolean(searchableRoutes[location.pathname]);
  const searchPlaceholder = searchableRoutes[location.pathname] || "Search";
  const searchValue = searchParams.get("q") || "";

  const updateGlobalSearch = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const normalized = value.trim();
        if (normalized) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const notifications = [
    { id: 1, text: "New order #1234 received", time: "2m ago", unread: true },
    { id: 2, text: "Payment of $450 processed", time: "1h ago", unread: true },
    { id: 3, text: "Customer left a 5-star review", time: "3h ago", unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          disabled={!isSearchable}
          onChange={(e) => updateGlobalSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-300 ${
            searchFocused ? "border-primary/50 ring-2 ring-primary/20 bg-muted" : "border-transparent"
          }`}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </motion.button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-card p-2 z-50"
              >
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notifications</p>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${n.unread ? "" : "opacity-60"}`}>
                    <p className="text-sm text-foreground">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">{displayName}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </motion.button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 glass-card p-2 z-50"
              >
                {[
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                  { icon: LogOut, label: "Log out" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.label === "Log out" ? handleLogout : undefined}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
