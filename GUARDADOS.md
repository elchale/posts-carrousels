# Por qué se guardó ESE carrusel — y cómo se repite

Fecha: **2026-07-29**. El primer carrusel de ComeHomeTag que la gente **guarda**
es `s1-protocolos/antes-de-salir` → *"Haz esto antes de salir con tus hijos.
3 costumbres de 2 minutos."* Le va mejor que a todo lo publicado antes.

Este documento es la autopsia de ese post, la regla que sale de ahí, y lo que ya
se cambió en la librería por eso. **Es una hipótesis, no una medición**: sale de
UN post que funcionó, contra 60 hermanos que no. Se confirma o se tumba con los
guardados de los próximos 10. Los datos de formato (carrusel = formato de
conversión, no de alcance; guardados y envíos son la señal que ranquea) están en
`STRATEGY.md` y `PLAN-180.md`.

---

## La regla madre

> **Se guarda lo que sirve DESPUÉS. No lo que se siente AHORA.**

Un guardado no es un aplauso: es un **estacionamiento**. El lector aparta el post
porque puede *imaginar el día* en que lo va a volver a abrir. Por eso:

- El miedo se consume en el momento → se lee, se comenta, no se guarda. Y guardar
  el peor día imaginable de tu vida es guardar el susto: nadie planea volver ahí.
- La lista se usa el sábado → se guarda.

Todo lo demás de este documento es esa frase, desarmada.

## Los 6 rasgos del post que funcionó

| # | Rasgo | En el post que funcionó | El contraejemplo de la librería |
|---|---|---|---|
| 1 | **Momento recurrente, nombrado** | "antes de salir con tus hijos" — pasa cada fin de semana | "Si tu hijo se pierde, tienes 10 minutos" → un día que ojalá nunca llegue |
| 2 | **Costo contado y diminuto** | "3 costumbres de **2 minutos**" | "El plan para multitudes que caminan" → ni cuántas cosas ni cuánto cuesta |
| 3 | **Es una orden, no un tema** | "**Haz** esto" | "Por qué un abuelo con Alzheimer sale solo" → interesante, no accionable |
| 4 | **Lista contada** | "3 costumbres" | "Dónde buscar primero y a quién llamar" → ¿cuántas cosas son? |
| 5 | **Cosas que se HACEN, no que se saben** | tómale una foto · di la frase · ponle tu número encima | "Lo que el GPS no puede hacer" → argumento, no tarea |
| 6 | **Se entrega a un tercero con nombre** | "Comparte la lista con **los abuelos y la niñera**" | "Comparte esta guía" → ¿con quién? |

### Lo que NO lo causó

- **No fue el "guárdalo".** Media librería ya lo pedía (los 60 de Propaga lo
  piden en la portada de cierre) y no se guardaba. El pedido cobra sentido cuando
  hay algo que valga la pena guardar; solo, es ruido.
- **No fue el tema.** `foto-del-dia` y `punto-de-encuentro` son literalmente los
  ítems 1 y 2 de ese mismo post, publicados aparte, y no despegaron igual. Lo que
  cambió es que ahí eran **una idea suelta** y aquí son **una rutina completa**.
- **No fue el diseño.** Mismas láminas, misma tipografía, mismos colores.

## Los tres tipos de post (y por qué no todos deben ser de guardado)

Cada post tiene que saber qué señal persigue. Optimizar todo a guardado mata las
historias, que son lo que hace crecer por envíos.

| Tipo | Para qué | Cómo se cierra | Ejemplos |
|---|---|---|---|
| **Guardado** | checklists, rutinas, guiones, calendarios | "Guárdalo para *[ocasión]*" | CHT s1/s2/s4 · Propaga s1/s2/s5 |
| **Envío** | historias, mitos, "esto le pasa a cualquiera" | "Mándaselo a *[persona]*" | CHT s6 y s5 · Propaga s6 |
| **Conversación** | el que busca un DM, no un archivo | una pregunta concreta | Qolca entero (ver abajo) |

**Qolca es de conversación a propósito**: sus portadas nombran el problema del
lector y sus cierres piden un dato ("¿cuántos chats recibes al día?"). Su puntaje
de forma-de-guardado es el más bajo de las tres marcas y **está bien así** — lo
único que se le agregó es la lámina de las 7 preguntas antes de firmar, que es su
único post construido para quedarse en el celular de alguien.

## Cómo se escribe una portada de guardado

```
[ORDEN] + [MOMENTO RECURRENTE]  →  "Haz esto antes de salir con tus hijos."
[N COSAS] + [COSTO EN TIEMPO]   →  "3 costumbres de 2 minutos. Evitan sustos."
```

Sirve la prueba de las dos preguntas. Si alguna se responde mal, la portada es de
alcance, no de guardado:

1. **¿Cuándo lo va a volver a abrir?** Si la respuesta es "ojalá nunca" o "no sé",
   falta el momento.
2. **¿Cuánto le cuesta usarlo?** Si no hay un número y una unidad de tiempo,
   falta el costo.

Y la regla que ya estaba en `PLAN-180.md` sigue mandando: la **lámina 2** tiene
que funcionar sola (Instagram vuelve a mostrar el carrusel empezando ahí).

## La lámina "PARA GUARDAR" (`role: "recap"`)

El hueco más grande que tenía la librería: **un carrusel que reparte 3 pasos en 3
láminas no deja nada que guardar**. Para usar la lista el sábado había que volver
a barrer el post guardado, lámina por lámina.

`tools/render.py` tiene ahora el rol **`recap`**: una sola lámina con la lista
completa — kicker *PARA GUARDAR*, el titular de la portada, los pasos numerados y
**el logo + el dominio abajo**. Lleva la marca a propósito: es la lámina que se
captura y se reenvía, así que tiene que decir de quién es la lista.

Se agrega con **una línea** en el JSON del post, después de la última lámina de
valor:

```json
{ "role": "recap" }
```

Todo lo demás lo deduce del post: el título es el titular de la portada y los
ítems son los `h` de las láminas `value` con su `n`. Se puede sobreescribir
cuando haga falta:

```json
{ "role": "recap", "h": "Las 7 preguntas", "items": ["¿Puedo hablar con...", "..."] }
```

**Cuándo NO ponerla** (es el 90% de los errores posibles aquí):

- Cuando los titulares de las láminas de valor son **eslabones de un argumento**,
  no pasos. "Lo que el GPS hace bien / Lo que el GPS no puede hacer" en una lista
  numerada no es una chuleta, es un resumen sin sentido. Por eso CHT s5 (mitos) y
  Qolca s6 (visión) **no la llevan**.
- Cuando son menos de 3 pasos: dos ítems no son una lista.
- Cuando el cuerpo de cada lámina ya es una lista (`1 … · 2 … · 3 …`, los swipe
  files de Propaga): el carrusel entero **ya es** el artefacto.
- Revisa siempre los ítems deducidos antes de renderizar. Salieron dos
  contradicciones de conteo que ya estaban en el texto y que la lámina destapó
  ("5 señales" con 3 señales, "5 mentiras" con 4): corregidas a 3 y 4.

## El pedido de guardar va en el caption, y nombra la ocasión

En el post que funcionó, el "guárdalo" **no está en ninguna lámina**: está en el
caption de Instagram, y **nombra el día** — *"Guárdalo para tu próxima salida."*
Esa es la forma: la lámina queda limpia y el pedido llega igual.

- Bien: "Guárdalo para octubre." · "Guárdalo para hacer el mapa de 5 lugares hoy."
  · "Guárdalo para el día que te vuelva la culpa."
- Mal: "Guarda este post." (no dice para cuándo, así que no dice para qué)
- En los posts de historia el pedido correcto es el envío, no el guardado.

## Qué se cambió por esto (2026-07-29)

- **55 láminas `recap` nuevas**: 37 en ComeHomeTag (s1, s2, s3, s4 — revisadas una
  por una), 17 en Propaga (s2 calendarios + s5 crecimiento) y 1 en Qolca (las 7
  preguntas antes de firmar, con ítems explícitos).
- **20 captions de ComeHomeTag** que tenían la lista pero no el pedido: ahora
  piden guardar nombrando la ocasión.
- **2 conteos corregidos** en portada, captions y ALT (`senales-tempranas` 5→3,
  `mitos-vs-datos` 5→4).
- **`tools/guardados.py`**: puntúa los 181 posts contra los 6 rasgos y escribe
  **`ORDEN.md`** — el orden de publicación sugerido, de más forma-de-guardado a
  menos, con lo que le falta a cada uno. Mide **forma, no rendimiento**.
- El post que funcionó saca 10; la media de ComeHomeTag es 2.9, Propaga 2.4,
  Qolca 0.6 (a propósito, ver arriba).

```bash
engine/.venv/Scripts/python.exe carousels/tools/guardados.py            # las 3 marcas -> ORDEN.md
engine/.venv/Scripts/python.exe carousels/tools/render.py comehometag s1 # re-renderizar
```

## Cómo seguir

1. **Publica en el orden de `ORDEN.md`** (de arriba hacia abajo) dentro de cada
   marca. Los de abajo no son malos: son de envío o de conversación.
2. **A los 7 días de cada post, mira guardados y envíos** en las estadísticas de
   Instagram, no los likes. Si un post supera a `antes-de-salir`, vuelve a leer
   esta autopsia con ese post al lado — la hipótesis se actualiza, no se defiende.
3. Los **42 posts marcados "sin recap"** en `ORDEN.md` son la cola de trabajo:
   cada uno tiene 3+ pasos atómicos y ninguna lámina que los junte. Antes de
   agregarla, revisa los ítems deducidos (`recap_items`) con la regla de arriba.
4. **Matar y clonar**: el que se guarda, se clona con otro momento
   ("antes de salir" → "antes de entrar al mall" → "antes del viaje"). El que no,
   no se vuelve a intentar.
