"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#B91C1C] p-8 text-white shadow-[0_18px_45px_rgba(17,24,39,0.35)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Legal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Terms & Conditions</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/85 sm:text-base">
              These Terms govern your use of StyleSakhi website and services. By using this website, you agree to
              these terms.
            </p>
            <p className="mt-4 text-xs text-white/80">Effective date: May 2, 2026</p>
          </div>

          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">1. Eligibility & Account</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                You must provide accurate details while placing orders. You are responsible for maintaining account
                confidentiality and for all activities under your account.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">2. Product Information & Pricing</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                We try to keep product descriptions, stock, and pricing accurate. However, errors may occur. We
                reserve the right to update, modify, or cancel orders in case of pricing or inventory errors.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">3. Order Acceptance</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Your order is confirmed only after successful payment authorization (or order acceptance for COD) and
                internal verification. We may decline or cancel suspicious/fraud-prone orders.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">4. Intellectual Property</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                All logos, designs, text, and content on this website are owned by StyleSakhi or licensed to us.
                Unauthorized use, reproduction, or distribution is prohibited.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">5. Limitation of Liability</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                StyleSakhi is not liable for indirect, incidental, or consequential losses arising from website usage,
                delays by third-party partners, or force-majeure events.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">6. Governing Law</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                These terms are governed by applicable laws of India. Jurisdiction for legal disputes shall lie with
                competent courts in India.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
