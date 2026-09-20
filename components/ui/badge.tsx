import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StarRating({
  rating,
  light = false,
  size = "md",
  showAverageLabel = false,
}: {
  rating: number;
  light?: boolean;
  size?: "sm" | "md";
  showAverageLabel?: boolean;
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  if (light) {
    return (
      <div className="flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
        <Star className={cn(starSize, "fill-amber-400 text-amber-400")} />
        <span className={cn(textSize, "font-bold text-slate-900")}>
          {rating.toFixed(1)}
        </span>
        {showAverageLabel && (
          <span className="text-xs font-medium text-slate-500">avg</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-1.5 py-0.5">
        <Star className={cn(starSize, "fill-amber-400 text-amber-400")} />
        <span className={cn(textSize, "font-bold text-amber-700")}>
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <Card className="group relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-brand-50 to-transparent opacity-60 transition group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className={cn("rounded-xl p-2", color)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        {sub && <p className="mt-1 text-xs font-medium text-amber-600">{sub}</p>}
      </div>
    </Card>
  );
}
