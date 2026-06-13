import Icon from "@/components/ui/Icon";
import SectionHeader from "./SectionHeader";
import { WHY_US } from "@/lib/content";

export default function WhyUs() {
  return (
    <section className="section bg-brand-50/50">
      <div className="container-page">
        <SectionHeader
          eyebrow="Why choose us"
          title="A local fleet you can trust"
          subtitle="A family-run service built on safety, fair pricing and genuine Ooty hospitality."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w) => (
            <div key={w.title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                <Icon name={w.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
