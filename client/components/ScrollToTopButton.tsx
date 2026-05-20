"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

type ScrollToTopButtonProps = {
  bgColorClass?: string;
  shadowClass?: string;
};

export default function ScrollToTopButton({
  bgColorClass = "bg-[#2563eb]",
  shadowClass = "shadow-[0_10px_30px_rgba(37,99,235,0.35)]",
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-6 z-50 grid h-12 w-12 place-items-center rounded-full text-white transition-all duration-300 md:right-8 ${bgColorClass} ${shadowClass} ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
