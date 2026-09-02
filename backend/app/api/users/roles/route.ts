import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const roles = await prisma.role.findMany({ orderBy: { id: "asc" } });
  return jsonOk(roles);
}
