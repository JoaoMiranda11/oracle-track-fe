"use client"

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export function ClientSideProvider({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
