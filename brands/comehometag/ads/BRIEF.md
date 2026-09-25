# ComeHomeTag · la «pulsera» — brief de Meta Ads

Creatividades: `brands/comehometag/ads/out/pulsera/` (5 anuncios × 3 cortes).
Fuente de copy y layout: `brands/comehometag/ads/pulsera.json`.
Render: `python tools/render_ads.py comehometag pulsera`.
Video del mismo lote: `CLIPPING/accounts/ComeHomeTag/renders/comehometag_ad_final.mp4` (34 s, 9:16).

## Por qué estas cinco piezas y no otras

Los cinco formatos estáticos que miden mejor en respuesta directa hoy son
problema→solución, antes/después, testimonio, comparación y producto con
objeciones. El lote cubre cuatro de los cinco (el testimonio queda pendiente:
necesita un cliente real, y la marca no inventa testimonios):

| # | Pieza | Formato DR | Para qué momento |
|---|---|---|---|
| 01 | `01-frase` | problema→solución | frío. La frase del video como gancho |
| 02 | `02-ningun-numero` | problema→solución | frío. Mismo dolor, otro ángulo (memoria) |
| 03 | `03-comparacion` | antes/después | frío-templado. El mecanismo en una imagen |
| 04 | `04-pasos` | explicativo | templado. Mata «no entiendo cómo funciona» |
| 05 | `05-objeciones` | producto + objeciones | retargeting. Mata «y si se le acaba la batería» |

Se suben los cinco JUNTOS en un solo ad set, más el video. Cada uno atrae a
una persona distinta y Meta aprende de quién hace clic en cuál: esa es la
segmentación real. Mínimo de creativos por ad set: 3 a 5. Refresco: cada
14 a 21 días, o el costo por resultado sube por fatiga.

## Cortes

- `_4x5` (1080×1350) — feed de FB e IG. El caballo de batalla.
- `_1x1` (1080×1080) — marketplace, columna derecha, algunos placements.
- `_9x16` (1080×1920) — Reels y Stories. El 90 % del inventario de Meta es
  vertical; el texto de estas piezas ya respeta la zona segura de abajo.

Se suben los tres y se deja Advantage+ placements elegir.

## Copy por anuncio

Registro fijado por Carlos (2026-09-19): **directo y en segunda persona**, «tu
hij@», el producto nombrado en la portada. Nada de rodeos ni de tercera persona:
el anuncio dice qué es y para qué sirve en la primera línea.

> Riesgo asumido: Meta puede rechazar por «atributos personales» el anuncio que
> da por sabido que el lector tiene hijos. Si cae uno, lo primero que se cambia
> es esa línea de texto, no la foto.

**01 · la frase** — `«No encuentro a mi mamá»`
- Texto: Un niño perdido no sabe explicar dónde vive ni a quién llamar. Con esta pulsera lleva tu número puesto: quien lo encuentre escanea el código con su celular y te llama al instante. Sin app, sin batería.
- Titular: La pulsera lleva tu número puesto
- Descripción: Delivery a todo el Perú · Pago contra entrega
- CTA: Más información

**02 · el número** — `Tu hij@ debe llevar tu número consigo`
- Texto: Los números ya nadie los sabe de memoria, están en el celular. Tu hij@ no tiene ni el celular ni tu número. Esta pulsera lo lleva por él: se escanea con la cámara de cualquier celular y te llaman.
- Titular: Usa esta pulsera y te llaman
- Descripción: Se configura en minutos desde comehometag.com
- CTA: Más información

**03 · comparación** — `Esta pulsera ayuda a que tu hij@ pueda encontrarte si se pierde`
- Texto: Sin pulsera, quien encuentra a tu hij@ no sabe cómo llamarte. Con pulsera, apunta la cámara al código y te llama. Esa es toda la diferencia.
- Titular: Escanean la pulsera y te llaman
- Descripción: Delivery a todo el Perú · Pago contra entrega
- CTA: Comprar

**04 · los 3 pasos** — `Así te encuentra tu hij@ si se pierde`
- Texto: Cómo funciona: tu hij@ sale con la pulsera puesta, quien lo encuentra la escanea con su celular, y te llama o te escribe al instante. Sin app, sin batería, sin mensualidad.
- Titular: Así te encuentra si se pierde
- Descripción: Configúrala en minutos
- CTA: Comprar

**05 · producto** (retargeting) — `Pulsera para proteger a tu hij@`
- Texto: Silicona resistente y código único. Lleva tu número y tu contacto, se escanea con cualquier celular y no necesita app ni batería. Delivery a todo el Perú y pago contra entrega.
- Titular: Pulsera para proteger a tu hij@
- Descripción: Pago contra entrega
- CTA: Comprar

## Campaña

```
Campaña: Ventas (o Clientes potenciales si cierra por WhatsApp)
└── 1 ad set  ← NO partir por género ni interés
    Perú · 25-50 · todos los géneros
    Advantage+ Audience, sin sugerencias de interés
    Advantage+ placements
    Optimización: Compras (o Conversaciones)
    └── 6 anuncios: 01, 02, 03, 04, 05 + el video
Campaña 2 (día 14): retargeting, 15-20 % del presupuesto, solo la pieza 05
    Audiencias: visitantes 30 d · video-viewers 50 % · engagement IG/FB 365 d
```

Un solo ad set porque el targeting detallado dejó de ser filtro y pasó a
sugerencia: hoy segmenta el píxel y el creativo. Partir el presupuesto en
cuatro ad sets solo retrasa el aprendizaje (cada uno necesita ~50 conversiones
por semana para salir de él).

**Antes de gastar un sol:** píxel de Meta + **API de Conversiones** (el píxel
solo pierde eventos en iOS), con ViewContent, AddToCart y Purchase probados en
Test Events. Sin eventos reales, la segmentación automática no tiene de qué
aprender y el presupuesto se quema en clics baratos que no compran.

## Día y hora

**Pauta: 24/7 los primeros 14 días.** El dayparting exige presupuesto total en
lugar de diario, y cortar horas antes de tener datos mutila el aprendizaje.

- Arranque: **martes o miércoles entre 8 y 10 a.m. (hora Perú)** — los días de
  aprendizaje caen en días laborales completos y el fin de semana llega con la
  campaña estabilizada. Evitar viernes tarde y domingo.
- Primera revisión: **día 7**. Nada de apagar anuncios el día 2.
- Día 14: desglose por **Hora (zona horaria de la cuenta)**. Si el costo por
  resultado se concentra en franjas claras, recién ahí presupuesto total +
  programación.

**Orgánico del mismo material:** en Perú, Facebook rinde mejor **jueves a
sábado de 1 a 4 p.m.**; segunda ventana 7 a 9 p.m. En IG el video corto va
mejor 7-9 p.m. entre semana.

## Checklist de política (categoría sensible: niños)

- [ ] «tu hij@» va a propósito (decisión de Carlos). Es el punto más
      probable de rechazo: si cae un anuncio, esa línea primero.
- [ ] Cero cifras sin fuente sobre niños perdidos.
- [ ] No dramatizar secuestro ni mostrar a un adulto llevándose al niño.
- [ ] No prometer seguridad absoluta: la pulsera ayuda a que lo devuelvan, no
      evita que se pierda. Prometer de más también trae reclamos.
- [ ] Web con los mismos precios y condiciones que el anuncio, y política de
      privacidad visible.
- [ ] Si rechazan: apelar una vez tal cual; si vuelve a caer, cambiar el
      TITULAR antes que la imagen — casi siempre es el texto.

## Nota sobre las fotos

Las tres tomas del centro comercial (`ads/shots/`) son IA, generadas para el
video. Viven fuera de `photos/` a propósito: el pool curado es CC0 y la regla
de carruseles es cero IA (−61 % de likes medido en orgánico). En pauta el
criterio es otro — la imagen no compite en el FYP y estas tomas son la escena
exacta del video, así que el anuncio y el video cuentan lo mismo. Si aparece
material real de clientes, reemplaza a estas: el contenido estilo UGC rinde
mejor que la foto de estudio pulida.
