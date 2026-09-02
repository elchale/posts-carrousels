# Radar Estatal — verificación normativa de los 30 posts de `sep.json`

**Fecha:** 2026-09-01 · **Alcance auditado:** `brands/radarestatal/posts/sep.json`
**Por qué:** esta marca vive de que lo que decimos sea cierto. El formato F1 está
bien; lo que se audita aquí es la EXACTITUD de cada mecanismo descrito.

---

## 0 · Cómo se verificó

Se trabajó **sobre el texto normativo descargado y leído literalmente**, no
sobre guías, blogs ni resúmenes de terceros. Cada cita marcada como *literal*
fue extraída del PDF oficial.

| Fuente | Qué es | Uso |
|---|---|---|
| **Ley N° 32069** consolidada al **19.07.2026** | Ley General de Contrataciones Públicas | PDF oficial OECE → texto → búsqueda por artículo |
| **Reglamento (DS 009-2025-EF)** consolidado al **09.01.2026** | 249 páginas | fuente principal |
| **DS 001-2026-EF** (08/01/2026) | modifica 104 artículos del Reglamento | **VIGENTE desde el 14/01/2026**: su condición era la RD que modifica la Directiva de bases estándar, y esa RD salió (RD 0001-2026-EF/54.01, 13/01/2026) |
| **Bases estándar vigentes** (RD 0001-2026-EF/54.01) | Licitación Pública para bienes | .docx oficial: aquí viven los plazos y montos concretos |
| RD 0006-2025-EF/54.01 · Directiva 0007-2025-EF/54.01 | PAC / PMBSO | para los posts 01 y 23 |
| DS 120-2019-PCM + Ley 28024 | Registro de Visitas en Línea | para el post 19 |
| Consulta Amigable MEF (en vivo) | apps5.mineco.gob.pe | para el post 24 |

> **Aviso de vigencia.** Cualquier PDF del DS 009-2025-EF anterior a enero de
> 2026 está superado en 104 artículos. Y el consolidado más nuevo que publica
> el OECE llega al 09.01.2026: si sale un DS modificatorio después, esta
> verificación caduca en la parte afectada.

---

## 0.1 · El hallazgo que obliga a corregir la ficha de marca

**`BRAND.md` §"Las falacias que ya nos costaron una pasada completa" tiene hoy
tres entradas DESACTUALIZADAS.** Verificado por conteo literal sobre el texto
vigente:

```
"valor estimado"             → 0 ocurrencias en la Ley, 0 en el Reglamento
"valor referencial"          → 0 ocurrencias en la Ley, 0 en el Reglamento
"adjudicación simplificada"  → 0 ocurrencias en la Ley, 0 en el Reglamento
"comité de selección"        → 0 ocurrencias en el Reglamento
"cuantía de la contratación" → 34 ocurrencias en el Reglamento
```

1. **Falacia #4 ("valor estimado ≠ valor referencial; es público por regla")
   está MUERTA.** La Ley 32069 derogó ambos términos, los sustituyó por
   **la cuantía de la contratación** e **invirtió la regla de publicidad**
   (§2 de este documento).
2. **Falacia #3 (≤8 UIT "excluidas del ámbito", registro "EX POST") es
   IMPRECISA.** Hoy son **contratos menores** (Ley art. 34): están DENTRO de
   la ley, supervisados por el OECE, y se registran **desde las actuaciones
   preparatorias hasta el último pago** (Regl. art. 226.2). No es ex post
   (§12).
3. **El "comité de selección" ya no existe como figura única.** Hay tres tipos
   de evaluador y en varios procedimientos evalúa **una sola persona** (§11).

Se **confirman vigentes** las falacias #1 (nadie sabe quién postulará), #2 (el
RNP no vence), #5 (cero cifras inventadas), #6 (rutas tipo, no testimonios) y
#9 (designaciones y visitas = aviso de información pública) — con una
corrección menor en #9: el Registro de Visitas es **en tiempo real**, no "de
publicación diaria" (§19).

### Vocabulario: qué palabra usar hoy

| Ya no se dice | Se dice |
|---|---|
| valor estimado / valor referencial | **cuantía de la contratación** |
| adjudicación simplificada | **modalidad abreviada** (licitación o concurso público abreviado) |
| comité de selección | **evaluadores**: oficial de compra · comité · jurado |
| OEC (órgano encargado de las contrataciones) | **DEC** (dependencia encargada de las contrataciones) |
| OSCE | **OECE** |
| Tribunal de Contrataciones del Estado | **Tribunal de Contrataciones Públicas (TCP)** |
| contratación directa | **procedimiento de selección no competitivo** |
| fiscalización posterior (de la oferta) | **verificación posterior a la oferta ganadora** |

**SEACE sigue siendo término legal vigente y se conserva en los posts.** El
Reglamento lo define ("SEACE: Sistema Electrónico de Contrataciones del
Estado") y el art. 256.1 dice que **la Pladicop está integrada por el RNP, el
SEACE, los catálogos electrónicos, el cuaderno de incidencias y la plataforma
de contratos menores**. Las bases estándar y la RD 0006-2025-EF/54.01 usan
literalmente **"el SEACE de la Pladicop"**. Además es la keyword de búsqueda
del nicho. Siguen vigentes: **buena pro, bases, bases integradas, consultas y
observaciones, RNP, desierto, participante, postor**.

---

## 1 · Interacción con el mercado — post 02

**La norma.** "Indagación de mercado" ya no existe. El acto genérico es la
**interacción con el mercado** (Ley art. 47; Regl. art. 47), con exactamente
dos tipos (Regl. art. 47.1): **i) indagación** y **ii) consulta al mercado**.

- **Indagación** (art. 48). Análisis de información. Art. 48.2, *literal*:
  *"se puede solicitar información a los potenciales proveedores del rubro del
  objeto de la convocatoria."* **Ésta es la base del pedido de cotización que
  le llega al proveedor — y no se publica en ningún lado.**
- **Consulta al mercado** (arts. 49-51). Herramientas (art. 50.1): escritas
  (solicitudes de información, difusión del requerimiento) y reuniones.
- **Difusión del requerimiento** (art. 51). La ÚNICA vía con publicación
  obligatoria: la entidad publica el requerimiento **en la Pladicop** (y en su
  sede digital, "de contar con esta") antes de convocar.

**Cotizar no da ventaja.** No hay preferencia ni puntaje por haber cotizado, y
hay candados expresos: confidencialidad de lo obtenido (art. 47.2) e igualdad
de trato (art. 56.6). Al proceso se entra **registrándose como participante,
con RNP vigente** (arts. 22.2 y 65.1).

| Afirmación del post 02 | Veredicto |
|---|---|
| "Se llama indagación de mercado" | **IMPRECISO** → *interacción con el mercado* |
| "Piden precios antes de convocar" | **EXACTO** (art. 48.2) |
| "Así calculan el valor estimado" | **IMPRECISO** → *la cuantía de la contratación* (art. 53.1) |
| "Te la mandan por correo" | **EXACTO en sustancia** (arts. 48.2 y 50.1.a) |
| "O sale en el portal de la entidad" | **IMPRECISO** → el canal es la **Pladicop** (SEACE), vía difusión del requerimiento |
| "Cotizar no te asegura nada" | **EXACTO** |
| "Al proceso se entra por las bases" | **IMPRECISO por vago** → se entra **registrándote como participante** |

---

## 2 · Cuantía de la contratación — posts 03, 04, 09

**El cambio más grande de toda la pasada.** Ley art. 48 crea un concepto único:
la **cuantía de la contratación**. Regl. art. 53 la desarrolla, y el **53.4**
dice, *literal*:

> *"No es obligatorio dar a conocer a los proveedores la cuantía de la
> contratación durante la fase de selección, salvo que ésta sea punto de
> referencia para la presentación de ofertas."*

Bajo la Ley 30225 el valor referencial se publicaba **como regla**. Bajo la Ley
32069 la regla por defecto es **NO publicarlo**. Y **no es una reserva
discrecional del titular**: ese supuesto no existe (0 ocurrencias de reserva
motivada aplicada a la cuantía). Es consecuencia del método de evaluación.

**Los casos en que SÍ se conoce** (la cuantía es "punto de referencia"):

| Objeto | Artículo | Regla |
|---|---|---|
| Servicios de operación y/o mantenimiento, mantenimiento vial | Regl. 133 | oferta en rango 95%–110%, o fija al 100% |
| Concurso Público de expertos y gerentes de proyecto | Regl. 134.1 | oferta **fija** = cuantía |
| Obras bajo sistema de entrega de solo construcción | Regl. 165 | rango 95%–110%, o fija al 100% |
| Consultoría de obras y supervisión | Regl. 166.4 | oferta no menor al 90% de la cuantía |
| Comparación de precios | bases estándar CP | el precio ofertado no puede superar la cuantía |

Y el **aviso de convocatoria** (Regl. art. 63.2) contiene: entidad,
identificación y objeto del procedimiento, **cronograma**, instrumentos
internacionales y **bases (que incluyen el requerimiento)**. **No incluye
monto.**

**Veredicto:**

- **Post 04 completo → IMPRECISO de raíz en las cinco láminas.** No se corrige:
  se **reemplaza** por el mecanismo correcto (la cuantía y cuándo sí se conoce).
- **Post 03**, lámina "Mira el valor estimado" → **IMPRECISO**: se sustituye por
  un dato que sí está en la convocatoria.
- **Post 09**, "compara monto ganador y estimado" → **IMPRECISO**: el monto
  adjudicado sí es público (§8), la cuantía normalmente no.

**Dato verificado que entra en su lugar** (Regl. art. 75.1): en la evaluación
simultánea el factor **oferta económica no puede superar 40 de los 100 puntos**.
Excepciones: comparación de precios y subasta inversa (gana el menor monto) y,
con el DS 001-2026-EF, licitación pública abreviada de bienes homologados
(hasta 70).

---

## 3 · Bases, consultas y observaciones, bases integradas — post 06

**EXACTO.** Confirmado literal:

- Siguen llamándose **bases** (arts. 55.1 y 63.2.e).
- La etapa se llama **"Cuestionamientos a las bases"**, con dos subetapas:
  consultas y observaciones, e integración (art. 62.1).
- Plazo: **no menor a 7 días hábiles** desde el día siguiente de la
  convocatoria; **no menor a 3 días hábiles en modalidades abreviadas**
  (art. 66.1). Solo las formulan los **participantes** registrados.
- Art. 66.4, *literal*: el pliego se publica en la Pladicop con las bases
  integradas, *"las cuales contienen las modificaciones o precisiones
  formuladas y **se constituyen en las reglas definitivas del procedimiento**"*.
- Sí pueden **ajustar el requerimiento** (66.5) y **mover el cronograma**
  (66.7).
- Cobertura: existe en licitación y concurso público y sus modalidades
  abreviadas. **NO existe en subasta inversa electrónica ni en comparación de
  precios** (coherente con el art. 64.1).

**Post 06 se conserva**, con la sola mejora de decir "las reglas definitivas".

---

## 4 · Cronograma y presentación de ofertas — posts 05, 27

Los dos posts fallaban por el mismo motivo, y la corrección es además un dato
mejor que el que tenían.

- El Reglamento **no fija hora por etapa**. El art. 64 solo regula plazos
  mínimos y la modificación del cronograma.
- **Art. 64.1**: entre convocatoria y presentación de ofertas **no menos de 22
  días hábiles** (salvo modalidades abreviadas y procedimientos sin consultas y
  observaciones).
- **Art. 64.2**, *literal*: *"La prórroga o postergación de las etapas de un
  procedimiento de selección son registradas en la Pladicop modificando el
  cronograma inicial."* → **la entidad SÍ puede postergar.**
- **Bases estándar vigentes**, *literal*: *"La presentación de ofertas se
  realiza a través del SEACE de la Pladicop **desde las 00:01 hasta las 23:59
  horas (hora peruana)** de la fecha prevista en el cronograma del
  procedimiento de selección. Dicha fecha no puede ser fijada en menos de siete
  días hábiles desde la publicación de la integración de bases…"*
- Plazos de la fase de selección: **días hábiles** (art. 62.2). En ejecución
  contractual: **días calendario** (art. 105.3).
- La única etapa con hora exacta es el **periodo de lances de la subasta
  inversa**.

| Afirmación | Veredicto |
|---|---|
| "Cada etapa tiene fecha y hora exactas" (05) | **IMPRECISO** → el cronograma va por **fechas** |
| "Pasada la hora no hay excepción" (05) | **IMPRECISO** → cierra a las **23:59** del día programado |
| "Sin prórroga" (05) | **IMPRECISO** → **la entidad sí puede postergar** (64.2); el que no tiene prórroga es el postor |
| "La plataforma cierra en punto" (27) | **IMPRECISO en la forma** → el corte real es **23:59 hora peruana** |
| **"Sube tu oferta el día antes"** (27) | **IMPRECISO — no se puede.** La ventana abre a las 00:01 **de la fecha programada**. Lo correcto: tener todo listo la víspera y **subir temprano ese día** |

**Consecuencia editorial:** los dos posts se separan. **05** pasa a ser el
cronograma y sus plazos mínimos (7 días hábiles de consultas, 7 desde la
integración, 22 en total) y el hecho de que la entidad puede postergar.
**27** pasa a ser la ventana 00:01–23:59.

---

## 5 · Requisitos de calificación vs. factores de evaluación — post 07

**EXACTO.**

- **Requisitos de calificación** (art. 72): determinan si el postor puede
  ejecutar. Son **cumple / no cumple**. Son **CINCO** tipos (art. 72.3):
  capacidad legal · capacidad técnica y profesional · experiencia del postor en
  la especialidad · condiciones de participación en consorcio · capacidad
  económica (solo con precalificación).
- **Factores de evaluación** (art. 73): dan el **puntaje**, y están *"…
  establecidos en las bases integradas"* (art. 73.1, literal) — lo que refuerza
  el post 06.
- Puntaje total = 100; el factor oferta económica **no puede superar 40**
  (art. 75.1).

**Post 07 se conserva**, anclando que los factores viven en las bases
integradas.

---

## 6 · Los filtros: EL ORDEN CAMBIÓ — post 16

El post traía el orden del régimen anterior. **Regl. art. 70.2**, *literal*,
para la evaluación sin precalificación:

> *"a) Admisión de las ofertas. b) **Revisión de los requisitos de
> calificación**. c) Evaluación técnica. d) Evaluación económica."*

Es decir: **la calificación va ANTES de la evaluación**, y son **cuatro**
subetapas, no tres. Y el **art. 72.2**: *"Los evaluadores revisan los
requisitos de calificación de **las ofertas que sean admitidas**"* — o sea, de
**todas las admitidas**, no solo del primer lugar (que era la regla de la Ley
30225).

Además, **admisión** ya no es "cumple todo lo pedido": el art. 71 dice que es
*"la verificación de los documentos mínimos señalados en el numeral 69.1"*, que
son cuatro (art. 69.1): acreditación de la representación de quien suscribe,
pacto de integridad, declaración jurada de veracidad y de no estar impedido, y
promesa de consorcio si aplica.

**Post 16 → IMPRECISO en el orden y en el contenido de cada filtro. Se
reescribe** a: admisión → calificación → evaluación técnica → evaluación
económica.

---

## 7 · Subsanación de ofertas — post 12

El post acertó el marco ("depende del documento") y **falló el criterio**.
Regl. **art. 78**:

- **78.1**: los **evaluadores** pueden pedir subsanar una omisión o corregir un
  error material o formal, *"siempre que no alteren su contenido esencial"*. Es
  **preclusiva a cada etapa** y se hace **por la Pladicop**.
- **78.2**, *literal*: *"Son subsanables los documentos emitidos por entidades
  públicas o privadas ejerciendo función pública, **o la omisión de su
  presentación**, siempre que hayan sido emitidos con anterioridad a la fecha
  establecida para la presentación de ofertas, tales como autorizaciones,
  permisos, títulos, constancias, certificaciones y/o documentos que acrediten
  estar inscrito o integrar un registro…"*
- **78.3**: los errores aritméticos (precios unitarios, esquema mixto, pago por
  consumo, tarifas) los corrigen **de oficio los evaluadores**, y esa corrección
  **no varía los precios unitarios ofertados**.
- **78.4**: plazo de **dos días hábiles** desde el día siguiente de la
  notificación, **ampliable dos días hábiles más** a solicitud del postor.

| Lámina del post 12 | Veredicto |
|---|---|
| "Depende del documento" | **EXACTO** |
| "Algunos documentos se subsanan / el comité da un plazo corto" | **IMPRECISO** → lo piden **los evaluadores** (no "el comité"), y el plazo es de **2 días hábiles** (+2 a pedido) |
| "Tu oferta económica no cambia / el precio queda firme" | **EXACTO** |
| **"No se agrega lo que faltó / subsanar no es completar la oferta"** | **IMPRECISO — es lo contrario.** El art. 78.2 admite expresamente **la omisión de presentación** |

**La regla real y publicable:** es subsanable **el papel que ya existía antes de
la fecha de ofertas** (una licencia, un certificado, una constancia), aunque lo
hayas omitido. **No es subsanable** lo que se fabricaría después ni nada que
cambie el fondo de la oferta.

---

## 8 · Buena pro: publicación, consentimiento y firma — posts 09, 14, 18

- **Art. 80**: el otorgamiento de la buena pro *"es el acto que declara al
  postor ganador… y se publica a través de la Pladicop"*, **con los documentos
  que sustentan los resultados de calificación y evaluación**. → ganador,
  monto y sustento son públicos. **EXACTO** para los posts 09 y 18.
  *Precisión operativa:* en el buscador público del SEACE el ganador y el monto
  **no salen en la grilla de resultados** — hay que abrir la ficha del proceso
  ("Ver contratos").
- **Art. 82** (texto vigente): con dos o más ofertas, el consentimiento se
  produce y registra en la Pladicop **al día siguiente de vencido el plazo para
  apelar** sin que nadie haya apelado. **Con una sola oferta, el mismo día de la
  notificación** del otorgamiento.
- **Art. 90.1**: el ganador presenta los requisitos para perfeccionar el
  contrato **dentro de 8 días hábiles** desde el día siguiente al registro del
  consentimiento. **90.2**: **5 días hábiles** si no se exige garantía de fiel
  cumplimiento. **90.3**: el contrato se perfecciona en ≤3 días hábiles; si hay
  observaciones, hasta 4 días hábiles para subsanar.

**Post 14 → EXACTO en la estructura**; se mejora con el número verificado
(**8 días hábiles**). **Post 18 → EXACTO**: venderle al contratista que ganó no
exige RNP ni procedimiento de selección, porque esa venta es entre privados.

---

## 9 · Verificación posterior de lo declarado — post 15

El post usa el nombre del régimen anterior. Hoy hay **dos figuras distintas**:

1. **Verificación posterior a la oferta ganadora** (Regl. **art. 83**) — la que
   le importa al postor. La hace **la DEC de la entidad**, **dentro de los 10
   días hábiles posteriores al consentimiento de la buena pro**, sobre los
   documentos de la oferta **del ganador** que no consten en su **Ficha Única de
   Proveedor (FUP)**. **No es un muestreo: si ganaste, te revisan.** Si hay
   falsedad o inexactitud: **nulidad** de la buena pro o del contrato (83.2) y
   **comunicación obligatoria al TCP** (83.3).
2. **Fiscalización posterior de la información del RNP** (Regl. **art. 35**) —
   ésa sí la hace **el OECE por muestreo**, sobre lo registrado en el RNP.

**Sanciones** (Ley arts. 87 y 90): información inexacta → inhabilitación
temporal; documentos falsos o adulterados → inhabilitación temporal más larga.
El **RNP incluye la relación de proveedores sancionados por el TCP de los
últimos cinco años**, de **acceso público** (Ley art. 92.6; Regl. art. 22).

**Post 15 → IMPRECISO en el nombre y en el momento** ("después de recibir tu
oferta" → es **después del consentimiento de la buena pro**, y solo al ganador).
El resto es **EXACTO**.

---

## 10 · Experiencia del postor — post 10

Verificado contra las **bases estándar vigentes de Licitación Pública para
bienes** (RD 0001-2026-EF/54.01), sección "Experiencia del postor en la
especialidad", *literal*:

- **Monto facturado acumulado** por la venta de bienes iguales o similares
  **durante los diez años anteriores** a la presentación de ofertas, computados
  **desde la fecha de la conformidad o de emisión del comprobante de pago**.
  *(La ventana de servicios es distinta: no extrapolar sin leer las bases de
  concurso público.)*
- El monto exigido **no puede ser mayor a tres veces la cuantía** de la
  contratación o del ítem.
- **MYPE**: cuando el ítem corresponde a modalidad abreviada, la experiencia
  exigida **no debe superar el 25% de la cuantía** (Regl. art. 131 + bases).
- Se acredita con **máximo veinte contrataciones**, por **(i)** contratos u
  órdenes de compra **y su respectiva conformidad o constancia de prestación**;
  **o (ii)** comprobantes de pago **cuya cancelación se acredite documental y
  fehacientemente**.
- **La trampa que casi nadie sabe**, *literal*: *"En caso el postor sustente su
  experiencia en la especialidad mediante contrataciones realizadas con
  privados, para acreditarla debe presentar de forma obligatoria lo indicado en
  el numeral (ii)…; no es posible que acredite su experiencia únicamente con la
  presentación de contratos u órdenes de compra con conformidad o constancia de
  prestación."*

**Post 10 → EXACTO en todo lo que afirma, pero incompleto justo donde se
pierde.** Se incorpora la regla del comprobante pagado para clientes privados y
el dato de los **diez años**.

---

## 11 · Quién evalúa tu oferta — post 20

**El "comité de selección" ya no existe.** Regl. **art. 56.1**: los
procedimientos competitivos están a cargo de **evaluadores** de tres tipos:

- **Oficial de compra**: comprador público de la DEC. **Una sola persona**
  (art. 58).
- **Comité**: **tres integrantes**, al menos uno comprador público de la DEC y
  uno experto con conocimiento técnico del objeto. Actúa y evalúa **de forma
  colegiada**, con responsabilidad solidaria (art. 59.4).
- **Jurado**: tres o cinco expertos en el objeto (art. 60).

Quién actúa depende del procedimiento: en **subasta inversa electrónica** y
**comparación de precios** evalúa **el oficial de compra** — **una persona**;
en licitación pública de bienes y concurso público de servicios la entidad
**puede elegir** entre oficial de compra o comité; el comité o el jurado son
obligatorios en obras, bienes especializados, consultorías y procedimientos con
precalificación. En los **procedimientos no competitivos** no hay evaluadores.

**Post 20 → IMPRECISO: su afirmación central ("a tu oferta la revisa un comité,
no una persona") es falsa en varios procedimientos. Se reescribe.**

**Lo que sí se sostiene y es el verdadero valor del post:** quien evalúe lo hace
**contra las bases integradas**, el mismo documento público que descarga
cualquier postor (arts. 55.1 y 66.4), y el resultado se publica con los
documentos que lo sustentan (art. 80).

---

## 12 · Contratos menores (≤8 UIT) — post 21

**Ley art. 34.1**, *literal*: *"Se consideran **contratos menores** a aquellos
celebrados por las entidades contratantes cuyos montos sean iguales o
inferiores a ocho Unidades Impositivas Tributarias (UIT), vigentes al momento
de la contratación, **y que no requieren procedimientos de selección** para su
contratación. Los contratos menores se encuentran sujetos a la supervisión del
OECE."* Art. 34.2: las entidades **publican en la Pladicop** su información.

**Regl. art. 226.2**, *literal*: *"Las entidades contratantes, a través de la
DEC, están obligadas a registrar en la Pladicop la información de los contratos
menores, **desde las actuaciones preparatorias hasta la ejecución del último
pago**."* → **NO es un registro ex post.**

**Regl. art. 228.2**, *literal* — y esto cambia el post: *"La DEC, **a través de
la Pladicop, solicita y recibe cotizaciones de proveedores que cuenten con RNP
y pertenezcan al rubro** del objeto de la contratación y selecciona una oferta
que cumpla con el requerimiento conforme al principio del valor por dinero."*

El contrato menor se perfecciona con la **notificación de una orden de compra o
de servicio por la Pladicop** (228.4), y sus actuaciones **no son impugnables**
(art. 303.b).

| Lámina del post 21 | Veredicto |
|---|---|
| "Hasta ocho UIT / no hay proceso de selección" | **EXACTO en el fondo**; impreciso en "queda fuera": hoy es una modalidad regulada dentro de la ley |
| "La entidad pide cotizaciones directo al proveedor que ubica" | **IMPRECISO** → las pide **por la plataforma, a proveedores con RNP del rubro** |
| **"Ahí no se postula / el registro se publica después"** | **IMPRECISO** → sí hay vía de entrada: **estar en el RNP, en tu rubro**; y el registro es de todo el ciclo, no posterior |
| "Sirve para ver quién compra lo tuyo" | **EXACTO** (art. 34.2) |

*(La UIT 2026 es S/ 5,500 según DS 301-2025-EF → 8 UIT = S/ 44,000. **No se
imprime la cifra en las láminas**: la UIT cambia cada año y un post evergreen
la dejaría vencida.)*

---

## 13 · Recurso de apelación — post 17

- **Contra qué** (Ley art. 73.1): solo después del **otorgamiento de la buena
  pro**, la **declaración de desierto**, o resultados en catálogos de acuerdo
  marco. Se impugnan actos **anteriores al perfeccionamiento del contrato**
  (art. 72.2).
- **Lo que NO es impugnable** (Regl. art. 303) — el post decía lo contrario:
  **las bases y/o su integración NO son impugnables** (303.c); tampoco las
  actuaciones preparatorias (a), los contratos menores (b), el registro de
  participantes (d), la negociación y el diálogo competitivo (e), ni los
  procedimientos no competitivos (g).
- **Plazo** (Regl. art. 304): **8 días hábiles** siguientes a la notificación
  del otorgamiento de la buena pro por la plataforma; **5 días hábiles** en
  concurso público abreviado, licitación pública abreviada, selección de
  expertos, comparación de precios y subasta inversa electrónica (salvo que la
  cuantía sea de LP/CP, donde vuelve a 8).
- **Ante quién** (Ley art. 74.1): el **Tribunal (TCP)** cuando la cuantía
  **supera las 50 UIT**; la **autoridad de la gestión administrativa de la
  entidad** en los demás casos.
- **Garantía** (Regl. art. 309): **3% de la cuantía** del procedimiento o del
  ítem impugnado, tope 300 UIT. **MYPE: 0.5%, tope 25 UIT.**
  ⚠️ El texto original de la Ley 32069 decía "0.5% / tope 50 UIT": fue
  **sustituido por la Ley 32187 desde el 01/01/2025**. Citar 0.5% como regla
  general es citar norma derogada.

| Lámina del post 17 | Veredicto |
|---|---|
| "Una buena pro se puede cuestionar por escrito" | **EXACTO** |
| "El recurso de apelación" | **EXACTO** |
| "El plazo es corto y **está en las bases**" | **IMPRECISO** → el plazo está **en la norma**: 8 días hábiles (5 en abreviados) |
| "Se presenta con una garantía" | **EXACTO**; se precisa que la MYPE paga un porcentaje menor |
| **"Se discute lo que dicen las bases"** | **IMPRECISO — es justo lo que NO se puede impugnar** (art. 303.c) |

---

## 14 · Cobro al Estado: conformidad y pago — post 13

El post era **correcto pero vago**; la norma da los números exactos.

- **Conformidad** (Regl. arts. 144.1 y 144.3): la da **el área usuaria**, que
  verifica el cumplimiento de las **especificaciones técnicas o términos de
  referencia**. Plazo máximo: **7 días** desde el día siguiente de recibido el
  entregable; **20 días** si se requieren pruebas o si es consultoría. En
  ejecución contractual los plazos son en **días calendario** (art. 105.3).
  *"La sola recepción de bienes… no constituye la conformidad."*
- **Pago** (Ley **art. 67.3**), *literal*: *"El pago se realiza en un plazo
  máximo de **diez días hábiles** luego de otorgada la conformidad por parte
  del área usuaria y es prorrogable, previa justificación de la demora, por
  **cinco días hábiles**."*
- **Mora** (Ley art. 67.5): la entidad **reconoce los intereses legales**. El
  impago injustificado teniendo conformidad es **falta grave** del funcionario
  (art. 67.4).
- **No existe** plazo de pago más corto para MYPE. Lo que existe es la facultad
  de emitir **facturas negociables** (Ley art. 67.7).

**Post 13 → "el plazo de pago está escrito en el contrato y en las bases" es
IMPRECISO por omisión: el plazo lo fija la ley.** Se corrige con el número.

---

## 15 · Notificaciones por la plataforma — post 29

**EXACTO, con respaldo literal.** Ley **art. 41.4**: *"Las actuaciones y actos
realizados en la plataforma digital tienen la misma validez y eficacia que las
actuaciones y actos realizados por medios manuales, más aún los sustituyen para
todos los efectos legales. **Dichos actos se entienden notificados el mismo día
de su publicación en la citada plataforma digital**."* Para la ejecución
contractual, Regl. art. 105.1 dice lo mismo.

**Post 29 se conserva**, precisando que se notifica **el mismo día** de la
publicación (no "desde").

---

## 16 · Registro de participantes — post 30

Regl. **art. 65**, *literal*: *"El registro de participantes se realiza de forma
**gratuita** a través de la Pladicop… Para registrarse como participante, el
proveedor debe **contar con inscripción vigente en el RNP**, conforme al objeto
de la contratación."* (65.1). Va **desde el día siguiente de la convocatoria
hasta antes del inicio de la presentación de ofertas** (65.2). Hay tres tipos
de lista: **abierta**, **abierta con invitación** y **cerrada** (65.4).

Es el **participante** quien formula consultas y observaciones (art. 66.1). Y
**nada obliga a presentar oferta**: la norma distingue consistentemente
*participante* (quien se registra) de *postor* (quien oferta) — arts. 79.2 y 80.

**Post 30 → EXACTO en su afirmación central. Faltaba el requisito duro: RNP
vigente.** Se incorpora.

---

## 17 · Especificaciones técnicas y términos de referencia — post 26

**EXACTO.** Regl. **art. 126.1**, *literal*: *"El requerimiento de bienes se
plasma en especificaciones técnicas, mientras que los servicios en términos de
referencia."* El art. 63.2.e confirma que **el requerimiento va dentro de las
bases** publicadas con la convocatoria. Y el área usuaria da la conformidad
verificando el cumplimiento de esas EETT o TDR (art. 144.1): es literalmente el
documento contra el que te van a recibir.

**Única corrección, de literalidad: "cabe en una sola hoja" no es cierto** — un
requerimiento puede tener decenas de páginas, y la marca no puede permitirse
una exageración comprobable.

---

## 18 · Plan Anual de Contrataciones — posts 01 y 23

**El PAC existe, pero está en transición y perdió una propiedad clave.**

- La **Ley 32069 no menciona el PAC ni una vez**. Lo sustituye el **CMN (Cuadro
  Multianual de Necesidades)** de la PMBSO. El Reglamento solo lo nombra en
  disposiciones transitorias y define el acrónimo **"PAC del CMN"**.
- **Primera Disposición Complementaria Transitoria del DS 009-2025-EF**: *"En
  tanto se implemente el PAC del CMN, las entidades contratantes elaboran y
  aprueban su Plan Anual de Contrataciones conforme la directiva que emita la
  DGA"*. Los plazos y el contenido viven, pues, en directivas de la DGA-MEF, no
  en el Reglamento.
- **Dónde se publica**: RD 0006-2025-EF/54.01 §4.1 — la DEC *"registra y publica
  en el Seace de la Pladicop el PAC"*, más la sede digital de la entidad.
- **Qué trae por ítem** (§4.4): **tipo de procedimiento de selección, cuantía,
  mes referencial de convocatoria y cantidad de ítems**, más el objeto.
- **Se modifica durante el año** (Directiva 0007-2025-EF/54.01 art. 32.1: en
  cualquier momento del año fiscal).
- **Y aquí el cambio que importa** — RD 0006-2025-EF/54.01 **§4.5**, *literal*:
  *"Posteriormente a la actualización del PAC 2025, las entidades contratantes
  pueden convocar procedimientos de selección **sin que se encuentren incluido
  en dicho PAC, por lo cual, su inclusión no constituye un requisito para
  convocar**."*

Bajo la Ley 30225 estar en el PAC **era condición para convocar** — por eso el
PAC funcionaba como predictor cerrado. Hoy **no lo es**.

**Veredicto:** el contenido de los posts 01 y 23 es **EXACTO** (el plan es
público, trae objeto, tipo de procedimiento, cuantía y mes referencial, y se
modifica), pero **ambos daban a entender que el PAC agota el universo de lo que
la entidad comprará. Eso es IMPRECISO.** Se corrige en el post 23 con la
lámina "también convocan lo no planeado", y el post 01 deja de afirmar que los
requisitos ya vienen decididos en el plan.

*(Ojo de vigencia: la RD 0006 está redactada para la transición del PAC 2025.
Se cita como está; el enunciado publicable — "estar en el plan no es requisito
para convocar" — se sostiene sobre ese texto.)*

---

## 19 · Registro de Visitas en Línea — post 19

- **Norma**: **Ley N° 28024** (gestión de intereses), modificada por los DL 1353
  y DL 1415, **reglamentada por el DS N° 120-2019-PCM** (no por el "DS
  003-2019-JUS", que no tiene relación).
- **DS 120-2019-PCM art. 3.9**, *literal*: *"Registro de Visitas en Línea: Es la
  plataforma en donde se registra y publica información, **en tiempo real**, de
  las visitas que reciben los funcionarios y servidores del Estado… **Esta
  información es pública y debe estar contenida en formato de datos abiertos
  reutilizables**."*
- **Qué exige publicar** (art. 13.1): fecha · identificación del visitante ·
  persona natural o jurídica a la que pertenece o representa · **motivo de la
  visita** · funcionario visitado · **cargo y oficina** · lugar · **hora de
  ingreso y salida**. Motivos tipificados (13.2): reunión de trabajo, provisión
  de servicios, gestión de intereses, otros.
- **Alcance**: entidades del art. I del Título Preliminar de la Ley 27444 más
  las empresas del Estado; **excluye** las funciones jurisdiccionales y los
  tribunales administrativos. **No decir "todas las entidades" sin el matiz.**
- Consulta pública, sin cuenta: `visitas.servicios.gob.pe/consultas/`.

| Lámina del post 19 | Veredicto |
|---|---|
| "Un registro público **y diario**" | **IMPRECISO por defecto** → la norma exige **tiempo real** |
| "Cada entidad lo publica por ley" | **IMPRECISO por exceso** → casi todas, con exclusiones |
| "Quién entró y a quién visitó, con fecha, hora y oficina" | **EXACTO**; se puede sumar el **motivo** |
| "No dice nada de lo que se conversó" | **EXACTO** — el motivo es una categoría tipificada, no el contenido |

---

## 20 · Consulta Amigable del MEF — post 24

Verificado en vivo, **sin cuenta y sin pago**:
`https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx`.

- **Columnas reales**: `PIA · PIM · Certificación · Compromiso Anual ·
  Ejecución (Atención de Compromiso Mensual, Devengado, Girado) · Avance %`.
- Nota oficial del propio MEF: *"La columna Avance % representa la razón del
  Devengado entre el PIM, expresado en porcentajes."* y *"La información se
  actualiza diariamente."*
- Navegación: quién gasta · en qué · con qué se financia · cómo se estructura ·
  **dónde** · cuándo. Años 1999–2026. Exporta a Excel.

**Veredicto: IMPRECISO** decir que "muestra cuánto le falta gastar" una
entidad. **PIM − Devengado no es saldo contratable**, por cuatro razones:

1. Buena parte del PIM **no se contrata**: planillas, pensiones,
   transferencias, servicio de deuda. Lo contratable vive en las genéricas
   **2.3 Bienes y Servicios** y **2.6 Adquisición de Activos No Financieros**.
2. El saldo puede estar ya **certificado y comprometido** — el propio aplicativo
   muestra esas columnas porque ese dinero ya tiene dueño contractual.
3. El PIM **se modifica** durante el año.
4. Parte simplemente **no se ejecuta** y revierte al cierre.

**Post 24 → se corrige**: muestra lo asignado y lo ya ejecutado; el saldo hay
que leerlo en la genérica de bienes y servicios y descontando lo comprometido.

---

## 21 · Datos públicos de resultados — posts 09, 22, 18

- **Consulta pública sin cuenta: confirmada** en
  `prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/buscadorPublico.xhtml`.
- **Ganador y monto**: **no salen en la grilla de resultados**; están en la
  **ficha del proceso**, pestaña "Ver contratos" (`Número del Contrato ·
  Descripción · Fecha de Perfeccionamiento · Fecha de Publicación · Monto
  Contratado · Situación`), con "Contratista" como criterio de búsqueda.
- **Contar postores**: el acta va como **PDF adjunto** a la ficha; la vía limpia
  y masiva es el dataset abierto del OECE **"Listado de ofertantes"**
  (*"personas naturales y jurídicas que presentaron ofertas desde el año 2018,
  correspondiente a procesos adjudicados"*), descargable en Excel por año.
  Licencia **ODC-By**.
- **Límite legal**: art. 79.1 — durante la evaluación no se da a conocer
  información; art. 79.2 — el **expediente de contratación** completo es
  accesible a **participantes y postores**, no al público general, y **excluye
  las ofertas no admitidas**. Lo público es el acto de buena pro y sus
  documentos de sustento.
- **Desierto** (art. 84.1): un procedimiento queda desierto cuando **no se
  reciben ofertas, no existe ninguna oferta válida, o no se perfecciona el
  contrato**.

**Posts 09, 22 y 18 → EXACTOS con precisión operativa**: se dice "la ficha del
proceso" y "los datos abiertos del OECE" en vez de sugerir que el buscador
devuelve ganadores en lista.

---

## 22 · Los que no dependían de la Ley 32069

| Post | Mecanismo | Veredicto |
|---|---|---|
| 11 | Carpeta que se repite (RNP activo, poderes, conformidades) | **EXACTO**; consistente con la falacia #2 (dice "RNP activo", no "vigente hasta") |
| 25 | Cierre del año fiscal | **IMPRECISO en la aritmética**: en septiembre no "queda un trimestre" (quedan cuatro meses). Y "las entidades aprietan su plan" es una afirmación de comportamiento **no verificable**: se sustituye por el hecho verificable de que un procedimiento tiene **plazos mínimos por norma** y por eso el calendario aprieta solo |
| 28 | Ruta de entrada: RUC activo y habido → RNP → buscar el rubro → cotizar | **EXACTO**; el RNP como requisito está confirmado en los arts. 22.2, 65.1 y 228.2 |

---

## 23 · Índice de veredictos (los 30)

| # | Post | Veredicto | Qué pasó |
|---|---|---|---|
| 01 | planeada-meses-antes | **IMPRECISO (1 lámina)** | "los requisitos ya vienen decididos en las bases" contradecía el post 06 y el art. 66.5 |
| 02 | cotiza-antes | **IMPRECISO (3 láminas)** | nombre del mecanismo, "valor estimado", "portal de la entidad" |
| 03 | descarta-en-3-minutos | **IMPRECISO (1 lámina)** | "mira el valor estimado": no se publica |
| 04 | valor-estimado | **IMPRECISO de raíz** | post reemplazado: la cuantía y cuándo sí se conoce |
| 05 | cronograma-con-hora | **IMPRECISO (3 láminas)** | "fecha y hora", "sin prórroga" |
| 06 | bases-integradas | **EXACTO** | solo pulido |
| 07 | mejor-no-suma | **EXACTO** | se ancla "bases integradas" |
| 08 | anexos-listos | **IMPRECISO (1 lámina)** | la firma se **acredita** (art. 69.1.a) |
| 09 | precio-que-gano | **IMPRECISO (2 láminas)** | "monto estimado"; se añade el 40/100 |
| 10 | experiencia-contratos | **EXACTO pero incompleto** | falta la regla del comprobante pagado en clientes privados |
| 11 | carpeta-una-vez | **EXACTO** | sin cambios |
| 12 | subsanacion | **IMPRECISO (2 láminas)** | la omisión **sí** es subsanable; plazo = 2 días hábiles |
| 13 | cobrar-al-estado | **IMPRECISO por omisión** | el plazo de pago lo fija la ley: 10 días hábiles |
| 14 | antes-de-firmar | **EXACTO** | se concreta el plazo: 8 días hábiles |
| 15 | declaracion-jurada | **IMPRECISO (2 láminas)** | nombre y momento de la verificación |
| 16 | tres-filtros | **IMPRECISO de raíz** | el orden real es admisión → calificación → evaluación |
| 17 | apelacion | **IMPRECISO (2 láminas)** | plazo (está en la norma) y "se discute lo que dicen las bases" |
| 18 | vendele-al-ganador | **EXACTO** | solo foto |
| 19 | registro-visitas | **IMPRECISO (1 lámina)** | "diario" → tiempo real |
| 20 | comite-de-seleccion | **IMPRECISO de raíz** | puede ser una sola persona |
| 21 | compras-menores | **IMPRECISO (2 láminas)** | no es ex post; se cotiza por la plataforma con RNP |
| 22 | cuantos-compiten | **EXACTO con precisión** | dónde se cuenta de verdad |
| 23 | pac-de-tu-entidad | **IMPRECISO (1 lámina)** | el PAC no agota lo que se convoca |
| 24 | consulta-amigable | **IMPRECISO de raíz** | PIM − Devengado ≠ "lo que falta gastar" |
| 25 | cierre-del-ano | **IMPRECISO (2 láminas)** | aritmética del trimestre + claim de comportamiento |
| 26 | tdr-o-eett | **EXACTO** | cae la exageración "una sola hoja" |
| 27 | cierre-en-punto | **IMPRECISO de raíz** | ventana 00:01–23:59; no se puede subir el día antes |
| 28 | ferreteria | **EXACTO** | sin cambios |
| 29 | notificaciones-seace | **EXACTO** | se precisa "el mismo día" |
| 30 | registrarse-no-obliga | **EXACTO pero incompleto** | faltaba el RNP vigente |

---

## 24 · Lo que quedó NO VERIFICABLE (y por eso no se publica)

- **La ventana de años de experiencia en SERVICIOS.** Se verificaron las bases
  estándar de **licitación pública para bienes** (diez años). Las de concurso
  público de servicios, obras y consultoría de obras tienen reglas propias que
  no se leyeron. Por eso la lámina del post 10 dice "en bienes".
- **El número de cotizaciones recibidas en un contrato menor**: la norma exige
  que se soliciten y reciban por la plataforma, pero no se verificó que el
  conteo sea un campo de consulta pública. **No se afirma en ningún post.**
- **Si existe un DS modificatorio del Reglamento posterior al 09.01.2026.** El
  consolidado del OECE (refrescado ~17/08/2026) no recoge ninguno, y hay un
  proyecto en evaluación CMCR durante 2026 sin publicar. Revisar antes de la
  próxima ronda: `gob.pe/institucion/mef/colecciones/66745`.
- **Cifras de mercado** (cuántos procesos, cuánto se adjudica, cuántos quedan
  desiertos). No se consultó la base propia en esta pasada, así que **ningún
  post de septiembre publica una cifra agregada**.
- **UIT en soles**: verificada (S/ 5,500 · DS 301-2025-EF), pero **no se imprime
  en láminas** porque cambia cada año y los posts son evergreen.

---

## 25 · Fuentes primarias

**Normativa**
- Ley N° 32069 consolidada al 19.07.2026 —
  `https://cdn.www.gob.pe/uploads/document/file/9295551/6444155-ley-general-de-contrataciones-publicas-con-modificaciones-posteriores-hasta-el-19-07-2026.pdf`
- Reglamento (DS 009-2025-EF) consolidado al 09.01.2026 —
  `https://cdn.www.gob.pe/uploads/document/file/7594705/6444155-reglamento-de-la-ley-general-de-contrataciones-publicas-con-modificaciones-posteriores-hasta-el-09-01-2026.pdf`
- Compendio oficial OECE —
  `https://www.gob.pe/institucion/oece/colecciones/45029-ley-n-32069-ley-general-de-contrataciones-publicas-y-su-reglamento`
- DS 001-2026-EF (modifica el Reglamento) —
  `https://www.gob.pe/institucion/mef/normas-legales/7601483-001-2026-ef`
- RD 0001-2026-EF/54.01 (bases estándar vigentes) —
  `https://www.gob.pe/institucion/mef/normas-legales/7614342-001-2026-ef-54-01`
- Bases estándar de Licitación Pública para bienes (.docx) —
  `https://cdn.www.gob.pe/uploads/document/file/9281716/7614342-1-bases-estandar-licitacion-publica-para-bienes.docx`
- RD 0006-2025-EF/54.01 (lineamientos PAC) —
  `https://cdn.www.gob.pe/uploads/document/file/7814390/6594506-rd0006_2025ef5401.pdf`
- Directiva 0007-2025-EF/54.01 (PMBSO / CMN) —
  `https://cdn.www.gob.pe/uploads/document/file/8209539/6861651-directiva0007_2025ef5401.pdf`
- DS 301-2025-EF (UIT 2026) —
  `https://www.gob.pe/institucion/mef/normas-legales/7540449-301-2025-ef`
- DS 120-2019-PCM (Registro de Visitas) —
  `https://cdn.www.gob.pe/uploads/document/file/338023/DS_N__120-2019-PCM.pdf`
- Ley 28024 (gestión de intereses) —
  `https://cdn.www.gob.pe/uploads/document/file/530446/LEY_N%C2%BA_28024-gestion-intereses.pdf.pdf`

**Plataformas**
- Buscador público SEACE —
  `https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/buscadorPublico.xhtml`
- Consulta Amigable MEF —
  `https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx`
- Registro de Visitas en Línea — `https://visitas.servicios.gob.pe/consultas/`
- Datos abiertos OECE, "Listado de ofertantes" —
  `https://www.datosabiertos.gob.pe/dataset/listado-de-ofertantes-%E2%80%93-organismo-especializado-para-las-contrataciones-p%C3%BAblicas-eficientes`
- Proveedores sancionados (RNP) —
  `https://www.rnp.gob.pe/consultasenlinea/inhabilitados/busqueda.asp`

---

## 26 · Pendiente para Carlos (fuera del alcance de esta tarea)

`brands/radarestatal/BRAND.md` debe actualizarse: las falacias **#3, #4 y #9**
y la tabla de vocabulario. Esta tarea solo tocó `posts/sep.json` y este
documento, así que la ficha de marca sigue diciendo "valor estimado ≠ valor
referencial" y "registro ex post" — y eso ya no es cierto.

---

## 27 · SEGUNDA PASADA — el lente de JUICIO EXPERTO (2026-09-01)

La auditoría normativa de arriba dejó los 30 posts EXACTOS. Esta segunda
pasada preguntó otra cosa: **«¿lo firmaría un especialista en contrataciones
que asesora MYPE, en este contexto y para este lector?»** — es decir, si el
mecanismo, además de cierto, es **completo, accionable y sin efecto dañino
aplicado literalmente**. Todo lo de abajo se resuelve contra el mismo texto
normativo ya citado en §25; no hay fuentes nuevas.

| Post | Lo que decía | Por qué un experto no lo firma | Lo que dice ahora |
|---|---|---|---|
| **17 · apelación** | «Son ocho días hábiles / desde que publican la buena pro» | Regl. art. 304: son **5 días hábiles** en concurso y licitación abreviados, selección de expertos, comparación de precios y subasta inversa. **Esos son justo los procedimientos donde compite una MYPE.** Un lector que se confíe en «ocho» pierde el derecho a apelar | «*Ocho días* desde la buena pro / Cinco en los procesos abreviados» |
| **14 · antes de firmar** | «Son ocho días hábiles / para juntar y subir todo» | Regl. art. 90.2: **5 días hábiles** si no se exige garantía de fiel cumplimiento — el caso normal de un contrato chico. Mismo riesgo de perder el plazo | «Son *ocho días hábiles* / Cinco si no te piden garantía» |
| **09 · precio que ganó** | «En licitación el precio vale 40 de 100» | Regl. art. 75.1 fija un **tope**, no un valor: el factor económico *"no puede superar"* 40 puntos. Las bases pueden ponerle 30. Decirlo como cifra fija es una imprecisión que esta marca no puede permitirse | «El precio pesa 40 puntos como máximo» |
| **13 · cobrar al Estado** | «Te pagan en diez días hábiles» | Ley art. 67.3 es un **plazo máximo**, además prorrogable cinco días con justificación. Presentarlo como promesa de cobro es planificarle mal el flujo de caja al proveedor | «El plazo es de *diez días hábiles* / Máximo, desde que hay conformidad» |
| **06 · bases integradas** | «Los **postores** hacen consultas» | Regl. art. 66.1: las formulan los **participantes** registrados, y el post 30 de la misma serie enseña justamente esa distinción. Término incorrecto y contradicción interna de la marca | «QUIÉN PREGUNTA · El *participante* registrado / Solo él puede hacer consultas» |
| **02 · cotiza antes** | Última lámina: «Sabes qué está por comprar / y llegas con papeles listos» | Era una re-promesa del beneficio de la portada, y omitía **el único riesgo real de cotizar**: la cuantía se calcula a partir de esa interacción con el mercado (Regl. art. 53.1), así que un precio tirado al piso se convierte en el techo que tendrás que batir | «CUIDADO · No tires el precio *al piso* / Ese número entra en el cálculo» |
| **21 · compras menores** | «Tener RNP en tu rubro / **ahí te llegan** esas solicitudes» | Regl. art. 228.2 dice que la DEC **solicita** cotizaciones por la Pladicop a proveedores con RNP del rubro; no dice que lleguen solas ni que estar inscrito baste. Un lector que se inscribe y espera, no vende | «Por ahí las piden las entidades» |
| **28 · ferretería** | «Paso 4: cotizarle a entidades chicas / municipios y colegios del distrito» | El canal del contrato menor es **la plataforma**, no la puerta de la municipalidad (art. 228.2) — y así el post contradecía al post 21 de la misma serie. Además el requisito operativo es el **rubro correcto en el RNP** | «Apuntar a *municipios y colegios* / Con el rubro correcto en tu RNP» |
| **03 · descarta en 3 minutos** | Portada: «todos están en la primera pantalla» | Tres de los cuatro datos sí (aviso de convocatoria, Regl. art. 63.2), pero **la experiencia requerida vive dentro de las bases**. Falso para el cuarto ítem del propio post | «Antes de leerte las bases enteras» |
| **19 · registro de visitas** | Cierre: «el «radar» revisa esos registros **a diario**» | La lámina de valor ya decía «en tiempo real» (DS 120-2019-PCM art. 3.9), corregido en §19 — y el cierre repetía el error viejo dos láminas después | «El «*radar*» sigue esos registros por ti» |

**Intactos: 20 de 30.** Los mecanismos de PAC, cuantía, cronograma, requisitos
vs. factores, anexos, experiencia, carpeta, subsanación, verificación
posterior, los cuatro filtros, quién evalúa, cuántos compiten, buena pro,
venderle al ganador, Consulta Amigable, cierre fiscal, EETT/TDR, ventana
00:01–23:59, notificaciones y registro de participante sobreviven el lente
experto sin cambio.

> Pendiente que sigue abierto (§26): `brands/radarestatal/BRAND.md` todavía
> tiene las falacias #3, #4 y #9 desactualizadas.
