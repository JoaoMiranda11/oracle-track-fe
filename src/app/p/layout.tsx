"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { PanelLeft, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { dashBoardRoute, dashboardRoutes } from "@/app.routes";

import { capitalizeFirstLetter } from "@/utils/text.utils";
import { cn } from "@/lib/utils";
import { removePath } from "@/utils/path.utils";
import { NavigateIcon } from "./_components/navigateIcon.component";
import { AsideOption } from "./_components/asideOption.component";
import { UserDropDown } from "./_components/userDropdown.component";

const navigateItens = [
  {
    title: "dashboard",
    href: "/p",
  },
  ...dashboardRoutes,
];

function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex w-full flex-col bg-background max-w-[1280px]",
        className
      )}>
      {children}
    </main>
  );
}

export default function LayoutAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const pathBreadCrumb = pathname
    .split("/")
    .filter((r) => r !== "")
    .map((route) => {
      const routeName =
        `/${route}` === dashBoardRoute.href ? dashBoardRoute.title : route;
      return {
        name: capitalizeFirstLetter(routeName),
        href: removePath(pathname, route),
      };
    });

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col bg-primary-theme sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
            <Image
              src="/logo/logo_clean.png"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden"
            />
          </Link>
          {navigateItens.map((item, i) => (
            <AsideOption
              selected={item.href === pathname}
              key={`aside_item_${i}`}
              tooltip={item.title}
              href={item.href}>
              <NavigateIcon routeName={item.title} />
            </AsideOption>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <AsideOption
            selected={"/p/settings" === pathname}
            key="aside_item_settings"
            tooltip={"settings"}
            href="/p/settings">
            <NavigateIcon routeName={"settings"} />
          </AsideOption>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col items-center justify-center sm:gap-4 sm:py-4 sm:pl-14">
        <header className="max-w-[1280px] w-full sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-8 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                  <Image
                    src="/logo/logo_clean.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden"
                  />
                </Link>
                {navigateItens.map((item, i) => (
                  <Link
                    key={`navigatoin_item_sider_${i}`}
                    href={item.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    {item.href === pathname && (
                      <span className="bg-primary-theme rounded-full w-2 h-2" />
                    )}
                    <NavigateIcon routeName={item.title} />
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <NavigateIcon routeName={"settings"} />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {pathBreadCrumb.map((route, i) => {
                const showSeparator = i !== (pathBreadCrumb?.length ?? 0) - 1;
                return (
                  <div
                    className="flex justify-center items-center gap-2"
                    key={`bread_crumb_item_${i}`}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={route.href}>{route.name}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {showSeparator && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <UserDropDown />
        </header>
        <main className="max-w-[1280px] flex-1 flex items-start gap-4">
          {children}
        </main>
      </div>
    </>
  );
}
