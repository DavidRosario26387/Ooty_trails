import type { Metadata } from "next";
import BookingForm from "@/components/public/BookingForm";

export const metadata: Metadata = {
  title: "Book a Cab in Ooty — Instant fare estimate",
  description:
    "Book a reliable cab in Ooty online. Enter your trip details for an instant approximate fare and get a booking reference in seconds.",
};

export default function BookPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-14 text-white">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-accent-300">Book Your Ride</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Reserve your Ooty cab</h1>
          <p className="mt-4 text-brand-50/90">
            Fill in your trip details and we&apos;ll confirm a clean, comfortable cab with a friendly local driver.
          </p>
        </div>
      </section>

      <section className="section bg-brand-50/40">
        <div className="container-page">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
