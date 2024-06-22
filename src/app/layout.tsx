import { GoogleTagManager } from "@next/third-parties/google";
import { Poppins } from "next/font/google";
import { ReactNode } from "react";

import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme/theme.provider";

import "./globals.css";
import { ReduxProvider } from "@/contexts/redux/redux.provider";
import { ClientSideProvider } from "@/contexts/client/client.provider";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head></head>
      <body
        className={cn(
          "min-h-screen min-w-80 bg-background font-sans antialiased flex-1",
          fontSans.variable
        )}>
        <ThemeProvider>
          <ReduxProvider>
            <ClientSideProvider>
              {children}
            </ClientSideProvider>
          </ReduxProvider>
        </ThemeProvider>
        <Toaster />
      </body>
      {/* <GoogleTagManager gtmId="GTM-T3TJHR8B" /> */}
    </html>
  );
}
