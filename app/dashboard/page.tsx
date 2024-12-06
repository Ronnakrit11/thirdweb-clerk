import { Suspense } from "react";
import { StatsCards } from "./components/stats-cards";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's a summary of your business metrics.
        </p>
      </div>

      <Suspense 
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
        }
      >
        <StatsCards />
      </Suspense>
    </div>
  );
}