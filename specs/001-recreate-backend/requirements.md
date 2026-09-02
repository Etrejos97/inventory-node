# 001 — Recrear el backend en Node/Next

## Fuente de verdad

`C:\Dev\Pruebas PPI\inventory-fullstack\backend` (Spring Boot 3.4, H2
in-memory). Cualquier duda sobre el contrato se resuelve leyendo ese código,
no adivinando. Solo lectura — nunca lo toco.

## Entidades

| Entidad | Campos | Constraints |
|---|---|---|
| Role | id, name, description | name único, not null |
| User | id, username, password, fullName, email, role, isActive, lastLogin | username único; password/fullName/role not null; isActive default true; lastLogin nunca se setea |
| Category | id, name, description | name único, not null |
| Status | id, name, description | name único, not null |
| Responsible | id, fullName, position, email, phone, isActive | fullName not null; isActive default true |
| Item | id, name, description, serialNumber, category, status, responsible, acquisitionDate, location, purchaseValue, observations, stock, minStock, createdAt, updatedAt | name/category/status not null; serialNumber único y nullable; responsible opcional; stock/minStock default 0; createdAt/updatedAt automáticos |
| MovementHistory | id, item, action, fieldName, oldValue, newValue, description, createdAt | item/action not null; **nada escribe acá nunca** (ver `docs/DEUDA.md`) |

## Endpoints

Todos bajo `/api`, JSON, sin auth por token (solo `POST /api/auth/login`
valida contra la tabla `users`).

### `POST /api/auth/login`
Body `{username, password}`. 401 + `{message}` si no existe el usuario, si
está inactivo, o si el password no coincide (comparación de texto plano).
200 + `{id, username, fullName, email, role, isActive}` si es correcto
(`email` es `""` si es null; `role` es el nombre del rol, no un objeto).

### `/api/items`
- `GET` — filtros opcionales `categoryId`, `statusId`, `search` (LIKE
  case-insensitive sobre `name` y `serialNumber`). Sin filtros trae todo.
  Respuesta: array de `{id, name, description, serialNumber, categoryName,
  categoryId, statusName, statusId, responsibleName, responsibleId,
  acquisitionDate, location, purchaseValue, observations, stock, minStock,
  createdAt, updatedAt}` — shape aplanado, no anidado.
- `GET /:id` — mismo shape. 404 si no existe.
- `POST` — body `{name, description, serialNumber, categoryId, statusId,
  responsibleId, acquisitionDate, location, purchaseValue, observations,
  stock, minStock}`. `name`/`categoryId`/`statusId` requeridos. 404 si
  category/status/responsible no existen. `stock`/`minStock` null → 0.
  201 + item creado.
- `PUT /:id` — mismo body y reglas, reemplaza todos los campos. 200.
- `DELETE /:id` — 204.

### `/api/categories` y `/api/statuses` (idénticos)
- `GET` / `GET /:id` — objeto crudo `{id, name, description}`.
- `POST` / `PUT /:id` — body `{name, description}`, `name` requerido.
- `DELETE /:id` — 204.

### `/api/responsibles`
- `GET` / `GET /:id` — `{id, fullName, position, email, phone, isActive}`.
- `POST` / `PUT /:id` — body `{fullName, position, email, phone, isActive}`.
  `fullName` requerido. `isActive` **siempre** se fuerza a `true` si no
  viene en el body — en el `PUT` también, no conserva el valor anterior.
- `DELETE /:id` — 204.

### `/api/users`
- `GET` / `GET /:id` — entidad completa: `{id, username, password,
  fullName, email, role: {id, name, description}, isActive, lastLogin}`.
  Expone `password` en texto plano a propósito (ver `docs/DEUDA.md`).
- `POST` — body `{username, password, fullName, email, roleId, isActive}`.
  `username`/`fullName` requeridos. `password` → `"changeme"` solo si
  llega `null`/ausente (no si llega `""`). 404 si `roleId` no existe.
- `PUT /:id` — mismo body. `password` solo cambia si viene no-null y
  no-blank. `roleId` solo cambia si viene no-null (si no, conserva el rol
  actual). `isActive` conserva el valor actual si no viene.
- `DELETE /:id` — 204.
- `GET /api/users/roles` — array de `{id, name, description}`.

### `GET /api/movements`
Query opcional `itemId`. Con `itemId`, filtra y ordena por `createdAt` desc;
sin él, sin orden explícito. Shape: `{id, itemId, itemName, action,
fieldName, oldValue, newValue, description, createdAt}`. Siempre devuelve
`[]` en la práctica — ver `docs/DEUDA.md`.

### `GET /api/dashboard`
`{totalItems, availableItems, inUseItems, maintenanceItems, retiredItems,
totalCategories, totalStatuses, totalResponsibles, totalUsers, totalValue}`
— verificado campo por campo contra `DashboardResponse.java`. Los conteos
por estado comparan `status.name` exactamente contra los strings
`"Disponible"`, `"En uso"`, `"En mantenimiento"`, `"Dado de baja"`.

## No funcionales

- **Fechas**: `LocalDateTime` → `"yyyy-MM-ddTHH:mm:ss"` (sin milisegundos
  ni `Z`). `LocalDate` → `"yyyy-MM-dd"`. Ver `lib/http.ts`.
- **CORS**: orígenes `http://localhost:5173` y `:3000`, métodos
  `GET,POST,PUT,DELETE,PATCH,OPTIONS`, todos los headers, `credentials: true`.
- **Puerto**: 8080, igual que el original (`server.port=8080` en
  `application.properties`).
- **Seed**: `npm run db:setup` siembra 2 roles, 1 usuario
  (`admin/admin123`), 4 estados, 7 categorías, 5 responsables, 15 items —
  igual que `DataSeeder.java`. `npm run db:seed-full` siembra el dataset
  más grande (4 usuarios, ~30 items) igual que `SeedDatabase.java`, opt-in.

## Desviaciones deliberadas

Ver `docs/decisiones/`: 404 real en vez del 500 no intencional del
original, y shape propio para errores 400 de validación.

## Fuera de alcance de esta primera vuelta

Tests, framework de testing, CI — ver `docs/CONSTITUTION.md` §6 y
`ESTADO.md`.
