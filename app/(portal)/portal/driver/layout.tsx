import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PortalShell, { type NavItem } from "@/components/portal/PortalShell";

const NAV: NavItem[] = [
  { href: "/portal/driver", label: "My Vehicle", icon: "Car" },
  { href: "/portal/driver/trips", label: "Trip History", icon: "CalendarCheck" },
];

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "driver") redirect("/portal/login");

  return (
    <PortalShell title="Driver Portal" nav={NAV} userName={session.name}>
      {children}
    </PortalShell>
  );
}
