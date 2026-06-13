"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mountain, Lock, Mail, Loader2 } from "lucide-react";
import { postJSON } from "@/lib/fetcher";

type FormValues = { email: string; password: string };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const data = await postJSON<{ redirect: string }>("/api/auth/login", values);
      const next = params.get("next");
      router.replace(next || data.redirect);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Mountain className="h-6 w-6" />
          </span>
          <span className="font-display text-2xl font-extrabold">Ooty Trails</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-slate-900">Staff login</h1>
          <p className="mt-1 text-sm text-slate-500">Admin &amp; driver access to the fleet portal.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label flex items-center gap-1.5"><Mail className="h-4 w-4 text-brand-500" /> Email</label>
              <input type="email" className="input" placeholder="you@ooty.in" autoComplete="email" {...register("email", { required: true })} />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Lock className="h-4 w-4 text-brand-500" /> Password</label>
              <input type="password" className="input" placeholder="••••••••" autoComplete="current-password" {...register("password", { required: true })} />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>) : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-brand-100/80">
          <Link href="/" className="hover:text-white">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
