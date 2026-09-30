# futurX: libro de marca para posts

> **La regla que manda sobre todo lo demás: los posts de futurX se diseñan con el
> sistema visual de su sitio, www.futurx.pe.** Una lámina de futurX tiene que
> verse como una pantalla del sitio en el celular. Si alguien la ve en el feed y
> después entra a futurx.pe, tiene que reconocer que es lo mismo.
>
> Por eso futurX **no usa F1**: nada de foto a sangre con velo negro, nada de
> mayúsculas gigantes, nada de palabra pintada de acento. Cuando el skill
> `copy-carruseles` o cualquier otro documento de `carousels/` diga algo que
> choque con este archivo, **para futurX manda este archivo**.

Confirmado por Carlos el 2026-09-30, al instalar la marca.

## De dónde sale cada decisión

El diseño no se inventa acá, se copia. Estas son las fuentes, en orden:

| Qué | Fuente de verdad (repo `futurx/web`) |
|---|---|
| Colores, radios, escala tipográfica | `app/globals.css` (bloque `@theme` y `:root`) |
| Reglas de diseño y la lista contra el look de IA | `uncommited/docs/02_direccion_de_diseno.md`, secciones 4, 5 y 7 |
| Logo | `public/logo.svg`, copiado a `brands/futurx/logo.svg` |
| El motivo de la X | `components/ui/chevron-motif.tsx` |
| Cabecera de sección, tarjeta de fase, tira de datos, cifras, botón | `components/ui/section-header.tsx`, `components/event/PhaseCard.tsx`, `FactsLine`, `components/hackaton/indicadores-vivos.tsx`, `components/ui/button.tsx` |
| Fotos | `public/revista/fotos/`, el archivo real de futurX (revista futurA n.º 1) |

`plantilla/futurx.css` copia esos tokens **con los mismos nombres**. Si el sitio
cambia un token, se cambia aquí igual y se vuelve a renderizar. Nunca al revés:
un post no puede estrenar un color, una fuente ni un radio que el sitio no tenga.

## Cómo se construye una lámina

Cada lámina es una página del sitio maquetada a **360 px de ancho**, que es el
ancho para el que se diseña el sitio, y se fotografía a 3x con Chromium:

| Corte | CSS | Salida | Zona segura |
|---|---|---|---|
| `ig/` Instagram y Facebook | 360 × 450 | 1080 × 1350 | márgenes de 28 px (arriba y abajo 32) |
| `tt/` TikTok | 360 × 640 | 1080 × 1920 | arriba 72 px (pestañas), abajo 141 px (caption y música, 22 %), derecha 44 px (botones, 12 %) |

Como la unidad es el píxel del sitio, todo pasa tal cual: el filete de 1 px, el
radio de 16 de los paneles, el chevron de las viñetas. Nada se "adapta a redes".

## La paleta

Un solo tema: **claro**. No hay versión oscura ni bloque navy a sangre, igual que
en el sitio.

| Rol | Token | Hex |
|---|---|---|
| Fondo | `--color-fx-white` | `#FFFFFF` |
| Banda de papel (láminas interiores alternas) | `--color-fx-paper` | `#F4F6FA` |
| Titulares y texto fuerte | `--color-fx-navy` | `#1B2D51` |
| Cuerpo | `--color-fx-ink-2` | `#4A5567` |
| Acento gráfico: chevrones, filetes, barra | `--color-fx-coral` | `#EA5046` |
| Texto coral y relleno del botón | `--color-fx-coral-ink` | `#D23B28` |
| Filetes | `--color-fx-line` | `#DDE2EC` |
| Motivo de la X (casi invisible) | `--color-fx-navy-050` y `-100` | `#F0F3F9`, `#E6EAF3` |

El coral es **el único acento** y aparece poco: un chevron, un filete, un número
de paso, el botón. Nunca como fondo de una lámina y nunca en más del 5 % del área.

## Tipografía

- **Outfit** (la del sitio) en titulares, cifras y números de paso. Titular de
  portada 44 px, peso 700, interlínea 1.02 y tracking de −0.03 em. Titular interior
  30 px, peso 600.
- **Roboto** en el texto corrido. El sitio usa la fuente del sistema, y en los
  Android del público esa fuente es Roboto. Se fija el archivo para que la lámina
  salga igual en cualquier máquina.
- Los dos archivos están en `CLIPPING/shared/fonts/`. El render **falla** si
  alguna de las dos no carga, así que no puede salir una lámina con Segoe UI.
- Mayúsculas y minúsculas normales. **Cero versalitas y cero texto en mayúsculas
  sostenidas.**

## Las láminas (roles)

El JSON está en `posts/<serie>.json`. El esquema completo está en la cabecera de
`tools/render_futurx.mjs`.

| Rol | Qué es en el sitio | Lleva |
|---|---|---|
| `cover` | El héroe: logo, titular grande, las rayas a 36° y la X abierta saliendo por la derecha | `h`, y `b` o `hechos` (la tira de datos del héroe del hackathon) o `photo` |
| `value` | Una sección: cabecera y su bajada | `h`, `b`, `label` (antetítulo plano), `items` (lista con chevron), `photo` con `pie` |
| `value` + `n` | La tarjeta de una fase o de un paso: número en coral dentro de un panel de papel | `n`, `h`, `b` |
| `value` + `cita` | El mensaje clave: filete coral de 3 px a la izquierda | `h`, `b` |
| `stat` | Los indicadores: cifra grande, su rótulo al lado y la barra coral opcional | `cifra`, `rotulo`, `barra` (0 a 1), `h`, `b` |
| `closer` | El cierre: logo, titular, botón primario y la dirección | `h`, `b`, `cta`, `url` |

- **El logo va en la portada y en el cierre**, igual que en el resto de marcas.
  El cierre lleva además un pie con `futurx.pe` y `@futurxcentral`.
- **Superficies:** la portada y el cierre van en blanco. Las interiores alternan
  papel y blanco, como las secciones del sitio. `"tono"` lo fuerza si hace falta.
- **Fotos:** solo del archivo real de futurX (`photos/`, con su procedencia en
  `PHOTOS.json`), con radio 12, **sin texto encima** y siempre con un pie que diga
  de cuándo son. Ninguna foto puede pasar por algo que no ocurrió: una foto del VR
  Day no ilustra la hackathon como si fuera de la hackathon. `"foco"` elige el
  punto de recorte para no cortar caras. Cero imágenes hechas con IA.

## Lo que NO se hace nunca

Es la sección 7 de la dirección de diseño del sitio, aplicada a los posts:

1. **Palabras sueltas del titular en coral o en cursiva.** Los `*asteriscos*` de
   F1 se ignoran: el render los quita y avisa.
2. **Píldora, chip o etiqueta encima de un título.** El `label` es una línea de
   texto plana, gris, sin caja y sin mayúsculas.
3. **Emoji en la lámina.** El render corta si encuentra uno. En el caption sí se
   pueden usar.
4. **Guiones o rayas en el copy visible**, la regla de todo el sitio. El render
   también corta. Se reescribe la frase con coma o con dos puntos.
5. **Foto a sangre con velo, degradados y fondos de color.** El único fondo es
   blanco o papel.
6. **Contadores de lámina** («1/6»), flechas de «desliza» y flecha al final del botón.
7. **Números 1, 2, 3 cuando no hay una secuencia.** Las dos fases de la hackathon
   sí la tienen.
8. **Iconos de cohete, bombilla, chispa o cerebro**, e ilustraciones de banco.
9. **Cifras inventadas.** Una cifra en un post es una que el sitio ya publica, o
   una medida con fecha. Las que cambian solas (los inscritos) no se imprimen en
   un post que va a vivir semanas.

## Copy

- Aplica el skill `copy-carruseles` para los ganchos, el presupuesto de texto y
  los captions, **salvo** en lo que choque con este archivo (acentos de color,
  etiquetas en mayúsculas, emoji y foto con velo).
- Español de Perú, con tildes. **«la hackathon»**, en femenino, siempre.
- El tono es el del sitio: verbo activo, frase corta y nombres y datos concretos
  («Lanzamiento en el anfiteatro de OpenPucp, junio de 2023»). Nada de «impulsamos
  la innovación».
- Lo que el sitio ya dice bien se reutiliza tal cual: «La nueva era es nuestra»,
  «No necesitas saber de IA ni programar».

## Render

```bash
cd carousels
node tools/render_futurx.mjs <serie>                  # toda la serie
node tools/render_futurx.mjs <serie> slug1,slug2      # solo esos posts
node tools/render_futurx.mjs <serie> --hoja           # y out/<serie>/_hoja.jpg para revisar
```

Salida: `out/<serie>/<slug>/{ig,tt}/NN.jpg` y `captions.txt`, en la misma forma que
las demás marcas, así que `build-index` y la app los leen sin nada especial. El
JPEG sale en 4:4:4 para que el coral sobre blanco no se ensucie en el borde.

**El render corta**, sin escribir nada de ese post, si:

- un texto, una foto o un panel se sale de la zona segura, en cualquiera de los dos cortes;
- una foto queda de menos de 150 px de alto (aplastada) o no carga;
- no carga Outfit o Roboto;
- hay un guion, una raya o un emoji en el copy.

Si una lámina no entra, se acorta el copy. No se achica la letra.

## Serie de muestra

`posts/muestra.json` tiene dos posts para aprobar el diseño: lo esencial de la
hackathon (6 láminas, con todos los roles) y qué es futurX (4 láminas, con fotos).
Todo su copy sale de lo que ya publica futurx.pe. **No es para publicar.**
