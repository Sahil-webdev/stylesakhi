"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProductBySlug } from "@/lib/products-api";
import { buildCategoryDetailHref } from "@/lib/product-link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductRedirectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = String(params?.id || "");
  const [message, setMessage] = useState("Redirecting to product details...");

  useEffect(() => {
    let active = true;

    const redirectToPreferredDetailPage = async () => {
      try {
        const product = await fetchProductBySlug(productId);
        if (!active || !product?._id) return;
        router.replace(buildCategoryDetailHref(product.category, product.slug || product._id));
      } catch {
        if (!active) return;
        setMessage("Product not found.");
      }
    };

    if (productId) {
      void redirectToPreferredDetailPage();
    } else {
      setMessage("Invalid product link.");
    }

    return () => {
      active = false;
    };
  }, [productId, router]);

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-24 text-center">
        <div className="rounded-2xl bg-white px-8 py-10 shadow-sm">
          <p className="text-base text-[#595c5d]">{message}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
