---
tipo: adr
estado: aceptada
fecha: 2026-08-31
---

# Shape propio para errores de validación 400

## Contexto

El original tampoco envuelve los errores de validación de Bean Validation
(`@NotBlank`, `@NotNull`) — Spring Boot devuelve su cuerpo por defecto para
`MethodArgumentNotValidException`, con un formato verboso específico de
Spring (`timestamp`, `status`, `errors[].defaultMessage`, etc.).

## Decisión

Uso un shape simple y propio para cualquier 400 de validación:

```json
{ "message": "Solicitud inválida", "errors": [{ "field": "name", "message": "no debe estar vacío" }] }
```

Implementado en `lib/http.ts` (`fromZodError`), a partir de los issues que
devuelve Zod.

## Por qué no imito el formato de Spring

No le aporta nada al frontend actual — ningún componente parsea el cuerpo
de un 400 campo por campo, solo revisa que la request falló. Imitar el
formato interno de Spring sería trabajo puro sin beneficio observable.

## Consecuencias

Si más adelante el frontend (o un test) necesita parsear errores de
validación por campo, este shape (`message` + `errors[]`) ya está listo
para eso.
