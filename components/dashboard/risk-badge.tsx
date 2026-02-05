import { RiskCategory } from "@/types";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: RiskCategory;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const variants = {
    [RiskCategory.LOW]: "bg-green-100 text-green-800 border-green-200",
    [RiskCategory.MEDIUM]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [RiskCategory.HIGH]: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[risk],
        className
      )}
    >
      {risk}
    </span>
  );
}
