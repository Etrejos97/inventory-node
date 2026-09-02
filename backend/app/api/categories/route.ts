import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { catalogSchema } from "@/lib/validators/catalog";
import { jsonOk, jsonCreated, fromZodError, fromPrismaError } from "@/lib/http";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  return jsonOk(categories);
}

export async function POST(request: NextRequest) {
  const parsed = catalogSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const category = await prisma.category.create({ data: parsed.data });
    return jsonCreated(category);
  } catch (error) {
    return fromPrismaError(error, { duplicate: `Ya existe una categoría con nombre: ${parsed.data.name}` });
  }
}
