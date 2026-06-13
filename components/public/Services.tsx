import Icon from "@/components/ui/Icon";
import SectionHeader from "./SectionHeader";
import { SERVICES } from "@/lib/content";

export default function Services() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="What we offer"
          title="Everything you need to explore Ooty"
          subtitle="From quick airport transfers to multi-day Nilgiris tours — book the ride that fits your plan."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="card group p-6 transition-transform hover:-translate-y-1"
            >
              {/* {s.placeholder} */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={s.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
