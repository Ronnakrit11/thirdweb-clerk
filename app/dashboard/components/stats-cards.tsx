import prisma from "@/lib/db";
import { StatsCard } from "./stats-card";
import { formatCurrency } from "@/lib/utils";

async function getStats() {
  const [approvedQuotations, totalClients, totalServices] = await Promise.all([
    prisma.quotation.findMany({
      where: {
        status: "APPROVED",
      },
    }),
    prisma.client.count(),
    prisma.service.count(),
  ]);

  const totalQuotations = await prisma.quotation.count();
  const approvalRate = (approvedQuotations.length / totalQuotations) * 100;
  const totalRevenue = approvedQuotations.reduce((sum, quotation) => sum + quotation.total, 0);

  return {
    totalRevenue,
    totalClients,
    approvalRate,
    totalServices,
  };
}

export async function StatsCards() {
  const { totalRevenue, totalClients, approvalRate, totalServices } = await getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        description="From approved quotations"
      />
      <StatsCard
        title="Total Clients"
        value={totalClients.toString()}
        description="Active clients in the system"
      />
      <StatsCard
        title="Approval Rate"
        value={`${approvalRate.toFixed(1)}%`}
        description="Of all quotations"
      />
      <StatsCard
        title="Available Services"
        value={totalServices.toString()}
        description="Total services offered"
      />
    </div>
  );
}