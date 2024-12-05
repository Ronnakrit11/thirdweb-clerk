'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardRoutes } from "./routes";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {dashboardRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === route.href
              ? "bg-muted text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
}