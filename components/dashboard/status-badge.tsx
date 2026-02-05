import { EngagementStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: EngagementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    [EngagementStatus.ACTIVE]: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
    [EngagementStatus.INACTIVE]: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[status],
        className
      )}
    >
      {status}
    </span>
  );
}
