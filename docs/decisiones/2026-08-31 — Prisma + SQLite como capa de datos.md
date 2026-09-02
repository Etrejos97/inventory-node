---
tipo: adr
estado: aceptada
fecha: 2026-08-31
---

# Prisma + SQLite como capa de datos

## Contexto

El backend original usa H2 in-memory: cero infraestructura, la base se
recrea en cada arranque. Necesitaba un equivalente para Node/Next que no
metiera Docker ni un servidor de base de datos aparte.

## Decisión

Prisma como ORM, SQLite como motor, archivo local en `prisma/dev.db`
(gitignored). `npm run db:setup` corre la migración inicial y siembra los
datos — un solo comando, sin servicios externos que levantar.

## Alternativas descartadas

- **Postgres vía Docker Compose**: más parecido a un entorno productivo
  real, pero agrega Docker como requisito para algo que no lo necesita
  todavía. Si el proyecto crece hacia algo más serio, migro ahí.
- **H2 vía un puente Node-Java**: no existe una forma razonable de correr
  H2 desde Node sin meter una JVM de por medio — descartado de entrada.

## Consecuencias

SQLite no soporta `mode: 'insensitive'` en Prisma para filtros de texto —
el filtro `search` de `/api/items` depende del comportamiento nativo de
`LIKE` en SQLite (case-insensitive para ASCII, no para acentos), que difiere
un poco del `LOWER()` explícito que usaba el original en H2. Diferencia
menor, no bloqueante para el alcance actual.
