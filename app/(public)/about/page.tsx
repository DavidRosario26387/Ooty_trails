import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Heart, MapPinned, BadgeIndianRupee, Users, Leaf } from "lucide-react";
import CTASection from "@/components/public/CTASection";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us — Family-run Ooty taxi service",
  description:
    "Ready Go is a family-run taxi service in Ooty offering safe drivers, transparent pricing and genuine local expertise for a tourist-friendly experience.",
};

const VALUES = [
  { icon: Heart, title: "Family-run service", desc: "A small, dedicated family fleet — every guest is treated personally, not like a number." },
  { icon: MapPinned, title: "Local Ooty expertise", desc: "Born-and-raised drivers who know every hill road, viewpoint and the best times to visit." },
  { icon: ShieldCheck, title: "Safe & reliable drivers", desc: "Experienced, courteous drivers and regularly serviced vehicles for worry-free travel." },
  { icon: BadgeIndianRupee, title: "Transparent pricing", desc: "Fixed package prices shared upfront — no hidden charges, ever." },
  { icon: Users, title: "Tourist-friendly", desc: "Flexible itineraries, patient drivers and help with tickets, permits and recommendations." },
  { icon: Leaf, title: "Respect for nature", desc: "We promote responsible travel through Ooty's tea estates, lakes and eco-zones." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white sm:py-20">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-accent-300">About Ready Go</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            A family fleet, exploring Ooty the right way
          </h1>
          <p className="mt-5 text-lg text-brand-50/90">
            We started Ready Go to solve a simple problem tourists face every day — finding a reliable,
            fairly-priced cab in Ooty without endless phone calls. Today our small family fleet helps
            travellers discover the Nilgiris safely and comfortably.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="heading">Our story</h2>
            <p className="mt-4 text-slate-600">
              Ooty is one of South India&apos;s most-loved hill stations, yet app-based cabs like Ola and
              Uber barely operate here. Most visitors still have to track down a taxi stand or make
              repeated phone calls to arrange a ride.
            </p>
            <p className="mt-4 text-slate-600">
              As a local family running a handful of well-kept vehicles, we wanted to bring the
              convenience of online booking to our hometown — while keeping the warmth and trust of a
              personal, family-run service. Every trip is driven by someone who genuinely knows and
              loves these hills.
            </p>
            <p className="mt-4 text-slate-600">
              From a single airport transfer to a multi-day Nilgiris tour, our promise stays the same:
              clean cars, safe driving, fair prices and a friendly local guide behind the wheel.
            </p>
            <Link href="/book" className="btn-primary mt-6">Plan your trip with us</Link>
          </div>
          <div>
            {/* Replace with image of the Ready Go family / drivers with their cabs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.aboutFamily} alt="Family enjoying their Ooty trip" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
          </div>
        </div>
      </section>

      <section className="section bg-brand-50/50">
        <div className="container-page">
          <h2 className="heading text-center">What we stand for</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
