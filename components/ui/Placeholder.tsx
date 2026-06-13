import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Labeled image placeholder.
 *
 * Every visual that the client needs to supply uses this component so the
 * intent is explicit on screen AND in code. Search the codebase for
 * "Replace with image of" to find every spot that needs a real asset.
 *
 * Example:
 *   <Placeholder label="Replace with image of tea gardens" className="h-64" />
 */
export default function Placeholder({
  label,
  className,
  rounded = "rounded-2xl",
}: {
  label: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-2 border border-dashed border-brand-300 bg-gradient-to-br from-brand-50 to-accent-50 p-4 text-center",
        rounded,
        className,
      )}
    >
      <ImageIcon className="h-7 w-7 text-brand-500/70" aria-hidden />
      <span className="max-w-[14rem] text-xs font-medium text-brand-700/80">{label}</span>
    </div>
  );
}
