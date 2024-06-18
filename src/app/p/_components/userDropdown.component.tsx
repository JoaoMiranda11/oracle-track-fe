import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/auth.hook";

export function UserDropDown() {
  const { setTheme } = useTheme();
  const { signout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full">
          <Image
            src="/logo/logo_full.png"
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <div className="flex gap-4 mx-4">
          <Button
            onClick={() => setTheme("light")}
            variant="ghost"
            className="rounded border border-primary dark:border-transparent">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
          <Button
            onClick={() => setTheme("dark")}
            variant="ghost"
            className="rounded border border-transparent dark:border-primary">
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>

        <DropdownMenuItem onClick={signout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
