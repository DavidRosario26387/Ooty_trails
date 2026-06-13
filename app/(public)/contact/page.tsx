import type { Metadata } from "next";
import ContactSection from "@/components/public/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Book your Ooty cab",
  description:
    "Contact Ooty Trails to book a cab in Ooty. Call, WhatsApp or send us a message. Available 24/7 for bookings and tour planning.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-14 text-white">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-accent-300">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">We&apos;d love to help plan your trip</h1>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
