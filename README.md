# posts-carrousels

Carruseles listos para publicar en Instagram, TikTok, Facebook y LinkedIn
para las tres marcas: **ComeHomeTag**, **Qolca** y **Propaga**.

## Cómo publicar desde el celular

Con **la app** — es la forma rápida. Elige el post, toca *Guardar 7 fotos* y el
menú de iOS las manda a Fotos; copia el caption de al lado, y márcalo como
publicado para que no te lo vuelva a ofrecer. Guía completa e instrucciones de
despliegue en **[`WEB.md`](WEB.md)**.

```bash
cd carousels && npm install && npm run dev     # http://localhost:3000
```

A mano, sin la app:

1. Abre `brands/<marca>/out/<serie>/<post>/`
2. Descarga las fotos de `ig/` (Instagram/Facebook) o `tt/` (TikTok) — en orden 01, 02, 03...
3. Abre `captions.md` → cada caption tiene su **botón de copiar** en GitHub
4. Pega, publica, y quédate 30 min respondiendo comentarios

Cada marca tiene su **`README.md`** con la guía completa de subida.

## Estructura

```
brands/
  comehometag/   💜 protección QR para niños, abuelos y mascotas
  qolca/         🔷 automatización e IA para empresas (incluye PDF LinkedIn)
  propaga/       🔥 marketing para negocios (SaaS)
    posts/       las 6 series en JSON (el contenido fuente)
    plates/      fondos generados (originales)
    plates_graded/  fondos graduados a la paleta real de cada marca
    out/         LO QUE SE PUBLICA: <serie>/<post>/{ig,tt,captions.md}
tools/           grade.py (color) · render.py (láminas) · shots.py · captions_md.py
app/ scripts/    la app web (Next.js) — ver WEB.md
COLORES.md       el sistema de color de las 3 marcas (teoría aplicada)
PLAN-180.md      la estrategia completa y el porqué de cada serie
STRATEGY.md      la investigación base (algoritmos, formatos, virality)
WEB.md           cómo correr y desplegar la app
```

## Regenerar (requiere Python + Pillow)

```bash
python tools/grade.py        # re-gradúa fondos a paleta
python tools/shots.py        # recorta las capturas de Propaga (--sheet para revisarlas)
python tools/render.py       # re-renderiza todas las láminas
python tools/captions_md.py  # regenera captions.md
npm run prepare-assets       # que la app vea las láminas nuevas
```

El contenido es texto: editar un post = editar su JSON en `posts/` y re-renderizar.

### Capturas de producto (Propaga)

Los 60 carruseles de Propaga llevan una lámina con una **captura real del
producto**, sacada de las mismas que salen en propaga.pe. `tools/shots.py` las
recorta panel por panel — una tarjeta de resultados, tres burbujas de un chat,
cuatro filas de contactos — porque un tablero completo metido en una lámina no
se lee en el celular. En el JSON del post es un campo `shot`:

```json
{ "role": "stat", "shot": "shot-chat.png",
  "h": "Tres segundos, no tres horas.",
  "b": "La IA contesta con precio, stock y envío mientras tú haces otra cosa." }
```

Si las capturas del landing cambian, corre `tools/shots.py` otra vez: los
recortes están en fracciones de la imagen, así que sobreviven a un cambio de
tamaño. Los recortes viven en `brands/propaga/product/`.
