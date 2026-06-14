import Link from "next/link";
import { Phone, ShieldCheck, Sparkles, BadgeIndianRupee, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Replace with image of Ooty tea-estate hills (hero background) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMAGES.heroBackground} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-800/90 via-brand-800/80 to-brand-900/90" />

      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-50 ring-1 ring-white/20">
            {SITE.tagline}
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your Journey,
            <br />
            <span className="text-accent-300">Our Responsibility</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-50/90">
            Reliable, transparent cab service for exploring Ooty and the Nilgiris. Local drivers,
            clean cars, and easy online booking — for families, couples and groups.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-accent text-base">
              Book Your Ride
            </Link>
            <a
              href={whatsappLink("Hi Ready Go, I'd like to book a cab in Ooty.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-brand-700 hover:bg-brand-50"
            >
              <MessageCircle className="h-5 w-5" /> Book on WhatsApp
            </a>
            <a href={`tel:${SITE.phone}`} className="btn border border-white/30 text-white hover:bg-white/10">
              <Phone className="h-5 w-5" /> {SITE.phone}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-50/90">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent-300" /> Safe rides</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent-300" /> Clean cars</span>
            <span className="inline-flex items-center gap-2"><BadgeIndianRupee className="h-5 w-5 text-accent-300" /> Best prices</span>
          </div>
        </div>

        <div className="animate-fade-up">
          {/* Replace with image of tourist cab in front of Ooty hills */}
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.heroCab} alt="Tourist cab ready to explore Ooty" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
