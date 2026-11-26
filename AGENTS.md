# AGENTS.md — MelinaEnfermeria

Landing y kit de publicación de **Melina Gigena, Enfermera Profesional** (atención a domicilio en Villa María, Córdoba). Repo **público** en `francofgp`, Hugo + GitHub Pages.

- Vocabulario: `GLOSSARY.md` (visita, prestación, pieza, kit…). Usá esos términos en código, textos y commits.
- Decisiones: `docs/adr/`.
- Plan y research (fuera del repo): `../Workbench/projects/melina-enfermeria/2026-11-landing-plan/`. Ahí viven los CVs y cualquier dato crudo.

Comandos y estructura de `data/`: `README.md`.

## Verificar

```bash
hugo --gc --minify                              # producción: tiene que fallar mientras haya pendientes
HUGO_PARAMS_PERMITIRPENDIENTES=true hugo --gc --minify --destination ../Workbench/_tmp/melina-prod
pnpm piezas                                     # y mirar cada PNG de static/kit/
```

Con `hugo server` corriendo, los chequeos del Workbench (`../Workbench/projects/melina-enfermeria/2026-11-landing-plan/scripts/`): `responsive.mjs` (10 anchos, desbordes, objetivos táctiles), `check-images.mjs`, `check-kit.mjs` (botón copiar y descargas) y el inspector de la skill `design-taste-frontend`. Mirá siempre las capturas: el build pasa aunque un texto se salga del lienzo.

## Gotchas

- **Datos pendientes:** toda cifra o dato sin confirmar va en `data/perfil.yaml` con su clave en `pendientes` y se muestra con `partial "pendiente.html"`. Nunca escribas un dato de Melina directo en un template.
- **Plantillas nuevas de Hugo (0.146+):** `layouts/home.html`, `layouts/baseof.html`, `layouts/_partials/`, `layouts/<sección>/page.html|section.html`. Usá `hugo.Data` (no `site.Data`) y `locale` (no `languageCode`): lo otro está deprecado en 0.162.
- **Fuente:** la `@font-face` va en un `<style>` del head (y del layout de piezas) con `RelPermalink`, porque el sitio vive en el subpath `/MelinaEnfermeria/`. No la muevas a un `.css`.
- **Piezas:** cada pieza es una página suelta (`layouts/piezas/page.html`, sin `baseof`) al tamaño exacto; el diseño va en `layouts/_partials/piezas/<diseno>.html`. Las páginas no se indexan ni entran al sitemap (cascade en `content/piezas/_index.md`). El QR del volante y los links de los textos usan `params.urlPublica`, no el baseURL, para que el render local apunte a la URL real.
- **Render de piezas:** `tools/render-piezas.mjs` usa el Chrome/Edge instalado (`playwright-core` no baja navegadores) y espera la fuente revisando `document.fonts` (`document.fonts.check()` da `true` aunque no haya cargado).
- **Fotos con transparencia:** pasalas a JPG compuestas sobre blanco; si no, el fondo sale negro.
- **Salida de builds de prueba:** a `../Workbench/_tmp/`, nunca dentro de `Proyectos/` suelta.

## CSS: propio sobre Open Props

Sin framework: CSS escrito a mano sobre **modern-normalize** y las variables de **Open Props** (`--size-*`, `--font-size-*`, `--ease-*`; referencia en [open-props.style](https://open-props.style)), copiados en `assets/vendor/` y empaquetados con `css.Build` de Hugo. Antes de inventar un valor, usá la variable de Open Props que corresponda. Los colores y la tipografía de la marca son variables propias que comparten la landing y las piezas. Detalle en `docs/adr/0002-css-propio-con-open-props.md`.

## Licencia

Sin archivo de licencia a propósito: todos los derechos reservados, porque el repo tiene las fotos, el nombre y los textos de Melina. No agregues una licencia.

## Repo público: qué entra

Solo entra lo que Melina aprobó para publicar: nombre, título, matrícula, WhatsApp, zona, horarios, prestaciones, trayectoria y sus fotos. Los CVs, el DNI, las direcciones particulares y cualquier dato de pacientes quedan en el Workbench.

## Textos verificables

Todo texto público tiene que poder comprobarse, porque la ley de enfermería de Córdoba (10.780, art. 13 e) prohíbe los anuncios que induzcan a engaño:

- Título "Enfermera Profesional" y número de matrícula provincial, con link a la consulta oficial.
- Los cursos se nombran como cursos (ECG, Universidad Favaloro), no como especialidades.
- La medicación e inyectables van "con indicación médica".
- Fotos: solo de Melina y reales. Ninguna de pacientes ni de heridas.
- Números y afirmaciones ("+5 años") salen de lo que Melina confirmó.

Melina aprueba cada texto, foto y pieza antes de publicarlos.

## Git

Commits sin atribución de IA. Commit y push solo cuando el usuario lo pida.
