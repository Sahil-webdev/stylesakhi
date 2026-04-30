"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, Mail, Package, Phone, User, UserPen, LogOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  progress: number;
}

export interface UserAccountAvatarProps {
  user: UserData;
  orders?: Order[];
  onProfileSave?: (user: UserData) => void;
  onOrderView?: (orderId: string) => void;
  onLogout?: () => void;
  className?: string;
}

const mockOrders: Order[] = [
  { id: "ORD001", date: "2026-03-08", status: "delivered", progress: 100 },
  { id: "ORD002", date: "2026-03-11", status: "shipped", progress: 66 },
];

export default function UserAccountAvatar({
  user,
  orders = mockOrders,
  onProfileSave,
  onOrderView,
  onLogout,
  className = "",
}: UserAccountAvatarProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "orders" | null>(null);
  const [userData, setUserData] = useState<UserData>(user);
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const initials = useMemo(() => {
    const parts = userData.name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }, [userData.name]);

  const getStatusColor = (status: Order["status"]) => {
    if (status === "processing") return "bg-blue-500";
    if (status === "shipped") return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...userData,
      name: (formData.get("name") as string) || userData.name,
      email: (formData.get("email") as string) || userData.email,
    };
    setUserData(updatedUser);
    onProfileSave?.(updatedUser);
    setActiveSection(null);
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center rounded-full border border-gray-200 bg-white p-0.5 transition hover:border-[#B91C1C]/50"
        aria-label="User account"
      >
        {userData.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userData.avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B91C1C] text-xs font-semibold text-white">
            {initials}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-[120] mt-2 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-800">{userData.name}</p>
              <p className="truncate text-xs text-gray-500">{userData.email}</p>
            </div>

            <div className="flex flex-col border-b border-gray-100 p-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/faqs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <Mail className="h-4 w-4" />
                FAQs
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Link>
            </div>

            <div className="p-1">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === "profile" ? null : "profile")}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <UserPen className="h-4 w-4" />
                Edit Profile
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "profile" && (
                  <motion.form
                    initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, height: "auto" }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden px-3 pb-2 pt-1"
                    onSubmit={handleProfileSave}
                  >
                    <input
                      name="name"
                      defaultValue={userData.name}
                      className="h-9 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#B91C1C]"
                    />
                    <input
                      name="email"
                      defaultValue={userData.email}
                      type="email"
                      className="h-9 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#B91C1C]"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-md bg-[#B91C1C] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#991B1B]"
                    >
                      Save Changes
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setActiveSection(activeSection === "orders" ? null : "orders")}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#B91C1C]"
              >
                <Package className="h-4 w-4" />
                Last Orders
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "orders" && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, height: "auto" }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden px-3 pb-2 pt-1"
                  >
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-md border border-gray-100 bg-gray-50 p-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-800">{order.id}</span>
                          <span className="text-[11px] text-gray-500">{order.date}</span>
                        </div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="capitalize text-gray-700">{order.status}</span>
                          <span className="text-gray-500">{order.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${getStatusColor(order.status)}`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => onOrderView?.(order.id)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#B91C1C]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLogout?.();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
