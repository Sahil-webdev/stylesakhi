"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock3, Mail, Phone } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#B91C1C] p-8 text-white shadow-[0_18px_45px_rgba(17,24,39,0.35)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Support</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/85 sm:text-base">
              Need help with order, payment, return, or delivery? Our support team is here to assist you.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <Phone className="h-5 w-5 text-[#B91C1C]" />
              <h2 className="mt-3 text-lg font-semibold text-[#111827]">Phone Support</h2>
              <p className="mt-2 text-sm text-[#4b5563]">+91 98765 43210</p>
            </div>
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <Mail className="h-5 w-5 text-[#B91C1C]" />
              <h2 className="mt-3 text-lg font-semibold text-[#111827]">Email Support</h2>
              <p className="mt-2 text-sm text-[#4b5563]">info@stylesakhi.com</p>
            </div>
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <Clock3 className="h-5 w-5 text-[#B91C1C]" />
              <h2 className="mt-3 text-lg font-semibold text-[#111827]">Working Hours</h2>
              <p className="mt-2 text-sm text-[#4b5563]">Mon-Sat, 10:00 AM - 7:00 PM</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#111827]">For Razorpay / Payment Issues</h2>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">
              If your payment is deducted but order is not confirmed, please contact us with transaction ID, order ID,
              payment date, and registered mobile number. Our team will verify and respond as soon as possible.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">
              We aim to respond to all customer queries within 24-48 business hours.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
