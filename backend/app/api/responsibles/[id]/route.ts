import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { responsibleSchema } from "@/lib/validators/responsible";
import { jsonOk, jsonNoContent, notFound, fromZodError } from "@/lib/http";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const responsible = await prisma.responsible.findUnique({ where: { id: Number(id) } });
  if (!responsible) return notFound(`Responsable no encontrado: ${id}`);
  return jsonOk(responsible);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const parsed = responsibleSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);

  const exists = await prisma.responsible.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Responsable no encontrado: ${id}`);

  // Igual que ResponsibleController.update en Java: si isActive no viene, se
  // fuerza a true — no conserva el valor anterior (a diferencia de User).
  const { isActive, ...rest } = parsed.data;
  const responsible = await prisma.responsible.update({
    where: { id: Number(id) },
    data: { ...rest, isActive: isActive ?? true },
  });
  return jsonOk(responsible);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const exists = await prisma.responsible.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Responsable no encontrado: ${id}`);

  await prisma.responsible.delete({ where: { id: Number(id) } });
  return jsonNoContent();
}
