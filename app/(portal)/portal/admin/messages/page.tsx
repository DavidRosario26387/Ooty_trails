"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Mail, Phone, MessageSquare, Check, RotateCcw, Trash2, Inbox } from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PageHeader, EmptyState } from "@/components/portal/widgets";
import { cn } from "@/lib/cn";

interface ContactMessage {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

const FILTERS = ["all", "new", "handled"] as const;

export default function MessagesPage() {
  const { data: messages, isLoading } = useSWR<ContactMessage[]>("/api/admin/messages", fetcher, {
    refreshInterval: 30000,
  });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setHandled(id: string, handled: boolean) {
    setBusyId(id);
    try {
      await postJSON(`/api/admin/messages/${id}`, { handled }, "PATCH");
      await mutate("/api/admin/messages");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusyId(id);
    try {
      await postJSON(`/api/admin/messages/${id}`, {}, "DELETE");
      await mutate("/api/admin/messages");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const all = messages ?? [];
  const newCount = all.filter((m) => !m.handled).length;
  const list = all.filter((m) =>
    filter === "all" ? true : filter === "new" ? !m.handled : m.handled,
  );

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Contact-form messages submitted from the website."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-brand-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {f === "new" ? `New (${newCount})` : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading messages…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages here" desc="Messages from the website contact form will appear here." />
      ) : (
        <div className="space-y-4">
          {list.map((m) => (
            <div
              key={m._id}
              className={cn("card p-5", !m.handled && "border-l-4 border-l-brand-500")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    {!m.handled ? (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">New</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Handled</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-brand-600"><Phone className="h-3.5 w-3.5" /> {m.phone}</a>
                    {m.email && <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-brand-600"><Mail className="h-3.5 w-3.5" /> {m.email}</a>}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-3 flex gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="whitespace-pre-wrap">{m.message}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {!m.handled ? (
                  <button disabled={busyId === m._id} onClick={() => setHandled(m._id, true)} className="btn-primary py-2">
                    <Check className="h-4 w-4" /> Mark as handled
                  </button>
                ) : (
                  <button disabled={busyId === m._id} onClick={() => setHandled(m._id, false)} className="btn-outline py-2">
                    <RotateCcw className="h-4 w-4" /> Mark as new
                  </button>
                )}
                <button disabled={busyId === m._id} onClick={() => remove(m._id)} className="btn-outline py-2 text-red-600 ring-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
