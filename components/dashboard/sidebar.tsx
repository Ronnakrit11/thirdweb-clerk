'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NavLinks } from "./nav-links";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <NavLinks />
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="flex items-center gap-2 p-4">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <Sidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}