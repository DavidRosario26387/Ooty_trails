import { Star, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { TESTIMONIALS } from "@/lib/content";

export default function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Happy travellers"
          title="What our customers say"
          subtitle="Real experiences from families and travellers who explored Ooty with us."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col p-6">
              <Quote className="h-8 w-8 text-brand-200" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.quote}”
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                {/* {t.placeholder} */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <figcaption className="text-sm font-semibold text-slate-900">{t.name}</figcaption>
                  <p className="text-xs text-slate-500">{t.from}</p>
                </div>
                <div className="ml-auto flex gap-0.5 text-accent-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
