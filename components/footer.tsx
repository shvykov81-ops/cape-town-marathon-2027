import Link from "next/link";
import { Mountain, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Mountain className="w-8 h-8 text-teal-400" />
              <span className="text-xl font-bold">Cape Town Marathon</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Africa's most beautiful marathon. 42.2km of coastal roads, mountain views, and unforgettable experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-teal-400 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-400 hover:text-teal-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-400 hover:text-teal-400 transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-400 hover:text-teal-400 transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/about-race" className="hover:text-white transition-colors">About the Race</Link></li>
              <li><Link href="/prep-camp" className="hover:text-white transition-colors">Prep Camp</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Book Now</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-neutral-400 mb-4">Get race updates and exclusive offers.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-neutral-500">
          <p>© 2027 Cape Town Marathon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
