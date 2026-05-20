"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundCancellationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#B91C1C] p-8 text-white shadow-[0_18px_45px_rgba(17,24,39,0.35)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Legal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Refund & Cancellation Policy</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/85 sm:text-base">
              This policy describes cancellation, return, replacement, and refund rules for all orders placed on
              StyleSakhi.
            </p>
            <p className="mt-4 text-xs text-white/80">Effective date: May 2, 2026</p>
          </div>

          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">1. Order Cancellation</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
                <li>Orders can be cancelled before they are marked as shipped.</li>
                <li>Once shipped, cancellation is not guaranteed and may convert to a return request.</li>
                <li>For prepaid orders, approved cancellations are refunded to the original payment method.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">2. Return / Replacement Window</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
                <li>Return or replacement requests must be raised within 7 days of delivery.</li>
                <li>Product must be unused, unwashed, and in original packaging with tags intact.</li>
                <li>Items damaged due to misuse, normal wear, or improper handling are not eligible.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">3. Non-Returnable Items</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Certain products may be marked non-returnable for hygiene, customization, or limited-edition reasons.
                Such exceptions are shown on the product detail page.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">4. Refund Timeline</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
                <li>Refund is initiated after item quality check and approval.</li>
                <li>Prepaid refunds are typically processed within 5-7 business days.</li>
                <li>Bank/payment gateway settlement timelines may vary after initiation.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">5. Contact for Refund/Cancellation</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                For support, mail us at{" "}
                <a className="font-medium text-[#B91C1C] hover:underline" href="mailto:info@stylesakhi.com">
                  info@stylesakhi.com
                </a>{" "}
                or call <span className="font-medium text-[#B91C1C]">+91 98765 43210</span> with your order ID.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
