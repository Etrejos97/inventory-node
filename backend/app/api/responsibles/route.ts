import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { responsibleSchema } from "@/lib/validators/responsible";
import { jsonOk, jsonCreated, fromZodError } from "@/lib/http";

export async function GET() {
  const responsibles = await prisma.responsible.findMany({ orderBy: { id: "asc" } });
  return jsonOk(responsibles);
}

export async function POST(request: NextRequest) {
  const parsed = responsibleSchema.safeParse(await request.json());
  if (!parsed.success) return fromZodError(parsed.error);
  const { isActive, ...rest } = parsed.data;

  const responsible = await prisma.responsible.create({
    data: { ...rest, isActive: isActive ?? true },
  });
  return jsonCreated(responsible);
}
