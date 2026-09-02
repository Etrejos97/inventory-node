---
tipo: adr
estado: aceptada
fecha: 2026-08-31
---

# 404 real en los recursos no encontrados

## Contexto

El backend Java original no tiene un `@ControllerAdvice` ni ningún
`@ExceptionHandler` global. Cuando un servicio lanza `EntityNotFoundException`
(item, categoría, usuario, etc. que no existe), esa excepción no capturada
cae en el manejo por defecto de Spring Boot: un 500 con el cuerpo de error
genérico de Spring, no un 404. No hay ninguna señal en el código de que ese
500 sea intencional — es la ausencia de un handler, no un diseño.

## Decisión

Devuelvo 404 real (`{ message: "..." }`) en todos los "no encontrado" de
esta recreación: items, categorías, estados, responsables, usuarios, roles.

## Por qué es la única desviación de comportamiento que me permito

El resto del contrato lo replico tal cual, incluidas rarezas reales como el
password expuesto o el "changeme" que solo aplica a `null` (ver
`docs/DEUDA.md`). Esas sí son comportamiento observable que alguien podría
depender. Un 500 por falta de manejo de errores no es contrato, es un
agujero — y devolver 404 ahí no rompe nada del frontend actual, que ya
maneja errores de red genéricos.

## Consecuencias

Si en algún momento quiero replicar el 500 exacto de Spring por alguna
razón (por ejemplo, para un ejercicio de testing que dependa de ese
comportamiento), esta decisión se revierte acá, no se cambia en silencio en
el código.
