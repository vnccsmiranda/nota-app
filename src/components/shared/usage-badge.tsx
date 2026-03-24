interface UsageBadgeProps {
  current: number;
  limit: number;
  label: string;
}

export function UsageBadge({ current, limit, label }: UsageBadgeProps) {
  const isAtLimit = current >= limit;
  const percentage = limit === Infinity ? 0 : (current / limit) * 100;

  if (limit === Infinity) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={isAtLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
        {current}/{limit === Infinity ? "∞" : limit} {label}
      </span>
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit ? "bg-destructive" : percentage > 70 ? "bg-warning" : "bg-primary"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
