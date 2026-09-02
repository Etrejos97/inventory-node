import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { catalogSchema } from "@/lib/validators/catalog";
import { jsonOk, jsonNoContent, notFound, fromZodError, fromPrismaError } from "@/lib/http";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) return notFound(`Categoría no encontrada: ${id}`);
  return jsonOk(category);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const parsed = catalogSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);

  const exists = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Categoría no encontrada: ${id}`);

  try {
    const category = await prisma.category.update({ where: { id: Number(id) }, data: parsed.data });
    return jsonOk(category);
  } catch (error) {
    return fromPrismaError(error, { duplicate: `Ya existe una categoría con nombre: ${parsed.data.name}` });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const exists = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Categoría no encontrada: ${id}`);

  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    return jsonNoContent();
  } catch (error) {
    return fromPrismaError(error, {
      restrict: `No se puede eliminar la categoría "${exists.name}": tiene ítems asociados.`,
    });
  }
}
