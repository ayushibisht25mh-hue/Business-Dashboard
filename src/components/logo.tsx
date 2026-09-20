import Link from "next/link";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  variant = "default",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "dark";
}) {
  const sizes = {
    sm: { icon: "h-7 w-7", iconInner: "h-3.5 w-3.5", text: "text-lg" },
    md: { icon: "h-9 w-9", iconInner: "h-4 w-4", text: "text-xl" },
    lg: { icon: "h-11 w-11", iconInner: "h-5 w-5", text: "text-2xl" },
  };

  const textColor =
    variant === "light"
      ? "text-white"
      : variant === "dark"
        ? "text-slate-900"
        : "text-slate-900";

  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <div
        className={cn(
          sizes[size].icon,
          "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/25 transition group-hover:shadow-brand-600/40 group-hover:scale-105"
        )}
      >
        <Scissors className={cn(sizes[size].iconInner, "text-white")} />
      </div>
      <span
        className={cn(
          sizes[size].text,
          "font-display font-bold tracking-tight",
          textColor
        )}
      >
        Preppy
      </span>
    </Link>
  );
}
