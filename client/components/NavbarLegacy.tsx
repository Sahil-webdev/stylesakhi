"use client";

import { Search, User, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { HamburgerMenuOverlay } from "@/components/ui/HamburgerMenuOverlay";
import { useAuth } from "@/contexts/AuthContext";
import UserAccountAvatar from "@/components/smoothui/components/user-account-avatar";

export default function NavbarLegacy() {
  const [cartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleUserIconClick = () => {
    router.push('/auth');
  };

  const generationLinks = [
    { label: "BOOMERS", href: "/boomers" },
    { label: "GEN-X", href: "/gen-x" },
    { label: "MILLENNIALS", href: "/millennial" },
    { label: "GEN-Z", href: "/gen-z" },
    { label: "GEN ALPHA", href: "/gen-alpha" },
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
          buttonTop="32px"
          buttonLeft="30px"
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

      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="md:hidden w-6"></div>

            <div className="hidden md:flex items-center gap-4">
              {generationLinks.map((item) => {
                const active = pathname === item.href || (item.href === "/gen-x" && pathname === "/classic");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`pb-1 text-xs font-semibold tracking-wide transition-all duration-200 border-b ${
                      active
                        ? "text-[#B91C1C] border-[#B91C1C]"
                        : "text-gray-800 border-transparent hover:text-[#B91C1C] hover:border-[#B91C1C]/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
              <Link href="/" className="flex items-center">
                <span className="text-lg md:text-xl font-bold text-gray-900 hover:text-[#B91C1C] transition-colors">
                  Style Sakhi
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="md:hidden text-gray-700 hover:text-[#B91C1C] transition-colors">
                <Search className="w-4 h-4" />
              </button>

              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-56">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="bg-transparent outline-none text-xs text-gray-600 placeholder-gray-400 w-full"
                />
                <Search className="w-4 h-4 text-gray-500" />
              </div>

              <div className="hidden md:block relative">
                {isAuthenticated && user ? (
                  <UserAccountAvatar
                    user={{
                      name: user.name,
                      email: user.email,
                      avatar: user.avatar,
                    }}
                    onOrderView={() => router.push("/orders")}
                    onLogout={logout}
                  />
                ) : (
                  <button
                    onClick={handleUserIconClick}
                    className="flex items-center text-gray-700 hover:text-[#B91C1C] transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>

              <Link
                href="/wishlist"
                className="text-gray-700 hover:text-[#B91C1C] transition-colors"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </Link>

              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-[#B91C1C] transition-colors"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#B91C1C] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
