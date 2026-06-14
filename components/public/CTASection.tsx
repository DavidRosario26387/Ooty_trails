import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center text-white sm:px-12">
          {/* Replace with image of Ooty landscape (CTA background) */}
          <div className="absolute inset-0 -z-0 opacity-20 [background:radial-gradient(50%_50%_at_50%_0%,white,transparent)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Let&apos;s make your Ooty trip memorable
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-50/90">
              Tell us your plan and we&apos;ll arrange a clean, comfortable cab with a friendly local driver.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/book" className="btn-accent text-base">
                Book Your Ride
              </Link>
              <a
                href={whatsappLink("Hi Ready Go, I'd like to book a cab in Ooty.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-brand-700 hover:bg-brand-50"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp us
              </a>
              <a href={`tel:${SITE.phone}`} className="btn border border-white/30 text-white hover:bg-white/10">
                <Phone className="h-5 w-5" /> Call {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
