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

### El logo

Cada carrusel lleva el logo de su marca en **dos láminas**: la portada (junto al
dominio, abajo) y el cierre (arriba del titular). En las demás no aparece —
repetirlo en las ocho lo vuelve ruido.

Los tres son los que cada marca sirve en su propio sitio, bajados de ahí:

| Marca | Origen | Qué es |
|---|---|---|
| ComeHomeTag | el `<svg>` de la cabecera de `comehometag.com` | arcos + persona + corazón, degradado violeta→rosa. El `/icon.svg` es el mismo pero sobre un cuadrado blanco que el favicon necesita y una lámina no |
| Qolca | `qolca.org/logo.svg` | la red de nodos, degradado verde→azul |
| Propaga | `propaga.pe/logo.png` | la doble P, degradado carmesí→naranja (el `.svg` pesa 2 MB porque envuelve un bitmap) |

Están en `brands/<marca>/logo.png`, transparentes y a 600 px de alto, y se
declaran con el campo `logo` de `brand.json`. Los tres tienen contraste
suficiente sobre su propia paleta, así que no hay versión clara y versión
oscura que elegir.

### Capturas de producto (Propaga)

Los 60 carruseles de Propaga llevan una lámina con una **captura real del
producto**, sacada de las mismas que salen en propaga.pe. `tools/shots.py` las
recorta, y hay dos tipos según lo que la lámina tenga que decir:

- **Completas** (41 posts) — la pantalla entera, con barra de navegación. A
  tamaño de lámina nadie lee las etiquetas; se reconoce la forma de un producto
  real: dos paneles, un post con su foto, avatares, contadores sin leer. Van
  donde el mensaje es *todo en un solo lugar*.
- **De detalle** (19 posts) — un panel a escala casi nativa, para leerse: las
  dos tarjetas de resultados, la tabla por ciudad, cuatro filas de contactos.
  Van donde el mensaje es una cifra o una respuesta concreta.

El error a evitar es recortar de más: la pantalla de comentarios recortada al
texto pierde la **foto del post**, que es justo lo que la hace reconocible.

En el JSON del post es un campo `shot`:

```json
{ "role": "stat", "shot": "shot-chat.png",
  "h": "Tres segundos, no tres horas.",
  "b": "La IA contesta con precio, stock y envío mientras tú haces otra cosa." }
```

Si las capturas del landing cambian, corre `tools/shots.py` otra vez: los
recortes están en fracciones de la imagen, así que sobreviven a un cambio de
tamaño. Los recortes viven en `brands/propaga/product/`.
