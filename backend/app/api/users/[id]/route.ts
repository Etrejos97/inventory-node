import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validators/user";
import { jsonOk, jsonNoContent, notFound, fromZodError } from "@/lib/http";
import { toUserResponse } from "@/lib/mappers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { role: true } });
  if (!user) return notFound(`Usuario no encontrado: ${id}`);
  return jsonOk(toUserResponse(user));
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const parsed = userSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound(`Usuario no encontrado: ${id}`);

  let roleId = existing.roleId;
  if (data.roleId != null) {
    const role = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) return notFound(`Rol no encontrado: ${data.roleId}`);
    roleId = data.roleId;
  }

  // Igual que UserService.update en Java: password solo cambia si viene
  // no-null y no-blank; roleId solo si viene no-null; isActive conserva el
  // valor actual si no viene. Distinto del "changeme" del create.
  const password = data.password != null && data.password.trim() !== "" ? data.password : existing.password;
  const isActive = data.isActive ?? existing.isActive;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { username: data.username, password, fullName: data.fullName, email: data.email, roleId, isActive },
    include: { role: true },
  });
  return jsonOk(toUserResponse(user));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const exists = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!exists) return notFound(`Usuario no encontrado: ${id}`);

  await prisma.user.delete({ where: { id: Number(id) } });
  return jsonNoContent();
}
