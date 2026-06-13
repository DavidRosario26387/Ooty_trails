import Link from "next/link";
import { Users, Check } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { VEHICLE_CATEGORY_CARDS } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export default function VehicleCategories() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Our vehicles"
          title="Pick the right ride for your group"
          subtitle="All vehicles are air-conditioned, well-maintained and driven by experienced local drivers."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VEHICLE_CATEGORY_CARDS.map((v) => (
            <div key={v.category} className="card overflow-hidden">
              {/* {v.placeholder} */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.category[v.category]} alt={`${v.category} cab`} className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-slate-900">{v.category}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    <Users className="h-3.5 w-3.5" /> {v.seats}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{v.blurb}</p>
                <ul className="mt-4 space-y-1.5">
                  {v.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-4 w-4 text-brand-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/book" className="btn-outline mt-5 w-full">
                  Book this category
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
