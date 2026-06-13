import { type ComponentType } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  hint,
}: {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  tone?: "brand" | "accent" | "blue" | "violet";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    accent: "bg-accent-50 text-accent-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: { icon: ComponentType<{ className?: string }>; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
      <Icon className="h-9 w-9 text-slate-300" />
      <p className="font-medium text-slate-600">{title}</p>
      {desc && <p className="max-w-sm text-sm text-slate-400">{desc}</p>}
    </div>
  );
}

export function CardPanel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("card p-5", className)}>
      {title && <h3 className="mb-4 font-display text-base font-bold text-slate-900">{title}</h3>}
      {children}
    </div>
  );
}

export function INR({ value }: { value: number }) {
  return <>₹{value.toLocaleString("en-IN")}</>;
}
