"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { postJSON } from "@/lib/fetcher";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function logout() {
    try {
      await postJSON("/api/auth/logout", {});
    } finally {
      router.replace("/portal/login");
      router.refresh();
    }
  }
  return (
    <button onClick={logout} className={className || "btn-ghost w-full justify-start text-slate-600"}>
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
