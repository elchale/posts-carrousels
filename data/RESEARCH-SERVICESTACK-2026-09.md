# RESEARCH — The Service Stack, serie `sep` (2026-09-01)

Auditoría de sustancia de los 20 posts de `brands/servicestack/posts/sep.json`,
con el mismo estándar que los research de Propaga y Qolca: **cada consejo tiene
que ser el que firmaría un practitioner TOP en el contexto exacto del lector**.

## Contexto del lector (importa, y estaba mal descrito en el encargo)

El encargo hablaba de «home-service pro gringo». La ficha real de la cuenta
(`affiliate/ACCOUNT-B-STACK.md`) dice otra cosa, y es la que manda:

> «US freelancers, agency-of-one operators, small local business owners, and
> people who just quit a job to go solo. They are buyers — they already spend on
> tools — and they think in hours saved, not features.»

Voz declarada: **operator, not guru**. Primera persona, números propios
solamente, y la regla dura de la cuenta: *"Studies show automation saves 40% of
your week"* está **prohibido** (cifra inventada). Un post de home services
(plomero, HVAC) puede aparecer como ejemplo, pero el consejo se juzga contra el
operador solo, no contra un contratista con cuadrilla.

Método: el presupuesto de WebSearch de la sesión estaba agotado (200/200), así
que todo se verificó por **WebFetch directo contra fuentes primarias**. Estados:
**CONFIRMADO** (fuente primaria o practicante publicándolo él mismo) ·
**PLAUSIBLE** (marco publicado, sin verificar en esta sesión) · **FOLKLORE**
(circula sin fuente rastreable → prohibido).

---

## 1. Seguimiento de leads: la cadencia numerada es FOLKLORE (post 01)

**Decía la lámina:** `Follow up three times · Day 1, day 3, day 7, stop`.

Dos problemas, y los dos ya están resueltos en los otros dos research de este
repo:

- **La cadencia es inventada.** `RESEARCH-PROPAGA-2026-09.md` §12 borró la
  cadencia «día 2 / 5 / 10 / 20» por exactamente esto. Y
  `RESEARCH-QOLCA-2026-09.md` §2 marca como **FOLKLORE, prohibido** el
  «se necesitan 5 a 8 toques» / «el 80% de las ventas requiere 5 seguimientos»:
  circula atribuido a Marketing Donut, Brevet Group y a una «National Sales
  Executive Association» que no existe como fuente rastreable.
- **El `stop` regala ventas.** Poner un tope numérico arbitrario al seguimiento
  de un lead que levantó la mano es criterio 4 puro.

**Lo que sí está CONFIRMADO y reemplaza la cadencia — Josh Braun, "Sales
Pressure".** Nombra la **Zone of Resistance**: *"The ZOR is a reflex reaction to
sales pressure."* Toda pregunta que empuja («are you still interested?», «just
checking in») **es** presión y dispara la defensa; lo que enseña en su lugar son
espejos, etiquetas y preguntas abiertas — es decir, **traer algo, no recordar que
existes**.
Fuente: https://joshbraun.com/sales-pressure/

**Dice ahora:** `Every follow up brings something new · Never just checking in`.
Es la regla, no la cifra, y no le pone techo al seguimiento.

---

## 2. Los ejemplos en el prompt pesan más que las instrucciones (post 14)

**Decía la lámina:** `LINE 2 · Name the reader · A client, not a colleague`.
Correcto pero de bajo rendimiento: es la línea más floja de un prompt de cuatro
líneas (criterio 5).

**CONFIRMADO — documentación oficial de prompting de Anthropic.**
- *"Examples are one of the most reliable ways to steer Claude's output format,
  tone, and structure. A few well-crafted examples (known as few-shot or
  multishot prompting) improve accuracy and consistency."*
- Los ejemplos deben ser **Relevant** (*"mirror your actual use case closely"*),
  **Diverse** y **Structured** (envueltos en tags `<example>`).
- *"Include 3–5 examples for best results."*
Fuente: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

Para un update semanal, el ejemplo perfecto ya existe y no cuesta nada: **el
update de la semana pasada**. Es relevante por definición y arrastra tono,
formato y largo de una sola vez.

**Dice ahora:** `LINE 2 · Paste last week's update in · The example beats the
instruction`. La línea del `shape` se mantiene: la documentación recomienda
instrucciones **y** ejemplos, no uno u otro.

---

## 3. Aritmética de automatización: cinco minutos semanales SON cuatro horas al año (post 19)

**Decía la lámina:** `THE TEST · Under five minutes, weekly · Do it, do not build
it`.

El test está mal calibrado y se desmonta con una multiplicación: 5 min × 52 =
**~4.3 horas al año**. Cualquier automatización que se construya en menos de eso
se paga sola el primer año. La regla, tal como estaba, le decía al lector que no
construyera cosas que sí le convienen (criterio 5: se quedó en categoría, y
encima en la categoría equivocada).

**Marco: cálculo de payback / punto de equilibrio**, que es la forma estándar de
decidir automatización y no necesita cita de gurú porque es aritmética. Encaja
además con la única fuente de peso del tema, ya verificada en el research de
Qolca §12: **Michael Hammer, "Reengineering Work: Don't Automate, Obliterate"**,
HBR jul–ago 1990 — primero se borra el paso, después se decide si se automatiza.
Fuente: https://hbr.org/1990/07/reengineering-work-dont-automate-obliterate

**Dice ahora:** `THE TEST · Five minutes weekly, four hours a year · Build only if
it takes less`. Y como el test dejó de ser una «task», la portada bajó de `4
tasks` a `3 tasks` — los tres que quedan (mensual, con juicio, cambiante) sí son
tareas.

Nota de coherencia: el post 12 («automate the waiting, not the talking») sigue
siendo el filtro cualitativo, y este es el cuantitativo. No se pisan.

---

## 4. Batching de correo vs. speed-to-lead: no son el mismo inbox (post 09)

**Decía la lámina:** `DAILY 1 · The inbox, once at nine · Not open all day`.

Es Cal Newport / deep work aplicado **al inbox equivocado**. Contradice de frente
al post 01 de esta misma serie («reply in five minutes») y a la doctrina
speed-to-lead que sostiene los tres research del repo:

**CONFIRMADO — "The Short Life of Online Sales Leads"**, James B. Oldroyd,
Kristina McElheran y David Elkington, HBR marzo 2011. Tesis publicada: *"most
companies are not responding nearly fast enough"* a las consultas que llegan por
web. (El múltiplo «21x» que circula es del Lead Response Management Study,
patrocinado por InsideSales.com → **PLAUSIBLE**, no se imprime.)
Fuente: https://hbr.org/2011/03/the-short-life-of-online-sales-leads

La transposición correcta es la que hace cualquier operador solo que vive de
inbound: **el correo interno se agrupa, el lead nuevo avisa.** No es «revisa
menos», es «separa las dos colas».

**Dice ahora:** `DAILY 1 · The inbox, twice a day · New leads alert you, the rest
waits`.

---

## 5. La propuesta no puede prometer llegar tarde (post 06)

**Decía la lámina:** `FIELD 2 · The deadline they said · Yours goes two days
after`.

Leído en frío — que es como se lee un carrusel — dice **entrego dos días después
de tu fecha**. Aunque la intención fuera el colchón, la lámina enseña a prometer
un incumplimiento. Regla de claridad literal de la ronda 6 del skill: cada lámina
se entiende sola en dos segundos.

El colchón correcto va del lado del que entrega, no del cliente: **fecha interna
antes de la fecha comprometida** (underpromise/overdeliver, práctica de gestión
de proyectos estándar; se enseña como comportamiento, no se cita como estudio →
**PLAUSIBLE**).

**Dice ahora:** `FIELD 2 · The deadline they said · Your own date lands two days
earlier`.

---

## 6. Descuento reflejo por un retraso (post 15)

**Decía la lámina:** `PART 4 · Offer one thing back · A call, a rush, a credit`.

El `credit` enseña a **rebajar por defecto** cada vez que algo se atrasa, que es
justo lo que la doctrina de precio de las tres marcas prohíbe (§ Hormozi en
`RESEARCH-PROPAGA-2026-09.md`: no descontar, quitar alcance o sumar valor). Un
crédito automático además **entrena al cliente** a esperar plata cada vez que
haya un retraso: criterio 4.

**Dice ahora:** `PART 4 · Offer one thing back · A call, a partial, priority
next`. Se ofrece **alcance y prioridad**, no descuento. El resto del post (decirlo
en la primera línea, una fecha nueva, una frase de qué cambió, sin culpar) se
mantiene tal cual.

---

## 7. El recordatorio que evita el plantón trae el link para mover la hora (post 05)

**Decía la lámina:** `SETTING 4 · Send the reminder yourself · Day before, your
address`.

Bien, pero incompleto. Lo que la evidencia sostiene es el recordatorio; lo que
convierte un plantón en una reprogramación es **darle la salida en el mismo
mensaje**.

**CONFIRMADO (vía `RESEARCH-QOLCA-2026-09.md` §6, revisión Cochrane, 7 ensayos,
5,841 participantes):** los recordatorios por mensaje mejoran la asistencia
(**RR 1.14, IC 95% 1.03–1.26**); asistencia **67.8% sin recordatorio, 78.6% con
SMS, 80.3% con llamada**; el mensaje **iguala a la llamada** (RR 0.99) por
**55–65% menos** de costo.
Fuente: https://www.cochrane.org/CD007458/EPOC_mobile-phone-messaging-reminders-attendance-healthcare-appointments

**Dice ahora:** `SETTING 4 · Send the reminder yourself · Day before, with a
reschedule link`.

---

## 8. Lo que se revisó y se dejó intacto (13 posts)

`02` `03` `04` `07` `08` `10` `11` `12` `13` `16` `17` `18` `20`.

Los que más se miraron antes de dejarlos:

- **02 (invoices)**: `invoice the same day`, `due date in words`, `late fee in
  the quote, not the invoice` — todo práctica de cobranza estándar, y las dos
  alertas (antes del vencimiento y al día siguiente) no son una cadencia
  inventada sino los dos bordes de una fecha. El concepto de fondo, **dunning**,
  está CONFIRMADO en el research de Qolca §13 («comunicarse *metódicamente*»),
  sin cadencia rastreable — y este post no imprime ninguna.
- **12 (`automate the waiting, not the talking`)**: la mejor línea del set y
  perfectamente defendible.
- **17 (`what an AI agent is not`)**: `not an employee` · `not set and forget` ·
  `not cheaper by default` · `a loop with permissions`. Correcto y del lado
  honesto de una categoría llena de humo.
- **08 (`$60 stack`)** y **07 (`$0 stack`)**: nombrar el precio de las
  herramientas está **permitido y mandado** por la ficha de la cuenta (*"Name the
  cost out loud, including the free tier"*). No confundir con la regla dura de
  «cero precios» del skill, que se refiere al precio **del producto propio**;
  aquí no hay producto propio.

---

## 9. Prohibido en esta serie (de aquí en adelante)

| Frase / patrón | Estado | Regla |
|---|---|---|
| «Day 1, day 3, day 7» y cualquier cadencia numerada de seguimiento | FOLKLORE | Prohibido. Se enseña «cada toque trae algo nuevo». |
| «5 a 8 toques para cerrar» / «el 80% necesita 5 seguimientos» | FOLKLORE | Prohibido (heredado de Qolca §2). |
| «Studies show automation saves X% of your week» | Cifra inventada | Prohibido (regla de la cuenta). |
| El múltiplo «21x» / «100x» de speed-to-lead | PLAUSIBLE (vendor) | Se enseña el principio, no el número. |
| Crédito o descuento como compensación por defecto | — | Se ofrece alcance o prioridad, nunca plata. |
| Batching del inbox sin separar el lead nuevo | Contexto equivocado | El correo interno se agrupa, el lead avisa. |
| Números propios de ingresos, capturas de pago, «passive income» | — | Regla dura de la cuenta. |
