---
tipo: adr
estado: aceptada
fecha: 2026-09-02
---

# 409 en duplicados y en deletes bloqueados por FK

## Contexto

Ni el backend Java original ni esta recreación manejan las excepciones de
integridad de la base de datos. En Java, `UserService` y `CategoryService`
no llaman a `existsByUsername`/`existsByName` antes de `save`, y no hay
ningún `@ExceptionHandler`/`@ControllerAdvice` en todo el proyecto — una
violación de unicidad (username, nombre de categoría/estado, número de
serie de item) o una FK restringida al borrar (categoría o estado con
items asociados) cae en el 500 genérico de Spring por defecto. Esta
recreación, al no tener manejo tampoco, se comportaba igual: Prisma lanza
`PrismaClientKnownRequestError` (P2002 en duplicados, P2003 al borrar
`Category`/`Status` con items asociados) y esa excepción sin capturar se
propagaba como un 500 de Next.js.

## Decisión

Agrego `conflict()` y `fromPrismaError()` en `lib/http.ts`, con el mismo
estilo que `badRequest()`/`fromZodError()`. Envuelvo en `try/catch` los 10
puntos de escritura que pueden disparar P2002 o P2003:

- Duplicados (P2002 → 409): `POST`/`PUT` de `users`, `categories`,
  `statuses`, `items`.
- FK restringida en delete (P2003 → 409): `DELETE` de `categories` y de
  `statuses` — los únicos dos `ON DELETE RESTRICT` alcanzables desde un
  endpoint existente hoy (`items.responsible_id` es `SET NULL`,
  `movement_history` nunca tiene filas, y no hay endpoint que borre
  roles; ver `docs/DEUDA.md`).

Cualquier otro error —incluido cualquier otro código de
`PrismaClientKnownRequestError`— se relanza tal cual y sigue cayendo en
el 500 sin manejar, igual que antes.

## Por qué es una desviación consciente, no una corrección silenciosa

El original deja pasar estos casos como 500 no intencional — no es
contrato deliberado, es ausencia de manejo (mismo argumento que el ADR de
"404 real en los recursos no encontrados"). Un 409 con mensaje claro no
rompe nada del frontend actual (que ya trata cualquier error HTTP como
fallo genérico) y evita un 500 confuso para casos esperables en un CRUD.
Por eso queda documentado acá en vez de aplicarse en silencio.

## Qué NO cambia

- No agrego capa de servicios ni ninguna librería externa.
- No pre-valido duplicados antes de escribir (`existsByUsername`, etc.)
  — dejo que Prisma dispare la excepción y la traduzco después, tan fiel
  al hecho de que el original tampoco pre-valida como se puede ser sin
  replicar también su falta de manejo.
- Cualquier excepción que no sea `PrismaClientKnownRequestError` con
  código P2002/P2003 sigue devolviendo el 500 sin manejar de siempre.

## Consecuencias

Si en algún momento hace falta replicar el 500 crudo exacto de Spring acá
(por ejemplo, para un ejercicio que dependa de ese comportamiento), esta
decisión se revierte acá, no se cambia en silencio en el código.
