import type { Metadata } from "next";
import FleetAvailability from "@/components/public/FleetAvailability";
import CTASection from "@/components/public/CTASection";

export const metadata: Metadata = {
  title: "Live Fleet Availability — Ooty Trails cabs",
  description:
    "Check the live availability of Ooty Trails' cab fleet in Ooty. See which vehicles are available, on trip or busy in real time before you book.",
};

export default function FleetPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-14 text-white">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-accent-300">Our Fleet</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Live vehicle availability</h1>
          <p className="mt-4 text-brand-50/90">
            Statuses refresh automatically as our drivers update them. Spot an available cab? Book it in seconds.
          </p>
        </div>
      </section>
      <FleetAvailability compact />
      <CTASection />
    </>
  );
}
