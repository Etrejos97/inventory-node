# Deuda técnica y particularidades heredadas

Registro vivo de comportamientos que vienen del backend Java original y
decidí replicar tal cual, no bugs a corregir en silencio. Cuando algo de
acá se resuelva, lo saco de la lista o lo marco resuelto — no lo dejo
como histórico muerto.

## Password en texto plano, expuesto en `GET /api/users`

`GET /api/users` devuelve el campo `password` sin hashear ni ocultar, y el
login (`POST /api/auth/login`) compara contraseñas con `===` sobre texto
plano. Así es el original (`AuthController.java`, `User.java`) y así queda
acá — no agrego hash ni oculto el campo sin que se pida.

**Ubicación**: `lib/mappers.ts` (`toUserResponse`), `app/api/auth/login/route.ts`.

## `MovementHistory` sin escritura

El modelo, el endpoint `GET /api/movements` y el mapper existen completos,
pero nada los llena — ni el Java original ni esta recreación insertan una
fila ahí nunca. La tabla queda vacía siempre. No es un feature a medio
construir, es el contrato tal como está.

**Ubicación**: `app/api/movements/route.ts`, `prisma/schema.prisma` (modelo `MovementHistory`).

## `"changeme"` solo cuando `password` llega `null`, no cuando llega vacío

`POST /api/users`: si `password` no viene en el body (`null`/`undefined`),
uso `"changeme"` como default. Si llega como string vacío (`""`), lo guardo
vacío tal cual — el Java original (`UserService.create`) tampoco valida
blank ahí, solo en el `update`. Repliqué la discrepancia a propósito, no la
"arreglé", porque el mandato de este proyecto es fidelidad de contrato.

**Ubicación**: `app/api/users/route.ts`.

## Sin tests, sin CI — a propósito, por ahora

Este proyecto es la base sobre la que voy a practicar testing. No armé
framework de tests, smoke tests scripteados ni workflow de CI en esta
primera vuelta — la verificación de que cada endpoint responde bien la hice
a mano con `curl` mientras construía. Cuando arranque la práctica de
testing, esta sección se actualiza o se borra.

## Vulnerabilidad conocida en una dependencia de desarrollo de Prisma

`npm audit` marca 3 altas en `deepmerge-ts`, arrastrada por `@prisma/config`
→ `prisma` (el CLI, no el cliente en runtime). `npm audit fix` no la
resuelve porque el fix real depende de una versión de Prisma que todavía
no es estable (`>=6.13.0-dev.1`). No afecta al servidor corriendo — es
tooling de desarrollo/migración, no algo que se despliega. Revisar cuando
Prisma libere una versión estable que la traiga arreglada.

## Endpoints que golpean la base sin transacción explícita

Prisma no envuelve cada `create`/`update` en una transacción salvo que la
pida explícito. El Java original sí usa `@Transactional` en sus servicios.
Para el alcance de un CRUD de un solo insert/update por request esto no
cambia el comportamiento observable, pero si más adelante agrego un
endpoint que escriba en más de una tabla a la vez, ahí sí hace falta
`prisma.$transaction`.