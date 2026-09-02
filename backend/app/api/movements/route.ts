import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk, formatDateTime } from "@/lib/http";

// En la práctica siempre devuelve [] — nada escribe en MovementHistory,
// ver docs/DEUDA.md. Se implementa la lectura completa igual, tal como
// existe (sin uso) en el backend original.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  const movements = await prisma.movementHistory.findMany({
    where: itemId ? { itemId: Number(itemId) } : undefined,
    include: { item: true },
    orderBy: itemId ? { createdAt: "desc" } : { id: "asc" },
  });

  return jsonOk(
    movements.map((m) => ({
      id: m.id,
      itemId: m.itemId,
      itemName: m.item.name,
      action: m.action,
      fieldName: m.fieldName,
      oldValue: m.oldValue,
      newValue: m.newValue,
      description: m.description,
      createdAt: formatDateTime(m.createdAt),
    })),
  );
}
