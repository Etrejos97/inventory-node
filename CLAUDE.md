# inventory-node — instrucciones para agentes

Recreación del backend de `inventory-fullstack` con Node.js + Next.js,
manteniendo el mismo contrato de API. Los principios no negociables del
proyecto están en [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md) — leerlo
antes de tocar una regla marcada como no negociable ahí.

Estado activo de la sesión: [`ESTADO.md`](ESTADO.md) — leer al empezar,
reescribir al cerrar cada bloque de trabajo.

## Fuente de verdad del contrato

`C:\Dev\Pruebas PPI\inventory-fullstack\backend` (Spring Boot). Solo
lectura, nunca se toca. Cualquier duda sobre shape de request/response,
status codes o reglas de negocio se resuelve leyendo ese código, no
adivinando — y se deja constancia en `specs/001-recreate-backend/requirements.md`
o en `docs/DEUDA.md` si es una particularidad a replicar tal cual.

## Mapeo y búsqueda en el código

Este repo está indexado con `codebase-memory-mcp` (configurado en
`.mcp.json`, ver `~/.claude/notas/codebase-memory-mcp.md` para las trampas
conocidas de la herramienta). Para cualquier "¿dónde/cómo se usa X?", "¿qué
llama a Y?" o búsqueda de patrón en código y docs — usar `search_code`,
`search_graph`, `query_graph`, `trace_path` o `get_architecture` de ese MCP
en vez de `Grep`/`Read` por costumbre.

- Si el índice no refleja el estado actual, reindexar con
  `index_repository` en lugar de resignarse a grep.
- Delegar a un subagente no exime de esto — hay que decírselo explícito en
  su prompt.
- Excepción: la verificación final contra el archivo real antes de editar
  o de afirmar un hecho — el índice puede estar desactualizado.

## Estructura

- `backend/` — Next.js (App Router, TS), Prisma + SQLite, puerto 8080.
- `frontend/` — copia del frontend React original (Vite), sin cambios de
  lógica; su proxy ya apunta a `localhost:8080`.
- `specs/001-recreate-backend/` — requirements/plan/tasks de la recreación.
- `docs/decisiones/` — un archivo por decisión no obvia (ADR).

## Cómo correr

```
cd backend
npm install
npm run db:setup   # migrate + seed
npm run dev         # :8080
```

Frontend: `cd frontend && npm install && npm run dev` (:5173, proxy a :8080).

## Skills a usar según lo que se toque

| Al tocar... | Usar |
|---|---|
| `prisma/schema.prisma`, migraciones | `prisma-patterns`, `database-migrations` |
| Cualquier `route.ts` nuevo | `backend-patterns`, `api-design` |
| Config de Next.js / scripts | `nextjs-turbopack` |
| Cualquier archivo, antes de cerrar | `coding-standards` |
| Una decisión no obvia | `architecture-decision-records` |

## No-goals de esta primera vuelta

Sin tests, sin framework de testing, sin CI — es la base para practicar
testing después. Ver `docs/CONSTITUTION.md` §6.