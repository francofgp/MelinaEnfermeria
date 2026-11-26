# Melina Gigena · Enfermera a domicilio

Sitio de Melina Gigena, Enfermera Profesional, que hace visitas a domicilio en Villa María y Villa Nueva (Córdoba), más el **kit** con piezas y textos listos para publicar en grupos de Facebook, estados de WhatsApp, el perfil de Google y un volante.

- **Landing:** `/` (Hugo, CSS propio sobre Open Props, sin frameworks).
- **Kit:** `/kit/` (no está enlazada desde la landing y no se indexa). Pensada para el celular: descargar cada pieza y copiar sus textos.
- **Publicación:** GitHub Pages, `https://francofgp.github.io/MelinaEnfermeria/`.

## Requisitos

- [Hugo extended](https://gohugo.io/installation/) 0.162.0 (`hugo version` tiene que decir `+extended`).
- Para renderizar piezas: Node 22+, pnpm y Chrome o Edge instalados (Playwright usa el navegador del sistema, no descarga uno).

## Uso

```bash
hugo server                 # http://localhost:1313/ con los datos pendientes resaltados en amarillo
pnpm install                # una vez, solo para las piezas
pnpm piezas                 # renderiza todas las piezas a static/kit/ (PNG; el volante también en PDF)
pnpm piezas presentacion    # una sola
hugo --gc --minify          # build de producción: falla si quedan datos pendientes
```

## Cambiar un dato

Todo sale de `data/`:

| Archivo | Qué tiene |
|---|---|
| `data/perfil.yaml` | Nombre, matrícula, WhatsApp, zona, horarios, prestaciones, trayectoria, mensaje por canal y la lista de **pendientes** |
| `data/visita.yaml` | Los cuatro pasos de "Cómo es una visita" (landing y pieza) |
| `data/preguntas.yaml` | Preguntas frecuentes |
| `data/mensajes.yaml` | Mensajes listos de WhatsApp, textos para el perfil de Google y consejos para grupos |
| `data/creditos.yaml` | Fotos de terceros con autor y licencia |

Después de cambiar un dato que aparece en las piezas, corré `pnpm piezas` y revisá los PNG antes de commitear.

**Datos pendientes:** cada clave de `pendientes` en `data/perfil.yaml` se ve resaltada y hace fallar el build de producción. Cuando Melina confirma un dato, se corrige y se saca de la lista. Para un deploy de prueba igual: `HUGO_PARAMS_PERMITIRPENDIENTES=true hugo`, o en GitHub Actions "Run workflow" con "Publicar aunque haya datos sin confirmar".

## Canal de origen

Los links de WhatsApp llevan un mensaje precargado que dice de dónde llegó la persona. La landing lo toma de `?desde=`: `facebook`, `volante` (el QR), `google`, `estado`; sin parámetro, `web`. Los textos del kit ya traen el link con su canal.

## Licencia

Sin licencia: todos los derechos reservados. Las fotos, el nombre y los textos son de Melina. Las fotos de la zona son de Wikimedia Commons con su licencia (ver `data/creditos.yaml`). Schibsted Grotesk: SIL Open Font License (`assets/fonts/OFL.txt`).
