import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/utils/text.utils";

export function AsideOption({
  children,
  href,
  tooltip,
  selected,
}: {
  selected?: boolean;
  href: string;
  tooltip: string;
  children: ReactNode;
}) {
  if (!selected) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white md:h-8 md:w-8">
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {capitalizeFirstLetter(tooltip)}
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary-theme transition-colors md:h-8 md:w-8">
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
