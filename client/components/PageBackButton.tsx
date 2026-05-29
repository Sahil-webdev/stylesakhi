"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type PageBackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export default function PageBackButton({
  fallbackHref = "/",
  label = "Back",
  className = "",
}: PageBackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`group inline-flex items-center gap-2 rounded-full border border-[#2c2f301a] bg-white/85 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#2c2f30] shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#644aad66] hover:text-[#644aad] sm:px-4 sm:py-2.5 sm:text-sm ${className}`}
      aria-label={label}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f2f4f7] text-[#2c2f30] transition group-hover:bg-[#ede8ff] group-hover:text-[#644aad]">
        <ArrowLeft className="h-3.5 w-3.5" />
      </span>
      <span>{label}</span>
    </button>
  );
}

