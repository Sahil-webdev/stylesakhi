import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#B91C1C] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-semibold">
                <span className="text-white">style</span>
                <span className="text-[#B91C1C]">sakhi</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your ultimate destination for ethnic fashion and premium accessories. 
              Celebrating tradition with contemporary style.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/women" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Exclusive Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-[#B91C1C] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-[#B91C1C] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm hover:text-[#B91C1C] transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#B91C1C] mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  123 Fashion Street, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#B91C1C] flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#B91C1C] flex-shrink-0" />
                <span className="text-sm">info@stylesakhi.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium text-sm mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
                <button className="px-4 py-2 bg-[#B91C1C] text-white text-sm font-medium rounded-r-md hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} StyleSakhi. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#B91C1C] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-[#B91C1C] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-[#B91C1C] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
