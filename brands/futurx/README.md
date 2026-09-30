# futurX (futurx)

Comunidad universitaria peruana que aprende inteligencia artificial. Sitio:
https://www.futurx.pe · Instagram: @futurxcentral · YouTube: @futurXPeru.

**El diseño de los posts ES el del sitio futurx.pe.** Antes de tocar una lámina,
lee [`BRAND.md`](BRAND.md). futurX no usa F1 ni `render.py`/`render_f1.py`:
tiene su propio render, `tools/render_futurx.mjs`, que maqueta cada lámina en
HTML con los tokens del sitio (`plantilla/futurx.css`) y la fotografía con
Chromium.

| Carpeta / archivo | Qué es |
|---|---|
| `BRAND.md` | el libro de marca: de dónde sale cada decisión, roles de lámina, prohibiciones |
| `brand.json` | ficha para la app y los scripts (dominio, Instagram, fuentes) |
| `plantilla/futurx.css` | los tokens de `futurx/web/app/globals.css`, a 360 px de ancho |
| `logo.svg` · `logo.png` | el logo del sitio (`web/public/logo.svg`) |
| `photos/` | archivo real de futurX (gitignored; procedencia en `PHOTOS.json`) |
| `posts/<serie>.json` | el copy; `muestra.json` es solo para aprobar el diseño |
| `out/` | los renders (gitignored, van al bucket como las demás marcas) |

Publicar: render → `npm run prepare-assets` → el flujo de siempre (upload-media,
MEDIA_BASE build-index, commit del manifest).
