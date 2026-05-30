"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { rememberAuthRedirect } from "@/lib/auth-redirect";
import { useAuth } from "@/contexts/AuthContext";
import { resolveProductHref } from "@/lib/product-link";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  video?: string;
  category: string;
  href?: string;
};

export type CartItem = ShopProduct & {
  quantity: number;
};

type ShopContextValue = {
  wishlist: ShopProduct[];
  cart: CartItem[];
  wishlistCount: number;
  cartCount: number;
  isWishlisted: (id: string) => boolean;
  addToWishlist: (product: ShopProduct) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (product: ShopProduct) => void;
  addToCart: (product: ShopProduct, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const STORAGE_KEY = "stylesakhi_shop_v1";
const CLEAR_SHOP_EVENT = "stylesakhi:clear-shop";

type PersistedState = {
  wishlist: ShopProduct[];
  cart: CartItem[];
};

const normalizeShopProduct = (product: ShopProduct): ShopProduct => ({
  ...product,
  id: String(product.id || ""),
  href: resolveProductHref({ id: product.id, href: product.href }),
});

const normalizeCartItem = (item: CartItem): CartItem => ({
  ...normalizeShopProduct(item),
  quantity: Math.max(1, Number(item.quantity || 1)),
});

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState<ShopProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      if (!localStorage.getItem("authToken")) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as PersistedState;
      return Array.isArray(parsed.wishlist) ? parsed.wishlist.map((item) => normalizeShopProduct(item)) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      if (!localStorage.getItem("authToken")) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as PersistedState;
      return Array.isArray(parsed.cart) ? parsed.cart.map((item) => normalizeCartItem(item)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const payload: PersistedState = { wishlist, cart };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [wishlist, cart]);

  const clearStoredShop = useCallback(() => {
    setWishlist([]);
    setCart([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    window.addEventListener(CLEAR_SHOP_EVENT, clearStoredShop);
    return () => window.removeEventListener(CLEAR_SHOP_EVENT, clearStoredShop);
  }, [clearStoredShop]);

  const requireLogin = useCallback(
    (target: "cart" | "wishlist") => {
      if (authLoading) return false;
      if (isAuthenticated) return true;

      rememberAuthRedirect(`Please login first to add items to your ${target}.`);
      router.push("/auth");
      return false;
    },
    [authLoading, isAuthenticated, router]
  );

  const addToWishlist = useCallback((product: ShopProduct) => {
    if (!requireLogin("wishlist")) return;
    const safeProduct = normalizeShopProduct(product);

    setWishlist((prev) => {
      if (prev.some((item) => item.id === safeProduct.id)) return prev;
      return [safeProduct, ...prev];
    });
  }, [requireLogin]);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleWishlist = useCallback((product: ShopProduct) => {
    if (!requireLogin("wishlist")) return;
    const safeProduct = normalizeShopProduct(product);

    setWishlist((prev) => {
      if (prev.some((item) => item.id === safeProduct.id)) {
        return prev.filter((item) => item.id !== safeProduct.id);
      }
      return [safeProduct, ...prev];
    });
  }, [requireLogin]);

  const addToCart = useCallback((product: ShopProduct, quantity = 1) => {
    if (!requireLogin("cart")) return;

    const safeQuantity = Math.max(1, Math.floor(quantity));
    const safeProduct = normalizeShopProduct(product);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === safeProduct.id);
      if (existing) {
        return prev.map((item) =>
          item.id === safeProduct.id ? { ...item, quantity: item.quantity + safeQuantity } : item
        );
      }
      return [{ ...safeProduct, quantity: safeQuantity }, ...prev];
    });
  }, [requireLogin]);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<ShopContextValue>(
    () => ({
      wishlist: isAuthenticated ? wishlist : [],
      cart: isAuthenticated ? cart : [],
      wishlistCount: isAuthenticated ? wishlist.length : 0,
      cartCount: isAuthenticated ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0,
      isWishlisted: (id: string) => isAuthenticated && wishlist.some((item) => item.id === id),
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
    }),
    [
      addToCart,
      addToWishlist,
      cart,
      clearCart,
      isAuthenticated,
      removeFromCart,
      removeFromWishlist,
      toggleWishlist,
      updateCartQuantity,
      wishlist,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }
  return context;
}
