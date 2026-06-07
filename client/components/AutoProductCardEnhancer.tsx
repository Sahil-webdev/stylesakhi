"use client";

import { useEffect, useMemo } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";

type AutoProductCardEnhancerProps = {
  scope?: string;
};

const SUPPORTED_ROUTES = [
  "/clothing",
  "/accessories",
  "/sneakers",
  "/clothing/the-atelier-trench",
  "/accessories/croissant-leather-bag",
  "/sneakers/nova-form-strider",
  "/product/",
];

function inferCategory(href: string) {
  if (href.includes("/clothing/")) return "Clothing";
  if (href.includes("/accessories/")) return "Accessories";
  if (href.includes("/sneakers/")) return "Sneakers";
  return "Fashion";
}

function parsePrice(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function AutoProductCardEnhancer({ scope = "main" }: AutoProductCardEnhancerProps) {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  const selector = useMemo(
    () =>
      SUPPORTED_ROUTES.map(
        (route) =>
          `${scope} a[href*="${route}"]:not([data-enhanced="true"])`
      ).join(", "),
    [scope]
  );

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(selector));
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;

      const imageContainer = img.parentElement;
      if (!imageContainer) return;
      if ((imageContainer as HTMLElement).dataset.quickActions === "true") return;

      card.dataset.enhanced = "true";
      (imageContainer as HTMLElement).dataset.quickActions = "true";
      imageContainer.classList.add("relative", "overflow-hidden");

      const productName =
        card.querySelector("h3")?.textContent?.trim() ||
        img.getAttribute("alt")?.trim() ||
        "Product";

      const priceText =
        Array.from(card.querySelectorAll("p,span"))
          .map((node) => node.textContent || "")
          .find((text) => /[$₹]/.test(text)) || "₹0";
      const href = card.getAttribute("href") || "/";
      const product: ShopProduct = {
        id: `${href}-${productName}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
        name: productName,
        price: parsePrice(priceText),
        image: img.getAttribute("src") || "",
        category: inferCategory(href),
        href,
      };

      const overlay = document.createElement("div");
      overlay.className =
        "pointer-events-none absolute inset-0 hidden items-end justify-center bg-black/20 p-3 opacity-0 transition-opacity duration-300 md:flex";

      const actionRow = document.createElement("div");
      actionRow.className =
        "pointer-events-auto flex w-full items-center gap-2 translate-y-3 transition-transform duration-300";

      const heartButton = document.createElement("button");
      heartButton.type = "button";
      heartButton.className =
        "rounded-full bg-white p-2 shadow-md transition hover:scale-105";

      const heartIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      heartIcon.setAttribute("class", "h-5 w-5");
      heartIcon.setAttribute("stroke-width", "2");
      heartIcon.setAttribute("fill", "none");
      heartIcon.setAttribute("stroke", "currentColor");
      
      const updateHeart = () => {
        const isWish = isWishlisted(product.id);
        heartIcon.setAttribute("fill", isWish ? "#B91C1C" : "none");
        heartIcon.setAttribute("color", isWish ? "#B91C1C" : "currentColor");
        heartIcon.setAttribute("d", "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z");
        heartButton.innerHTML = "";
        heartButton.appendChild(heartIcon);
      };
      updateHeart();

      const cartButton = document.createElement("button");
      cartButton.type = "button";
      cartButton.className =
        "flex-1 rounded-xl bg-[#111111] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[#B91C1C]";
      
      const cartIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      cartIcon.setAttribute("class", "mr-1.5 inline h-4 w-4");
      cartIcon.setAttribute("stroke-width", "2");
      cartIcon.setAttribute("viewBox", "0 0 24 24");
      cartIcon.setAttribute("fill", "none");
      cartIcon.setAttribute("stroke", "currentColor");
      cartIcon.setAttribute("d", "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0");
      
      const cartText = document.createTextNode("Add to Cart");
      cartButton.appendChild(cartIcon);
      cartButton.appendChild(cartText);

      const onHeartClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(product);
        setTimeout(updateHeart, 0);
      };

      const onCartClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(product);
      };

      heartButton.addEventListener("click", onHeartClick);
      cartButton.addEventListener("click", onCartClick);

      actionRow.appendChild(heartButton);
      actionRow.appendChild(cartButton);
      overlay.appendChild(actionRow);
      imageContainer.appendChild(overlay);

      const showOverlay = () => {
        overlay.classList.remove("opacity-0");
        overlay.classList.add("opacity-100");
        actionRow.classList.remove("translate-y-3");
        actionRow.classList.add("translate-y-0");
      };

      const hideOverlay = () => {
        overlay.classList.add("opacity-0");
        overlay.classList.remove("opacity-100");
        actionRow.classList.add("translate-y-3");
        actionRow.classList.remove("translate-y-0");
      };

      card.addEventListener("mouseenter", showOverlay);
      card.addEventListener("mouseleave", hideOverlay);

      cleanups.push(() => {
        heartButton.removeEventListener("click", onHeartClick);
        cartButton.removeEventListener("click", onCartClick);
        card.removeEventListener("mouseenter", showOverlay);
        card.removeEventListener("mouseleave", hideOverlay);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [selector, addToCart, isWishlisted, toggleWishlist]);

  return null;
}

