import { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { MobileNav } from "./MobileNav";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("admin.sidebar.collapsed") === "true";
  });

  useEffect(() => {
    const syncFromStorage = () => {
      setSidebarCollapsed(window.localStorage.getItem("admin.sidebar.collapsed") === "true");
    };

    const onSidebarToggle = (event: Event) => {
      const custom = event as CustomEvent<{ collapsed?: boolean }>;
      if (typeof custom.detail?.collapsed === "boolean") {
        setSidebarCollapsed(custom.detail.collapsed);
        return;
      }
      syncFromStorage();
    };

    window.addEventListener("admin-sidebar:toggle", onSidebarToggle);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("admin-sidebar:toggle", onSidebarToggle);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className={`${sidebarCollapsed ? "md:pl-[72px]" : "md:pl-[260px]"} transition-all duration-300 ease-in-out`}>
        <TopNavbar />
        <main className="p-4 md:p-6 pb-6">{children}</main>
      </div>

      {/* Mobile hamburger nav */}
      <MobileNav />
    </div>
  );
};
