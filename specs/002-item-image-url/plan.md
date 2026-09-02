# 002 — Plan

Capas a tocar, en orden (cada una depende de la anterior):

1. **Schema** — `imageUrl String? @map("image_url")` en el modelo `Item`
   (`backend/prisma/schema.prisma`).
2. **Migración** — `npx prisma migrate dev --name add_item_image_url`,
   aditiva (columna nullable), no requiere resetear la base ya sembrada.
3. **Validador** — `imageUrl` opcional en `itemSchema`
   (`backend/lib/validators/item.ts`).
4. **Mapper** — `imageUrl` en `toItemResponse`
   (`backend/lib/mappers.ts`).
5. **Route handlers** — `imageUrl` en el payload de `create`/`update` de
   `POST /api/items` y `PUT /api/items/:id`.
6. **Frontend** — `ItemForm` (campo nuevo), `ProductCard` y `Cart`
   (imagen real con fallback al emoji), CSS para que la `<img>` llene el
   contenedor existente.

## ADR

`docs/decisiones/2026-09-02 — imageUrl opcional en Item.md`.
