"use client";

import type { MouseEvent } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Heart, Mic, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { HamburgerMenuOverlay } from "@/components/ui/HamburgerMenuOverlay";
import { useAuth } from "@/contexts/AuthContext";
import UserAccountAvatar from "@/components/smoothui/components/user-account-avatar";
import { useShop } from "@/contexts/ShopContext";
import { rememberAuthRedirect } from "@/lib/auth-redirect";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, wishlistCount } = useShop();

  const handleProtectedNav = (
    event: MouseEvent<HTMLAnchorElement>,
    target: "cart" | "wishlist"
  ) => {
    if (isAuthenticated) return;

    event.preventDefault();
    rememberAuthRedirect(`Please login first to open your ${target}.`, `/${target}`);
    router.push("/auth");
  };

  const generationLinks = [
    { label: "BOOMERS", years: "1946-1964", href: "/boomers" },
    { label: "GEN-X", years: "1965-1980", href: "/gen-x" },
    { label: "MILLENNIALS", years: "1981-1996", href: "/millennial" },
    { label: "GEN-Z", years: "1997-2012", href: "/gen-z" },
    { label: "GEN ALPHA", years: "2013-2024", href: "/gen-alpha" },
  ];

  const mobileMenuItems = [
    { label: "HOME", href: "/" },
    { label: "BOOMERS", href: "/boomers" },
    { label: "GEN X", href: "/gen-x" },
    { label: "MILLENNIALS", href: "/millennial" },
    { label: "GEN Z", href: "/gen-z" },
    { label: "GEN ALPHA", href: "/gen-alpha" },
  ];

  return (
    <>
      <div className="md:hidden">
        <HamburgerMenuOverlay
          items={mobileMenuItems}
          buttonTop="30px"
          buttonLeft="24px"
          buttonSize="sm"
          buttonColor="#B91C1C"
          overlayBackground="rgba(147, 197, 253, 0.95)"
          textColor="#1f2937"
          fontSize="lg"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="semibold"
          animationDuration={0.8}
          staggerDelay={0.08}
          menuAlignment="left"
          zIndex={9999}
        />
      </div>

      <nav className={`fixed inset-x-0 top-0 z-50 w-full border-b border-black/10 bg-white/85 backdrop-blur-xl ${inter.className}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:hidden w-6" />

            <div className="hidden md:block">
              <div className="flex items-center rounded-xl border border-black/10 bg-white/75 p-1 shadow-[0_10px_26px_rgba(0,0,0,0.09)] backdrop-blur">
                {generationLinks.map((item, index) => {
                  const active =
                    pathname === item.href || (item.href === "/gen-x" && pathname === "/classic");
                  const isFirst = index === 0;
                  const isLast = index === generationLinks.length - 1;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "relative px-3 py-2 text-[11px] font-semibold tracking-wide transition-all duration-300 flex flex-col items-center min-w-[70px] group hover:scale-105",
                        active ? "text-white" : "text-gray-700 hover:text-[#B91C1C]",
                        !active && isFirst && "rounded-l-lg",
                        !active && isLast && "rounded-r-lg"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="gen-pill"
                          className="absolute inset-0 rounded-lg bg-[#1a1a1a] shadow-sm"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                      {!active && (
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      <span className="relative z-10 leading-none">{item.label}</span>
                      <span className={clsx(
                        "relative z-10 text-[9px] font-normal leading-none mt-0.5 transition-all duration-300",
                        active ? "text-white/80" : "text-gray-500 group-hover:text-[#B91C1C]"
                      )}>
                        ({item.years})
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="text-base font-semibold tracking-tight text-gray-900 transition-colors hover:text-[#B91C1C]"
              >
                Style Sakhi
              </Link>
            </div>

            <div className="flex h-10 items-center gap-1.5 md:gap-2">
              <button className="flex h-9 w-9 items-center justify-center text-gray-700 transition-colors hover:text-[#B91C1C] md:hidden">
                <Search className="h-4 w-4" />
              </button>

              <div className="hidden h-9 w-44 shrink-0 items-center rounded-full border border-[#2a2a2a] bg-white px-3 shadow-none md:flex lg:w-60">
                <input
                  type="text"
                  placeholder="Search"
                  className="h-full min-w-0 flex-1 bg-transparent py-0 text-sm font-normal leading-none text-[#242424] placeholder:text-[#7c7c7c] outline-none"
                />
                <button
                  type="button"
                  aria-label="Voice search"
                  className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center text-[#5d6970] transition-colors hover:text-[#242424]"
                >
                  <Mic className="h-4 w-4" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  aria-label="Search"
                  className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center text-black transition-colors hover:text-[#B91C1C]"
                >
                  <Search className="h-5 w-5" strokeWidth={1.7} />
                </button>
              </div>

              <div className="hidden h-8 w-8 items-center justify-center md:flex">
                {isAuthenticated && user ? (
                  <UserAccountAvatar
                    className="h-8 w-8"
                    user={{ name: user.name, email: user.email, avatar: user.avatar }}
                    onOrderView={() => router.push("/orders")}
                    onLogout={logout}
                  />
                ) : (
                  <button
                    onClick={() => router.push("/auth")}
                    className="flex h-8 w-8 items-center justify-center text-gray-700 transition-colors hover:text-[#B91C1C]"
                  >
                    <User className="h-5 w-5" strokeWidth={2} />
                  </button>
                )}
              </div>

              <Link
                href="/wishlist"
                onClick={(event) => handleProtectedNav(event, "wishlist")}
                className="relative flex h-8 w-8 items-center justify-center text-black transition-colors hover:text-black/80"
              >
                <Heart className="h-5 w-5" strokeWidth={2} />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B91C1C] px-1 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/cart"
                onClick={(event) => handleProtectedNav(event, "cart")}
                className="relative flex h-8 w-8 items-center justify-center text-black transition-colors hover:text-black/80"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                {cartCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B91C1C] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
