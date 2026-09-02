# 002 — Imagen real por item

## Fuente de verdad

Ninguna: es una feature nueva, no una recreación de contrato. Verifiqué
contra `Item.java` (`C:\Dev\Pruebas PPI\inventory-fullstack\backend`) que
el original nunca tuvo campo de imagen — así que esto extiende el
contrato, no lo corrige. Ver el ADR correspondiente en `docs/decisiones/`.

## Alcance

`imageUrl` — string opcional, sin validación de formato (mismo trato que
`location`/`observations`: texto libre, sin reglas). El usuario pega la
URL de una imagen ya alojada en cualquier lado; no hay upload de
archivos ni storage.

## Cambios de contrato

- `POST`/`PUT /api/items`: el body acepta `imageUrl` (opcional, nullable).
- Respuesta de items (`GET /api/items`, `GET /api/items/:id`, `POST`,
  `PUT`): incluye `imageUrl` en el shape aplanado, junto a `observations`.
- En `POST` (creación), sin `imageUrl` en el body el campo queda `null`.
  En `PUT` (edición), omitir `imageUrl` del body conserva el valor
  anterior — mismo comportamiento que ya tienen `location`/`observations`
  ante Prisma, no algo nuevo que introduce este campo. No rompe ningún
  cliente que ya mande el body actual.

## Frontend

- `ItemForm`: campo de texto para pegar la URL.
- `ProductCard` (home pública) y el carrito: si el item tiene `imageUrl`,
  se muestra la imagen real; si no, se mantiene el emoji genérico actual
  como fallback.
- La tabla de admin (`ItemList`) no cambia — no tiene columna de imagen
  hoy y no se pidió agregarla ahí.

## Fuera de alcance

Upload de archivos, storage de imágenes, validación de que la URL
apunte a una imagen real, redimensionado/optimización.
