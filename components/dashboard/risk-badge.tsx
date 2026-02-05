import { RiskCategory } from "@/types";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: RiskCategory;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const variants = {
    [RiskCategory.LOW]: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
    [RiskCategory.MEDIUM]: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    [RiskCategory.HIGH]: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[risk],
        className
      )}
    >
      {risk}
    </span>
  );
}
