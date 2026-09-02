---
tipo: adr
estado: aceptada
fecha: 2026-08-31
---

# `NODE_EXTRA_CA_CERTS` para que `npm install` funcione en esta máquina

## Contexto

`npm install` falló con `UNABLE_TO_VERIFY_LEAF_SIGNATURE` al pedir
`@prisma/client`, con cero paquetes instalados. `curl.exe` y PowerShell sí
conectaban sin problema contra el mismo host — la cadena de certificados
real (`npmjs.org` → Google Trust Services WE1 → GlobalSign ECC Root CA -
R4) es pública y válida, no hay ningún proxy corporativo interceptando.
El problema es que Node no usa el almacén de certificados de Windows por
defecto — usa su propia lista (Mozilla) empaquetada, y esa lista no
resuelve bien esa cadena ECC específica en esta combinación de Node/npm.

## Decisión

Exporté el almacén de certificados de Windows (`Cert:\LocalMachine\Root` +
`Cert:\CurrentUser\Root` + `Cert:\LocalMachine\CA`) a un bundle PEM y lo
pasé como `NODE_EXTRA_CA_CERTS` antes de correr `npm install`. Con esa
variable seteada, la instalación completó sin problema (384 paquetes).

## Por qué no bajé `strict-ssl`

Deshabilitar la verificación de certificados (`strict-ssl=false`) hubiera
"arreglado" el síntoma sin resolver la causa, y de paso apaga la
verificación TLS para *todo* lo que instale con npm en esta sesión —
mucho más riesgo que ampliar la lista de raíces confiables de Node hasta
igualar lo que Windows ya confía.

## Consecuencias

Si `npm install` vuelve a fallar con el mismo error en este proyecto (o en
cualquier otro, en esta máquina), el mismo bundle sirve: exportar de nuevo
el almacén de Windows a un PEM y setear `NODE_EXTRA_CA_CERTS` antes de
instalar. Candidato a anotar también en las notas globales de entorno
Windows (`~/.claude/notas/entorno-windows.md`), no es específico de este
proyecto.
