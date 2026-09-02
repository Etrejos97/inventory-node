---
tipo: adr
estado: aceptada
fecha: 2026-09-02
---

# `imageUrl` opcional en Item

## Contexto

El emoji fijo (🖥️) en la tarjeta de producto y en el carrito no
representa el item real. Antes de tocar nada, confirmé contra
`Item.java` (`C:\Dev\Pruebas PPI\inventory-fullstack\backend`) que el
original nunca tuvo un campo de imagen — no es una brecha de fidelidad de
contrato, es una feature que el original tampoco tiene.

## Decisión

Agrego `imageUrl` (string opcional, nullable) al modelo `Item`, al
validador, al mapper y al body de `POST`/`PUT /api/items`. Es texto
libre: el usuario pega la URL de una imagen ya alojada en cualquier
lado. Sin validación de formato, sin upload de archivos, sin storage —
mismo trato que `location`/`observations`, campos de texto libre sin
reglas.

En el frontend, `ProductCard` y el carrito muestran la imagen real si
`imageUrl` viene con valor; si no, mantienen el emoji genérico como
fallback, así que un item sin imagen se ve exactamente igual que hoy.

## Por qué es aditivo, no una corrección

El original no maneja imágenes en absoluto, así que esto no reemplaza
ningún comportamiento existente — extiende el contrato con un campo
nuevo y opcional. Cualquier cliente que ignore `imageUrl` en el body
sigue funcionando igual que antes.

## Consecuencias

Si más adelante hace falta upload real de archivos (en vez de pegar una
URL), es una decisión aparte con su propio ADR — esta no la cubre.
