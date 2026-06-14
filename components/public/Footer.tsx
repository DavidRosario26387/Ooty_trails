import Link from "next/link";
import { Phone, MapPin, Instagram, MessageCircle, Mountain } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-900 text-brand-50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Mountain className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-xl font-extrabold">Ready Go</span>
          </div>
          <p className="mt-4 text-sm text-brand-100/80">{SITE.description}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-200">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-100/80">
            <li><Link href="/book" className="hover:text-white">Book a Cab</Link></li>
            <li><Link href="/fleet" className="hover:text-white">Live Fleet</Link></li>
            <li><Link href="/guide" className="hover:text-white">Ooty Tourist Guide</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-200">Services</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-100/80">
            <li>Local Sightseeing</li>
            <li>Airport Transfers</li>
            <li>Tea Estate Tours</li>
            <li>Sunrise Tours</li>
            <li>Family & Group Trips</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-200">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-100/80">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent-300" />
              <a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent-300" />
              <a href={whatsappLink("Hi Ready Go, I'd like to book a cab.")} className="hover:text-white" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-accent-300" />
              <a href={SITE.instagram} className="hover:text-white" target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent-300" />
              {SITE.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Ready Go. All rights reserved.</p>
          <p>
            Fleet partners? <Link href="/portal/login" className="font-semibold text-accent-300 hover:text-accent-200">Staff login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
