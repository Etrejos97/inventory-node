import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type { ZodError } from "zod";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Formatea igual que Jackson con `spring.jackson.date-format=yyyy-MM-dd'T'HH:mm:ss`
 * (sin milisegundos ni `Z`) — usa componentes locales, como LocalDateTime.now() en Java.
 */
export function formatDateTime(date: Date | null | undefined): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
}

/**
 * Formatea un LocalDate ("yyyy-MM-dd"). Usa componentes UTC a propósito: las fechas
 * puras se guardan como medianoche UTC (`new Date("yyyy-MM-dd")`), así que leer con
 * getters UTC devuelve el mismo día que se guardó sin importar la zona horaria del
 * server — leer con getters locales correría el día en zonas negativas (ej. Colombia).
 */
export function formatDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  const y = date.getUTCFullYear();
  const mo = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  return `${y}-${mo}-${d}`;
}

export function decimalToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonNoContent() {
  return new NextResponse(null, { status: 204 });
}

export function notFound(message: string) {
  return NextResponse.json({ message }, { status: 404 });
}

export function unauthorized(message: string) {
  return NextResponse.json({ message }, { status: 401 });
}

export function badRequest(message: string, errors?: { field: string; message: string }[]) {
  return NextResponse.json({ message, ...(errors ? { errors } : {}) }, { status: 400 });
}

export function fromZodError(error: ZodError, message = "Solicitud inválida") {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join(".") || "(root)",
    message: issue.message,
  }));
  return badRequest(message, errors);
}

export function conflict(message: string) {
  return NextResponse.json({ message }, { status: 409 });
}

/**
 * Traduce P2002 (unique constraint) y P2003 (FK restringida en un delete)
 * a un 409 con mensaje claro. El original Java tampoco maneja estas
 * excepciones (no hay @ExceptionHandler en el proyecto) — cualquier otro
 * código de PrismaClientKnownRequestError, o cualquier otro tipo de error,
 * se relanza tal cual y sigue cayendo en el 500 sin manejar de siempre.
 * Ver docs/decisiones/2026-09-02 — 409 en duplicados y en deletes
 * bloqueados por FK.md.
 */
export function fromPrismaError(error: unknown, messages: { duplicate?: string; restrict?: string } = {}) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return conflict(messages.duplicate ?? "Ya existe un registro con ese valor.");
    }
    if (error.code === "P2003") {
      return conflict(messages.restrict ?? "No se puede eliminar: hay registros asociados.");
    }
  }
  throw error;
}
