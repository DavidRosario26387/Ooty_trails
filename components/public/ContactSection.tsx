import { Phone, MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";
import SectionHeader from "./SectionHeader";

export default function ContactSection() {
  return (
    <section className="section bg-brand-50/50" id="contact">
      <div className="container-page">
        <SectionHeader
          eyebrow="Get in touch"
          title="Book or ask us anything"
          subtitle="Call, WhatsApp, or send a message — we usually reply within minutes during the day."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <a href={`tel:${SITE.phone}`} className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Call us</p>
                <p className="text-sm text-slate-600">{SITE.phone}</p>
              </div>
            </a>
            <a href={whatsappLink("Hi Ooty Trails, I'd like to book a cab in Ooty.")} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#1da851]"><MessageCircle className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">WhatsApp</p>
                <p className="text-sm text-slate-600">Fastest response — chat with us</p>
              </div>
            </a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600"><Instagram className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Instagram</p>
                <p className="text-sm text-slate-600">Follow our Ooty journeys</p>
              </div>
            </a>
            <div className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><MapPin className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Location</p>
                <p className="text-sm text-slate-600">{SITE.location}</p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Clock className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Hours</p>
                <p className="text-sm text-slate-600">Available 24/7 for bookings</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
