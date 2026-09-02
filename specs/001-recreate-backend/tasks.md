# 001 — Checklist de implementación

## Fase 0 — Setup metodológico
- [x] `docs/CONSTITUTION.md`
- [x] `specs/001-recreate-backend/{requirements,plan,tasks}.md`
- [x] `docs/DEUDA.md` inicial
- [x] `docs/decisiones/` — 3 ADRs (Prisma+SQLite, 404 real, shape de error 400)
- [x] `ESTADO.md` inicial
- [x] `CLAUDE.md` de proyecto (raíz)

## Fase 1 — Scaffold
- [x] `create-next-app` (TS, App Router, sin Tailwind, sin `src/`)
- [x] Reestructurado a `backend/` + `frontend/` (decisión de duplicar el
      frontend original, no solo re-apuntar el proxy — ver `ESTADO.md`)
- [x] Limpiar scaffold de UI por defecto (`page.tsx`, `layout.tsx`, css)
- [x] `frontend/` copiado del repo original tal cual
- [x] `git init` propio, rama `main`
- [ ] Primer commit

## Fase 2 — Prisma schema
- [x] 7 modelos, relaciones, `@map` a snake_case, `purchaseValue` como `Decimal`
- [x] `prisma migrate dev --name init`

## Fase 3 — Seed
- [x] `prisma/seed.ts` (15 items, guard incluido)
- [x] `prisma/seed-full.ts` (~30 items, 4 usuarios, opt-in)
- [x] Wireado en `package.json` (`prisma.seed`, `db:setup`, `db:seed-full`)

## Fase 4 — Infra compartida
- [x] `lib/prisma.ts`, `lib/cors.ts`, `proxy.ts` (Next.js 16 renombró `middleware.ts` a `proxy.ts` — ver `docs/decisiones/`)
- [x] `lib/http.ts` (respuestas + formateo de fechas estilo Jackson)
- [x] `lib/validators/*.ts` (Zod, uno por DTO)
- [x] `lib/mappers.ts` (`toItemResponse`, `toUserResponse`)

## Fase 5 — Andamiaje de agentes/hooks
- [x] `.claude/agents/contract-fidelity-reviewer.md`
- [x] `.claude/hooks/block_env_edits.py`
- [x] `.claude/hooks/trigger_contract_fidelity_review.py`
- [x] Wireado en `.claude/settings.json`
- [x] ~~`run_related_tests.py`~~ — excluido, ver `ESTADO.md` (sin testing por ahora)

## Fase 6 — Auth
- [x] `POST /api/auth/login`

## Fase 7 — Catálogos
- [x] CRUD `categories`
- [x] CRUD `statuses`
- [x] CRUD `responsibles` (con el quirk de `isActive` forzado a `true`)

## Fase 8 — Items
- [x] GET con filtros, GET/:id, POST, PUT, DELETE
- [x] Mapper aplanado + fechas + Decimal→Number

## Fase 9 — Users + Roles
- [x] CRUD completo, comportamiento exacto de `"changeme"` y de password/roleId en el update
- [x] `GET /api/users/roles`

## Fase 10 — Movements + Dashboard
- [x] `GET /api/movements`
- [x] `GET /api/dashboard`

## Fase 11 — Verificación manual + documentación final
- [x] `npm install` (bloqueado un rato por `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
      de Node contra el registry — ver `docs/decisiones/`)
- [x] `npm run db:setup`
- [x] Batería de `curl.exe` contra cada grupo: auth (3 casos), CRUD completo
      de items/categories/statuses/responsibles/users con sus quirks
      exactos (`changeme`, `isActive` forzado en responsables, password/rol
      preservados en el PUT de usuarios), filtros de items, movements
      vacío, dashboard, CORS con origen permitido/no permitido, 404 real
- [x] `npx tsc --noEmit` y `npm run lint` sin errores
- [x] `README.md`
- [x] `ESTADO.md` al día
- [x] Confirmar que `frontend/` levanta contra el backend nuevo — probado
      en navegador real: home pública, login (`admin/admin123`), dashboard
      admin y tabla de inventario, los 15 items con datos correctos

---

**Nota de alcance**: el plan aprobado originalmente incluía
`scripts/smoke-test.mjs` + `.github/workflows/backend-smoke.yml` (CI). Los
excluí a pedido explícito — este proyecto es la base para practicar testing
después, así que no meto tests ni CI todavía. Ver `docs/CONSTITUTION.md` §6.
