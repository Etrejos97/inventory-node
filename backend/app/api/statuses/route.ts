import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { catalogSchema } from "@/lib/validators/catalog";
import { jsonOk, jsonCreated, fromZodError } from "@/lib/http";

export async function GET() {
  const statuses = await prisma.status.findMany({ orderBy: { id: "asc" } });
  return jsonOk(statuses);
}

export async function POST(request: NextRequest) {
  const parsed = catalogSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);

  const status = await prisma.status.create({ data: parsed.data });
  return jsonCreated(status);
}
