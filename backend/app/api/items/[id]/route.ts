import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { itemSchema } from "@/lib/validators/item";
import { jsonOk, jsonNoContent, notFound, fromZodError } from "@/lib/http";
import { toItemResponse } from "@/lib/mappers";

const includeRelations = { category: true, status: true, responsible: true } as const;

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id: Number(id) }, include: includeRelations });
  if (!item) return notFound(`Item no encontrado: ${id}`);
  return jsonOk(toItemResponse(item));
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const parsed = itemSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;

  const exists = await prisma.item.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Item no encontrado: ${id}`);

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) return notFound(`Categoría no encontrada: ${data.categoryId}`);

  const status = await prisma.status.findUnique({ where: { id: data.statusId } });
  if (!status) return notFound(`Estado no encontrado: ${data.statusId}`);

  if (data.responsibleId != null) {
    const responsible = await prisma.responsible.findUnique({ where: { id: data.responsibleId } });
    if (!responsible) return notFound(`Responsable no encontrado: ${data.responsibleId}`);
  }

  const item = await prisma.item.update({
    where: { id: Number(id) },
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
  return jsonOk(toItemResponse(item));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const exists = await prisma.item.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Item no encontrado: ${id}`);

  await prisma.item.delete({ where: { id: Number(id) } });
  return jsonNoContent();
}
