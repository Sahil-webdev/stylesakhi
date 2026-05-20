"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#B91C1C] p-8 text-white shadow-[0_18px_45px_rgba(17,24,39,0.35)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Legal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/85 sm:text-base">
              This Privacy Policy explains how StyleSakhi collects, uses, stores, and protects your personal data
              when you use our website and services.
            </p>
            <p className="mt-4 text-xs text-white/80">Effective date: May 2, 2026</p>
          </div>

          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">1. Information We Collect</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
                <li>Name, phone number, email address, and shipping/billing details.</li>
                <li>Order history, payment status, and transaction references.</li>
                <li>Device/browser data, IP address, and site usage analytics.</li>
                <li>Support messages, feedback, and communication records.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">2. How We Use Your Information</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
                <li>To process orders, deliveries, returns, cancellations, and refunds.</li>
                <li>To provide customer support and respond to your queries.</li>
                <li>To improve website performance, product experience, and security.</li>
                <li>To send service updates and promotional communication (only where permitted).</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">3. Data Sharing</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                We share limited data only with trusted service providers such as payment gateways, shipping partners,
                fraud prevention tools, and technology vendors, strictly for order fulfillment and operational purposes.
                We do not sell your personal data.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">4. Data Security & Retention</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                We use commercially reasonable safeguards to protect your data. Personal information is retained only
                as long as necessary for legal, operational, and compliance purposes.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">5. Your Rights</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                You may request access, correction, or deletion of your personal data by contacting us at{" "}
                <a className="font-medium text-[#B91C1C] hover:underline" href="mailto:info@stylesakhi.com">
                  info@stylesakhi.com
                </a>
                .
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#111827]">6. Policy Updates</h2>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                We may update this policy from time to time. Changes will be posted on this page with an updated
                effective date.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
