import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validators/user";
import { jsonOk, jsonCreated, notFound, fromZodError, fromPrismaError } from "@/lib/http";
import { toUserResponse } from "@/lib/mappers";

export async function GET() {
  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { id: "asc" } });
  return jsonOk(users.map(toUserResponse));
}

export async function POST(request: NextRequest) {
  const parsed = userSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;

  if (data.roleId != null) {
    const role = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) return notFound(`Rol no encontrado: ${data.roleId}`);
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        // "changeme" solo si password llega null (no si llega "") — igual que
        // UserService.create en Java, ver docs/DEUDA.md.
        password: data.password ?? "changeme",
        fullName: data.fullName,
        email: data.email,
        roleId: data.roleId as number,
        isActive: data.isActive ?? true,
      },
      include: { role: true },
    });
    return jsonCreated(toUserResponse(user));
  } catch (error) {
    return fromPrismaError(error, { duplicate: `Ya existe un usuario con username: ${data.username}` });
  }
}
