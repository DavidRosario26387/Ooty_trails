import {
  MapPin,
  Plane,
  Sunrise,
  Leaf,
  Users,
  Mountain,
  ShieldCheck,
  BadgeIndianRupee,
  Sparkles,
  Clock,
  MapPinned,
  Headphones,
  type LucideProps,
} from "lucide-react";

// Map content-driven icon names to components (lets us keep content as plain data).
const ICONS = {
  MapPin,
  Plane,
  Sunrise,
  Leaf,
  Users,
  Mountain,
  ShieldCheck,
  BadgeIndianRupee,
  Sparkles,
  Clock,
  MapPinned,
  Headphones,
} as const;

export type IconName = keyof typeof ICONS;

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name as IconName] ?? MapPin;
  return <Cmp {...props} />;
}
