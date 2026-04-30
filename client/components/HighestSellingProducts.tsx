"use client";

import Link from "next/link";
import ProductHoverActions from "@/components/ProductHoverActions";
import type { ShopProduct } from "@/contexts/ShopContext";

export type HighestSellingProduct = ShopProduct & {
  badge: string;
  priceLabel: string;
  rating: string;
  soldLabel: string;
  note?: string;
};

type HighestSellingProductsProps = {
  generationLabel: string;
  eyebrow?: string;
  description?: string;
  viewAllHref?: string;
  accentClassName?: string;
  backgroundClassName?: string;
  products: HighestSellingProduct[];
};

export default function HighestSellingProducts({
  generationLabel,
  eyebrow = "Highest Selling",
  description,
  viewAllHref = "/",
  accentClassName = "bg-[#111111] text-white",
  backgroundClassName = "bg-white",
  products,
}: HighestSellingProductsProps) {
  return (
    <section className={`${backgroundClassName} py-14`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${accentClassName}`}>
              {eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1f2933] md:text-4xl">
              Most Loved by {generationLabel}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f6670] md:text-base">
              {description || "Bestselling picks customers keep choosing for style, comfort, and everyday confidence."}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex w-fit items-center rounded-full border border-[#1f2933]/20 px-5 py-2 text-sm font-bold text-[#1f2933] transition hover:border-[#1f2933] hover:bg-[#1f2933] hover:text-white"
          >
            View all bestsellers
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group relative min-w-[245px] snap-start overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_12px_34px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(17,24,39,0.12)] lg:min-w-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef1f4]">
                <Link href={product.href || "/"}>
                  {product.video ? (
                    <video
                      autoPlay
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      src={product.video}
                    />
                  ) : (
                    <img
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={product.image}
                    />
                  )}
                </Link>

                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${accentClassName}`}>
                    #{index + 1}
                  </span>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1f2933] backdrop-blur">
                    {product.badge}
                  </span>
                </div>

                <ProductHoverActions product={product} />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a828c]">
                    {product.category}
                  </p>
                  <Link
                    href={product.href || "/"}
                    className="mt-1 block line-clamp-1 text-base font-extrabold text-[#1f2933] transition hover:text-[#B91C1C]"
                  >
                    {product.name}
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-black text-[#1f2933]">{product.priceLabel}</p>
                  <p className="rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-bold text-[#4b5563]">
                    {product.soldLabel}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-black/10 pt-3 text-xs font-semibold text-[#5f6670]">
                  <span>{product.rating} rating</span>
                  <span>{product.note || "Popular this week"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
