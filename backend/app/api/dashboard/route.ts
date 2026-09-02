import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

// Shape verificado línea por línea contra DashboardResponse.java.
export async function GET() {
  const items = await prisma.item.findMany({ include: { status: true } });

  const totalItems = items.length;
  const availableItems = items.filter((i) => i.status.name === "Disponible").length;
  const inUseItems = items.filter((i) => i.status.name === "En uso").length;
  const maintenanceItems = items.filter((i) => i.status.name === "En mantenimiento").length;
  const retiredItems = items.filter((i) => i.status.name === "Dado de baja").length;
  const totalValue = items.reduce((sum, i) => sum + (i.purchaseValue ? Number(i.purchaseValue) : 0), 0);

  const [totalCategories, totalStatuses, totalResponsibles, totalUsers] = await Promise.all([
    prisma.category.count(),
    prisma.status.count(),
    prisma.responsible.count(),
    prisma.user.count(),
  ]);

  return jsonOk({
    totalItems,
    availableItems,
    inUseItems,
    maintenanceItems,
    retiredItems,
    totalCategories,
    totalStatuses,
    totalResponsibles,
    totalUsers,
    totalValue,
  });
}
