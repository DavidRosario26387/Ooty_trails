"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { postJSON } from "@/lib/fetcher";

type FormValues = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

export default function ContactForm() {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await postJSON("/api/contact", values);
      setSent(true);
      reset();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Failed to send. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-500" />
        <h3 className="font-display text-xl font-bold text-slate-900">Message sent!</h3>
        <p className="text-sm text-slate-600">
          Thanks for reaching out. We&apos;ll get back to you shortly. For anything urgent, message us on WhatsApp.
        </p>
        <button className="btn-outline mt-2" onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input id="name" className="input" placeholder="Your name" {...register("name", { required: true })} />
        {formState.errors.name && <p className="mt-1 text-xs text-red-600">Name is required</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" className="input" placeholder="Phone number" {...register("phone", { required: true })} />
          {formState.errors.phone && <p className="mt-1 text-xs text-red-600">Phone is required</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email (optional)</label>
          <input id="email" type="email" className="input" placeholder="you@example.com" {...register("email")} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" rows={4} className="input resize-none" placeholder="How can we help?" {...register("message", { required: true, minLength: 5 })} />
        {formState.errors.message && <p className="mt-1 text-xs text-red-600">Please add a short message</p>}
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
        <Send className="h-4 w-4" /> {formState.isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
