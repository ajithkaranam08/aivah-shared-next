import { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipInputProps {
  tooltipText?: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
  className?: string;
}

export function TooltipInput({
  tooltipText,
  children,
  variant,
  onClick,
  className,
}: TooltipInputProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={"icon"}
          type="button"
          variant={variant}
          className={cn("cursor-pointer rounded-full", className)}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="text-sm">{tooltipText}</span>
      </TooltipContent>
    </Tooltip>
  );
}
