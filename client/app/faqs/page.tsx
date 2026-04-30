"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Mail, MessageSquare, Search, ShieldCheck, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FaqCategory = "Orders" | "Shipping" | "Returns" | "Payments" | "Account" | "Security";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
};

const faqItems: FaqItem[] = [
  {
    id: "order-1",
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "Go to Orders from your account menu, open the order, and check the live status timeline. You will also receive shipping updates on email.",
  },
  {
    id: "order-2",
    category: "Orders",
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, you can cancel before dispatch from the Orders page. Once dispatched, cancellation may not be available and you can request a return after delivery.",
  },
  {
    id: "ship-1",
    category: "Shipping",
    question: "What are your delivery timelines?",
    answer:
      "Standard delivery usually takes 3-7 business days. Metro cities are often faster, while remote pin codes may take longer.",
  },
  {
    id: "ship-2",
    category: "Shipping",
    question: "Do you offer free shipping?",
    answer:
      "Yes, free shipping is available above the minimum cart value shown at checkout. Charges, if any, are always visible before payment.",
  },
  {
    id: "return-1",
    category: "Returns",
    question: "What is your return window?",
    answer:
      "Most products are returnable within 7 days of delivery, provided items are unused, unwashed, and returned with original tags and packaging.",
  },
  {
    id: "return-2",
    category: "Returns",
    question: "How do I request a return or exchange?",
    answer:
      "Open the order in your Orders page, select the item, and choose Return/Exchange. Pick a reason and confirm pickup details.",
  },
  {
    id: "pay-1",
    category: "Payments",
    question: "Which payment methods are supported?",
    answer:
      "We support UPI, credit/debit cards, net banking, and selected wallets. Availability may vary based on your location and order value.",
  },
  {
    id: "pay-2",
    category: "Payments",
    question: "My payment failed but amount was deducted. What should I do?",
    answer:
      "Failed transactions are usually auto-reversed by your bank within 3-7 business days. If not, contact support with transaction ID.",
  },
  {
    id: "account-1",
    category: "Account",
    question: "How do I update my profile details?",
    answer:
      "Go to Profile from the user menu. You can update your name, email, and other account details there.",
  },
  {
    id: "account-2",
    category: "Account",
    question: "I forgot my password. How can I reset it?",
    answer:
      "Use the Forgot Password option on the login screen. We will send a secure reset link to your registered email address.",
  },
  {
    id: "security-1",
    category: "Security",
    question: "Is my payment and personal data secure?",
    answer:
      "Yes. We use secure, encrypted payment processing and follow industry best practices to protect account and transaction data.",
  },
  {
    id: "security-2",
    category: "Security",
    question: "How can I report suspicious account activity?",
    answer:
      "Please contact support immediately from Contact page and change your password. We recommend enabling stronger password hygiene.",
  },
];

const categories: Array<FaqCategory | "All"> = ["All", "Orders", "Shipping", "Returns", "Payments", "Account", "Security"];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | "All">("All");
  const [openItemId, setOpenItemId] = useState<string | null>("order-1");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqItems.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const queryMatch =
        q.length === 0 ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [query, selectedCategory]);

  const supportEmail = "sahilshh777@gmail.com";
  const supportSubject = encodeURIComponent("Style Sakhi Support Request");
  const supportBody = encodeURIComponent(
    "Hi Style Sakhi Team,%0D%0A%0D%0AI need help with:%0D%0AOrder ID (if any):%0D%0AIssue details:%0D%0A%0D%0AThanks."
  );
  const supportMailto = `mailto:${supportEmail}?subject=${supportSubject}&body=${supportBody}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#ffffff_45%,#f8fafc_100%)] pt-24 pb-16">
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <HelpCircle className="h-3.5 w-3.5" />
                Help Center
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Frequently Asked Questions</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Quick answers about orders, shipping, returns, payments, and account security.
              </p>
            </div>
            <a
              href={supportMailto}
              className="inline-flex items-center justify-center rounded-xl bg-[#B91C1C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#991B1B]"
            >
              Contact Support
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
                <Truck className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Shipping Updates</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Real-time tracking and delivery notifications.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Secure Payments</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Protected checkout with encrypted transactions.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
                <MessageSquare className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Fast Support</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Reach us quickly for return and order help.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search questions like 'return window' or 'track order'"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#B91C1C]/40 focus:bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-[#B91C1C] bg-[#B91C1C] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No FAQ found</p>
                <p className="mt-1 text-sm text-slate-500">Try another keyword or change category filter.</p>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = openItemId === item.id;
                return (
                  <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenItemId(isOpen ? null : item.id)}
                      className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5"
                    >
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{item.category}</p>
                        <h2 className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">{item.question}</h2>
                      </div>
                      <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen ? (
                      <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
                        <p className="text-sm leading-6 text-slate-600">{item.answer}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Still need help?</p>
              <p className="mt-1 text-sm text-slate-600">Our support team can help with specific order or account issues.</p>
            </div>
            <a
              href={supportMailto}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 sm:mt-0"
            >
              <Mail className="h-4 w-4" />
              Reach Support
            </a>
          </div>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
