# Estado activo

**Última actualización**: 2026-08-31.

## Qué hice

Recreé el backend de `inventory-fullstack` (Spring Boot) con Node.js +
Next.js + Prisma/SQLite, siguiendo `specs/001-recreate-backend/`. Duplicué
también el frontend original en `frontend/` (decisión explícita, no solo
re-apuntar su proxy), así el proyecto queda independiente del repo
original — que no toqué para nada.

Los 8 grupos de endpoints están completos y verificados contra el
contrato: auth, items (con filtros), categorías, estados, responsables,
usuarios+roles, movements y dashboard — incluidas las particularidades
heredadas documentadas en `docs/DEUDA.md` (password expuesto, `"changeme"`
solo en `null`, `isActive` forzado a `true` en el PUT de responsables,
`MovementHistory` sin escritura).

Verificación hecha: batería completa de `curl.exe` por endpoint, `tsc
--noEmit` y `npm run lint` sin errores, y una pasada real en el navegador
(Playwright) contra el frontend duplicado — login con `admin/admin123`,
dashboard admin, tabla de inventario con los 15 items del seed, todo
correcto.

## Próximos pasos

1. Primer commit (todavía no lo hice — no se pidió explícitamente).
2. Cuando arranque la práctica de testing sobre este proyecto: instalar
   el framework que corresponda, actualizar `docs/CONSTITUTION.md` §6 y
   `docs/DEUDA.md` (la sección "Sin tests, sin CI" queda obsoleta ahí).
3. Si en algún momento quiero correr frontend+backend juntos con Docker o
   desplegarlos, revisar `docs/decisiones/` antes de tocar la capa de
   datos (Prisma+SQLite) o el manejo de errores (404 real, shape propio).

## Bloqueos

Ninguno.

## Decisiones tomadas en esta sesión (fuera del plan original aprobado)

- **Duplicar el frontend**, no solo re-apuntar su proxy — pedido explícito.
- **Sin tests, sin CI en esta vuelta** — pedido explícito, el proyecto es
  la base para practicar testing después. Por eso `scripts/smoke-test.mjs`
  y `.github/workflows/backend-smoke.yml` del plan original quedaron
  fuera, igual que el hook `run_related_tests.py`.
- **Carpeta raíz renombrada** de `inventory-backend-node` a `inventory-node`
  (con `backend/` y `frontend/` adentro), porque el alcance dejó de ser
  "solo backend".
- **`proxy.ts` en vez de `middleware.ts`** — Next.js 16 renombró la
  convención, ver `docs/decisiones/`.
- **`NODE_EXTRA_CA_CERTS`** hizo falta para que `npm install` funcionara en
  esta máquina — ver `docs/decisiones/` y `~/.claude/notas/entorno-windows.md`.
- **`npm audit fix`** aplicado en `frontend/` (6 vulnerabilidades, todas
  resueltas con bumps no destructivos) — es la copia, no el original, así
  que no hay problema en mantenerla al día.

## Estado git

Repo propio (`git init`, rama `main`), sin commits todavía.
