# TikTok — escaneo 2026-08-15 (ronda 3)

Comparado contra `TIKTOK-STATS-2026-08-12.md`. Fuente: `tools/tiktok_scan.mjs`.
Los posts del 14 y 15 tienen horas de vida, no días: léelos como señal débil.

## Lo que hay que saber

**1. El rediseño del trimestre no levantó nada; en dos cuentas hundió la banda.**

| marca | banda previa | 12-ago | 14-ago | 15-ago |
|---|---:|---:|---:|---:|
| comehometag | 120-500 | 620 | 432 | **1976** / 172 |
| radarestatal | 500-790 | 515 | 394 | 0* |
| propaga | 570-650 | 582 | 284 | 21* |
| qolca | 550-620 | **104** | **103** | — |
| diplomy | 230-570 | 440 | 97 | 21* / 24* |

\* horas de vida (o la API reporta 0 en posts de fotos: dato desconocido, no muerto).

**2. Lo único que rompió la banda en 5 cuentas, dos veces, es el mismo marco:
la SEPARACIÓN.** No el sismo, no la noticia: *pasa algo y tú no estás con ellos.*

- `11-tiembla-sin-ti` — «¿Y si tiembla cuando NO estás con tus hijos?»
  16.9K → **27.9K**, 606 likes, **288 guardados**, **289 compartidos**, 18 comentarios.
- 15-ago, día del simulacro — «HOY 3pm tiembla todo el Perú y tus hijos no están
  contigo» → **1976** en su primer día (4× su banda).
- El hermano del mismo tema sin separación (`10-mochila-no-existe`, mochila de
  emergencia = preparación) hizo **317**. Mismo tema, mismo día, misma cuenta.

**3. El envío, no el guardado, es lo que dispara la segunda ola.** El post de
27.9K tiene **289 compartidos**. Todos los demás posts de las 5 cuentas tienen
entre 0 y 6. Los guardados no separan: los swipe files de Propaga guardan bien
(13, 8, 6) y siguen clavados en 600. Se comparte lo que le tienes que decir a
OTRA persona — y por eso el ganador funcionó: son preguntas para hacerle al
colegio.

**4. Anclar a una fecha solo funciona si la fecha ES el dolor de la marca.**
Los tres posts de Qolca colgados del Día del Niño hicieron 168 / 104 / 103
contra su banda de 550-620: **una quinta parte**. Para una marca de
automatización, el Día del Niño es una fecha prestada. Para ComeHomeTag el
sismo es su tema exacto y por eso multiplicó por 50.

**5. La cultura pop no diferencia.** Zendaya / Marvel / Iron Man / Jean Grey
caen todos clavados en la banda de su cuenta (551-628 en Qolca, 611-628 en
Propaga) y por debajo en ComeHomeTag (121-206, sus peores posts). No mata, no
salva: es relleno caro de escribir.

**6. Los mejores de Radar son revelaciones, no instructivos.** «Hay licitaciones
que se quedan SIN postores» 788 · «lo que tu competencia le vendió al Estado es
público» 638 · «el Estado publica su base completa» 695. Los procedimentales
(«sin RNP no existes», «las bases no se leen de corrido») quedan 100-200 abajo.

**7. Cero comentarios en todo agosto salvo el ganador.** El cebo «Comenta
DEPENDE» estaba pegado en los 61 posts de sep+oct de Qolca. Fuera: los 12 posts
de Qolca ya publicados suman 0 comentarios entre todos.

## Lo que se cambió con esto (2026-08-15)

- **383 captions pendientes piden un envío** (`tools/send_ask.mjs`), con la
  persona concreta rotando por marca: «mándaselo a quien recoge a tus hijos»,
  «al que contesta tu WhatsApp», «a tu socio de consorcio», «a quien maneja tus
  redes». Lo que varía es el destinatario, que es justo lo que hace que se mande.
- **Fuera el cebo «Comenta DEPENDE»** de los 61 posts de Qolca.
- **10 portadas reescritas al marco de separación / revelación**
  (`tools/fix_worst.mjs`), y el post del Día del Niño de ComeHomeTag rehecho
  entero: «¿Y si hoy lo lleva otro adulto al parque?» + las tres preguntas para
  el adulto que se lo lleva + el mensaje de WhatsApp para copiar.
- **Qolca desanclado de las fiestas de consumo**: `16-dia-pico` y
  `28-competencia-descansa` vuelven a su dolor de siempre.

## Lo siguiente que hay que probar

1. **La lámina de preguntas para un tercero** en todo post que la aguante: es el
   mecanismo del ganador y es lo que se comparte.
2. **Los swipe files copiables de Propaga** (sus 4 mejores por guardados, 13/8/6/5)
   no existen en el trimestre pendiente. Volverlos a meter, 1 por semana.
3. **El simulacro nacional del 13 de octubre** es la única ventana grande
   planificable que queda en el calendario. El clúster ya está armado; que las
   portadas de esos días sean todas de separación.
4. Diplomy sigue en 0 seguidores con pool global en inglés: nada de lo de arriba
   se prueba ahí hasta que tenga base.
