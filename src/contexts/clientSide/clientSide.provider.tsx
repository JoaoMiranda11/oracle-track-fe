"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { NotificationProvider } from "./notification/notification.context";

export function ClientSideProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </NotificationProvider>
  );
}
