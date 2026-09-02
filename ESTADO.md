# Estado activo

**Última actualización**: 2026-09-02.

## Qué hice

Recreé el backend de `inventory-fullstack` (Spring Boot) con Node.js +
Next.js + Prisma/SQLite, siguiendo `specs/001-recreate-backend/`. Duplico
también el frontend original en `frontend/` (decisión explícita, no solo
re-apuntar su proxy), así el proyecto queda independiente del repo
original — que no toco para nada.

Los 8 grupos de endpoints están completos y verificados contra el
contrato: auth, items (con filtros), categorías, estados, responsables,
usuarios+roles, movements y dashboard — incluidas las particularidades
heredadas documentadas en `docs/DEUDA.md` (password expuesto, `"changeme"`
solo en `null`, `isActive` forzado a `true` en el PUT de responsables,
`MovementHistory` sin escritura).

Indexé el repo con `codebase-memory-mcp` (565 nodos / 1146 aristas) y dejé
la regla de usarlo para mapear y revisar archivos en `CLAUDE.md`.

Hice el primer commit y publiqué el repo en GitHub, público, bajo mi
cuenta personal: [github.com/Etrejos97/inventory-node](https://github.com/Etrejos97/inventory-node).
Antes de ese commit revisé `.gitignore` para que `node_modules/`, `.next/`,
`prisma/dev.db` y `.env` quedaran fuera del repo (`.env.example` sí queda,
como plantilla). También completé el `README.md` (stack, estructura, tabla
de los 19 endpoints) y agregué `docs/arquitectura.md` con el diagrama de
capas real, extraído del grafo indexado.

Verifiqué contra el código (no contra lo que decía la documentación) que
los 15 puntos de escritura del backend tocan un solo modelo Prisma por
request, así que ninguno necesita `prisma.$transaction` hoy — actualicé
`docs/DEUDA.md` con esa comprobación.

Cubrí el 500 crudo que salía al mandar un username/nombre/número de serie
duplicado, o al borrar una categoría/estado con items asociados: agregué
`conflict()` y `fromPrismaError()` en `lib/http.ts` y envolví los 10
puntos de escritura afectados (`users`, `categories`, `statuses`, `items`)
en try/catch. Verifiqué el alcance exacto contra el schema real
(`prisma/schema.prisma` + la migración aplicada) y contra el Java
original (`UserService`, `CategoryService` — tampoco pre-validan
duplicados, y no hay `@ExceptionHandler` en todo el proyecto), así que es
una desviación consciente del original, documentada en el ADR
`docs/decisiones/2026-09-02 — 409 en duplicados y en deletes bloqueados por FK.md`.
Probé los tres casos con el server real levantado (duplicado, delete
bloqueado, happy path) antes de dar el cambio por bueno.

## Próximos pasos

1. Testing: lo dejo en pausa hasta que el profesor indique el enfoque a
   seguir. Cuando arranque: instalar el framework que corresponda,
   actualizar `docs/CONSTITUTION.md` §6 y `docs/DEUDA.md` (la sección "Sin
   tests, sin CI" queda obsoleta ahí).
2. Si en algún momento quiero correr frontend+backend juntos con Docker o
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
- **Repo publicado bajo cuenta personal** (`Etrejos97`), no la de trabajo
  (`EtrejosMeper`/MEPER) — el `git config` global de esta máquina apunta a
  la cuenta de trabajo, así que dejé el autor configurado en local
  (`git config --local`) solo para este repo, sin tocar el global.

## Estado git

Repo con remoto en GitHub (`origin` → `github.com/Etrejos97/inventory-node`,
público), rama `main`.
