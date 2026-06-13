import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PortalShell, { type NavItem } from "@/components/portal/PortalShell";

const NAV: NavItem[] = [
  { href: "/portal/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portal/admin/bookings", label: "Bookings", icon: "CalendarCheck" },
  { href: "/portal/admin/vehicles", label: "Vehicles", icon: "Car" },
  { href: "/portal/admin/drivers", label: "Drivers", icon: "UserRound" },
  { href: "/portal/admin/customers", label: "Customers", icon: "Users" },
  { href: "/portal/admin/messages", label: "Messages", icon: "MessageSquare" },
  { href: "/portal/admin/analytics", label: "Analytics", icon: "BarChart3" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense-in-depth: middleware already guards this, but verify here too.
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/portal/login");

  return (
    <PortalShell title="Admin Portal" nav={NAV} userName={session.name}>
      {children}
    </PortalShell>
  );
}
