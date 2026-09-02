# 002 — Checklist

- [x] `specs/002-item-image-url/{requirements,plan,tasks}.md`
- [x] `imageUrl` en `prisma/schema.prisma`
- [x] Migración `add_item_image_url`
- [x] `imageUrl` en `lib/validators/item.ts`
- [x] `imageUrl` en `lib/mappers.ts` (`toItemResponse`)
- [x] `imageUrl` en `POST /api/items` y `PUT /api/items/:id`
- [x] `ItemForm.jsx` — campo de URL
- [x] `Home.jsx` (`ProductCard`) — imagen real con fallback (incluye
      `onError` para caer al emoji si la URL no carga)
- [x] `Cart.jsx` — imagen real con fallback (`onError`, subcomponente
      `CartItemThumb` para estado por-item)
- [x] `index.css` — reglas para que la `<img>` llene el contenedor
- [x] ADR en `docs/decisiones/`
- [x] `npx tsc --noEmit` y `npm run lint` sin errores
- [x] Verificación con curl (PUT con imageUrl, GET la devuelve)
- [x] Verificación visual en navegador (con imagen real, con URL rota
      cayendo al emoji, y sin imagen)

## Pendiente (fuera de este spec)

Poblar `imageUrl` en los 15 items del seed con fotos reales de cada
producto — ver `prisma/seed.ts` y el ADR. El campo y la UI ya funcionan;
falta cargar los datos.
