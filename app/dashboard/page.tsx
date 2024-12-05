import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard. Select an option from the navigation menu to get started.
      </p>
    </div>
  );
}