"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useShop, type ShopProduct } from "@/contexts/ShopContext";

type ProductHoverActionsProps = {
  product: ShopProduct;
};

export default function ProductHoverActions({ product }: ProductHoverActionsProps) {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  const haltEvent = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const nativeEvent = event.nativeEvent as Event & { stopImmediatePropagation?: () => void };
    nativeEvent.stopImmediatePropagation?.();
  };

  return (
    <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-black/20 p-3 opacity-0 transition-opacity duration-300 md:flex group-hover:opacity-100">
      <div className="pointer-events-auto flex w-full items-center gap-2 translate-y-3 transition-transform duration-300 group-hover:translate-y-0">
        <button
          aria-label="Add to wishlist"
          className="rounded-full bg-white p-2 shadow-md transition hover:scale-105"
          data-shop-action="wishlist"
          onMouseDown={haltEvent}
          onPointerDown={haltEvent}
          onClick={(event) => {
            haltEvent(event);
            toggleWishlist(product);
          }}
          type="button"
        >
          <Heart
            className="h-5 w-5"
            strokeWidth={2}
            fill={isWishlisted(product.id) ? "#B91C1C" : "none"}
            color={isWishlisted(product.id) ? "#B91C1C" : "currentColor"}
          />
        </button>

        <button
          className="flex-1 rounded-xl bg-[#111111] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[#B91C1C]"
          data-shop-action="cart"
          onMouseDown={haltEvent}
          onPointerDown={haltEvent}
          onClick={(event) => {
            haltEvent(event);
            addToCart(product);
          }}
          type="button"
        >
          <ShoppingCart className="mr-1.5 inline h-4 w-4" strokeWidth={2} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
