import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { DESTINATIONS } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export default function Destinations() {
  return (
    <section className="section bg-brand-50/50">
      <div className="container-page">
        <SectionHeader
          eyebrow="Popular destinations"
          title="Ooty's most-loved tourist spots"
          subtitle="We'll take you to all of these and more — see our full guide for tips and itineraries."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <div key={d.name} className="card group overflow-hidden">
              {/* {d.placeholder} */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.place[d.name]} alt={d.name} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-slate-900">{d.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{d.desc}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  <MapPin className="h-3.5 w-3.5" /> {d.distance}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/guide" className="btn-primary">
            Read the full Ooty guide <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
