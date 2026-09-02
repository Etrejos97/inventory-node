import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { itemSchema } from "@/lib/validators/item";
import { jsonOk, jsonCreated, notFound, fromZodError, fromPrismaError } from "@/lib/http";
import { toItemResponse } from "@/lib/mappers";

const includeRelations = { category: true, status: true, responsible: true } as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const statusId = searchParams.get("statusId");
  const search = searchParams.get("search");

  const where: Prisma.ItemWhereInput = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (statusId) where.statusId = Number(statusId);
  if (search && search.trim() !== "") {
    where.OR = [
      { name: { contains: search } },
      { serialNumber: { contains: search } },
    ];
  }

  const items = await prisma.item.findMany({ where, include: includeRelations, orderBy: { id: "asc" } });
  return jsonOk(items.map(toItemResponse));
}

export async function POST(request: NextRequest) {
  const parsed = itemSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) return notFound(`Categoría no encontrada: ${data.categoryId}`);

  const status = await prisma.status.findUnique({ where: { id: data.statusId } });
  if (!status) return notFound(`Estado no encontrado: ${data.statusId}`);

  if (data.responsibleId != null) {
    const responsible = await prisma.responsible.findUnique({ where: { id: data.responsibleId } });
    if (!responsible) return notFound(`Responsable no encontrado: ${data.responsibleId}`);
  }

  try {
    const item = await prisma.item.create({
      data: {
        name: data.name,
        description: data.description,
        serialNumber: data.serialNumber,
        categoryId: data.categoryId,
        statusId: data.statusId,
        responsibleId: data.responsibleId ?? null,
        acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : null,
        location: data.location,
        purchaseValue: data.purchaseValue,
        observations: data.observations,
        stock: data.stock ?? 0,
        minStock: data.minStock ?? 0,
      },
      include: includeRelations,
    });
    return jsonCreated(toItemResponse(item));
  } catch (error) {
    return fromPrismaError(error, { duplicate: `Ya existe un ítem con número de serie: ${data.serialNumber}` });
  }
}
