import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, MapPin, Route, Info } from "lucide-react";
import CTASection from "@/components/public/CTASection";
import { GUIDE_ATTRACTIONS, ITINERARIES, TRAVEL_TIPS } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Ooty Tourist Guide — Top attractions, tips & itineraries",
  description:
    "A complete Ooty travel guide: Ooty Lake, Botanical Gardens, Doddabetta, Pykara, Avalanche, Emerald Lake, Rose Garden, the Nilgiri Mountain Railway, travel tips and suggested itineraries.",
};

export default function GuidePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white sm:py-20">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-accent-300">Ooty Tourist Guide</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            Everything to see in Ooty & the Nilgiris
          </h1>
          <p className="mt-5 text-lg text-brand-50/90">
            Major attractions, honest travel tips and ready-made itineraries — so you can spend less time
            planning and more time enjoying the hills. Let us drive; you soak in the views.
          </p>
        </div>
      </section>

      {/* Attractions */}
      <section className="section bg-white">
        <div className="container-page">
          <h2 className="heading">Top attractions</h2>
          <div className="mt-10 space-y-8">
            {GUIDE_ATTRACTIONS.map((a, i) => (
              <article key={a.name} className="card grid gap-0 overflow-hidden lg:grid-cols-5">
                <div className={i % 2 === 0 ? "lg:col-span-2" : "lg:order-2 lg:col-span-2"}>
                  {/* {a.placeholder} */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMAGES.place[a.name]} alt={a.name} className="h-full min-h-[200px] w-full object-cover" />
                </div>
                <div className={i % 2 === 0 ? "p-6 lg:col-span-3 lg:p-8" : "p-6 lg:order-1 lg:col-span-3 lg:p-8"}>
                  <h3 className="font-display text-xl font-bold text-slate-900">{a.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-sm text-accent-800">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    <span><strong>Tip:</strong> {a.tip}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section className="section bg-brand-50/50">
        <div className="container-page">
          <h2 className="heading">Suggested itineraries</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Popular routes our drivers run all the time. We&apos;ll happily customise any of these to your pace and interests.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {ITINERARIES.map((it) => (
              <div key={it.title} className="card p-6">
                <div className="flex items-center gap-2 text-brand-600">
                  <Route className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold text-slate-900">{it.title}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {it.stops.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {s}
                    </li>
                  ))}
                </ul>
                <Link href="/book" className="btn-outline mt-5 w-full">Book this trip</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel tips */}
      <section className="section bg-white">
        <div className="container-page max-w-3xl">
          <h2 className="heading">Travel tips</h2>
          <ul className="mt-8 space-y-4">
            {TRAVEL_TIPS.map((t) => (
              <li key={t} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span className="text-sm text-slate-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  );
}
