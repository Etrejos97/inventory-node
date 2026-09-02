import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";
import { jsonOk, unauthorized, fromZodError } from "@/lib/http";

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username }, include: { role: true } });
  if (!user) return unauthorized("Credenciales inválidas");
  if (!user.isActive) return unauthorized("Usuario inactivo");
  if (user.password !== password) return unauthorized("Credenciales inválidas");

  return jsonOk({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email ?? "",
    role: user.role.name,
    isActive: user.isActive,
  });
}
