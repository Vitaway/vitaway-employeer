import { EngagementStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: EngagementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    [EngagementStatus.ACTIVE]: "bg-green-100 text-green-800 border-green-200",
    [EngagementStatus.INACTIVE]: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[status],
        className
      )}
    >
      {status}
    </span>
  );
}
