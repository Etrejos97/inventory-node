# 001 — Plan técnico

## Stack

Next.js 16 (App Router, TypeScript, sin Tailwind — es un backend puro, sin
páginas), Prisma + SQLite, Zod para validación. Puerto 8080.

## Estructura

```
backend/
├── app/api/**/route.ts   # un grupo de rutas por recurso
├── lib/
│   ├── prisma.ts          # singleton PrismaClient
│   ├── http.ts             # respuestas + formateo de fechas estilo Jackson
│   ├── cors.ts              # orígenes/métodos permitidos
│   ├── mappers.ts            # toItemResponse, toUserResponse
│   └── validators/*.ts        # un schema Zod por DTO
├── proxy.ts                     # CORS centralizado en /api/** (Next 16 renombró middleware.ts)
└── prisma/{schema.prisma,seed.ts,seed-full.ts}
```

## Mapeo Prisma ↔ JPA

1:1 — ver `prisma/schema.prisma` y la tabla de entidades en
`requirements.md`. Nombres de columna con `@map` para que coincidan con
las columnas `snake_case` del original (no que importe para SQLite propio,
pero mantiene el schema legible frente al original).

## Mappers de respuesta

Centralizados en `lib/mappers.ts` — equivalentes a los `toResponse()` de
los servicios Java. Cada route handler los importa en vez de armar el
shape a mano, para que un cambio de contrato se edite en un solo lugar.

## Validación

Un schema Zod por DTO en `lib/validators/`, espejando las anotaciones
`@NotBlank`/`@NotNull` del original. `fromZodError` en `lib/http.ts`
convierte los issues de Zod al shape de error 400 acordado en
`docs/decisiones/`.

## CORS

`proxy.ts` en la raíz, con matcher `/api/:path*` — una sola
definición para todo el árbol de rutas, igual que el `CorsFilter` global
de Spring. Responde el preflight `OPTIONS` directamente.

## Seed

`prisma/seed.ts` (dataset chico, guard "si ya hay roles no reseedea") va
wireado a `prisma db seed` vía `package.json`. `prisma/seed-full.ts`
(dataset grande) es un script aparte, corrido a mano con
`npm run db:seed-full`.

## Fuera de alcance de esta vuelta

Tests, CI, smoke tests scripteados — excluidos a pedido explícito (ver
`ESTADO.md`). El `.claude/agents/contract-fidelity-reviewer.md` sí entra:
es revisión de código, no testing.
