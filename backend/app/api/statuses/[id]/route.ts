import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { catalogSchema } from "@/lib/validators/catalog";
import { jsonOk, jsonNoContent, notFound, fromZodError, fromPrismaError } from "@/lib/http";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const status = await prisma.status.findUnique({ where: { id: Number(id) } });
  if (!status) return notFound(`Estado no encontrado: ${id}`);
  return jsonOk(status);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const parsed = catalogSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);

  const exists = await prisma.status.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Estado no encontrado: ${id}`);

  try {
    const status = await prisma.status.update({ where: { id: Number(id) }, data: parsed.data });
    return jsonOk(status);
  } catch (error) {
    return fromPrismaError(error, { duplicate: `Ya existe un estado con nombre: ${parsed.data.name}` });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const exists = await prisma.status.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Estado no encontrado: ${id}`);

  try {
    await prisma.status.delete({ where: { id: Number(id) } });
    return jsonNoContent();
  } catch (error) {
    return fromPrismaError(error, {
      restrict: `No se puede eliminar el estado "${exists.name}": tiene ítems asociados.`,
    });
  }
}
