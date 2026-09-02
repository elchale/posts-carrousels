# MAPA DE DEMANDA DE BÚSQUEDA — 7 marcas (2026-09-01)

> Objetivo: que cada post apunte a una búsqueda que **existe de verdad**, no a
> una que suena bien. Esto es la aproximación más cercana a Creator Search
> Insights que se puede construir desde fuera de la app.
>
> **Todo número en este documento salió de una petición real hecha hoy.** Donde
> un método falló, lo dice. No hay ninguna cifra estimada, redondeada "a ojo" ni
> traída de memoria.

---

## 0 · El veredicto en cinco líneas

1. **El autocompletar de TikTok es la mina.** El endpoint público de sugerencias
   responde sin login, sin firma y sin límite práctico (1.500+ peticiones hoy,
   **0 errores**). Cada sugerencia es una consulta que la gente escribió. De ahí
   salieron **24.093 términos únicos** para las 7 marcas.
2. **El endpoint de hashtags de TikTok da el lado de la OFERTA con números
   reales** (nº de videos y de vistas por etiqueta). Demanda ÷ oferta = el
   content gap deja de ser intuición y pasa a ser una división.
3. **Radar Estatal es el mayor hueco del portafolio, y no está cerca.** La
   demanda está verificada (`como ser proveedor del estado` autocompleta en
   posición 0 con 10 continuaciones) y la oferta es literalmente de dos cifras:
   **#adjudicacionsimplificada = 6 videos. #comprasestatales = 54.
   #proveedordelestado = 310.**
4. **Dos supuestos del brief son falsos y hay que corregirlos ya:**
   `seace` escrito solo NO es una consulta viva en TikTok (autocompleta a
   *"se acerca mi cumpleaños"*), y `open badges` tampoco (autocompleta a *"event
   badges"*, *"open badge fun"*). **#openbadges: 67 videos, 14.1K vistas — 211
   vistas por video. Es una etiqueta muerta.** Las dos palabras siguen valiendo
   como texto indexable, pero no como hashtag ni como gancho.
5. **Hay etiquetas-trampa: mucho volumen de videos y casi ningún reparto.**
   `#businessautomation` (80.000 videos, **1.100 vistas/video**),
   `#clientmanagement` (1.700), `#certificateofcompletion` (1.600),
   `#identificacionmascota` (458). Publicar ahí es publicar en un cementerio.

---

## 1 · Método — qué funcionó y qué no

| Método | Estado | Qué dio |
|---|---|---|
| **TikTok autocompletar** `www.tiktok.com/api/search/general/sug/` | ✅ **FUNCIONA** | La fuente principal. Sin login, sin firma. Parámetros `app_language` + `region` → sugerencias localizadas (es/PE, en/US). 1.500+ peticiones, 0 errores, 0 bloqueos. |
| **TikTok autocompletar** `.../search/general/preview/` | ✅ Funciona | Devuelve lo mismo que `sug/` con menos metadatos. Redundante. |
| **TikTok hashtags** `www.tiktok.com/api/challenge/detail/` | ✅ **FUNCIONA** | `statsV2` → `videoCount` y `viewCount` exactos por etiqueta. Es el lado de la oferta. |
| **Google autocompletar** `suggestqueries.google.com/complete/search` | ✅ Funciona | `hl=es&gl=PE` / `hl=en&gl=US`. Buen contraste: lo que se busca en Google pero no en TikTok (y al revés) es señal. |
| **YouTube autocompletar** (`client=youtube&ds=yt`) | ✅ Funciona | Aporte marginal; casi todo ya salía de los otros dos. |
| **Google Trends** `trends.google.com/trends/api/*` | ✅ **FUNCIONA con truco** | A pelo devuelve **429**. Con una petición previa a `/trends/explore` para tomar la cookie de sesión, responde entero: series temporales + *top* y *rising related queries*. Es la única fuente con noción de volumen relativo real. |
| **TikTok Creative Center** `ads.tiktok.com/creative_radar_api/*` | ❌ **BLOQUEADO** | Todos los endpoints (`popular_trend/hashtag/list`, `top_ads`) devuelven `{"code":40101,"msg":"no permission"}`. Exige cabeceras firmadas (`user-sign` calculado en el cliente) más sesión de anunciante. No se pudo entrar. |
| **tikwm.com** | ❌ Bloqueado | Cloudflare challenge en todo el dominio. |
| **`hot_level` / `is_time_sensitive`** (campos del autocompletar) | ❌ **Siempre 0** | Existen en la respuesta pero llegan vacíos en peticiones anónimas — incluso para consultas obviamente calientes. **No son un indicador de volumen.** No fiarse de ellos. |
| **Búsqueda web** (WebSearch, DuckDuckGo, Bing, Mojeek, SearXNG) | ❌ Agotado / bloqueado | Cuota de WebSearch consumida; los buscadores HTML devolvieron CAPTCHA o resultados basura. Por eso la sección de Creator Search Insights (§10) va marcada como conocimiento del modelo, no como fuente recuperada hoy. |
| **Metricool «+114% búsqueda / −59% sonido»** | ⚠️ **NO VERIFICADO** | La página del estudio 2026 sí carga y sí confirma la muestra (**2.314.756 posts de más de 92.000 cuentas**, publicado 12-05-2026) y un dato: **la FYP genera 7 de cada 10 vistas**. Los porcentajes concretos de búsqueda/sonido están detrás del formulario de descarga y **no se pudieron confirmar**. Trátalos como hipótesis del brief, no como dato citable en un post (regla dura: cero cifras sin fuente). |

### Cómo se calculó el ranking

Para cada marca se tomaron 12 semillas, y de cada semilla se lanzaron **1 + 26
consultas** (la semilla, y la semilla + cada letra del alfabeto) más 5 prefijos de
pregunta (`cómo`, `qué hacer si`, `dónde`, `cuánto cuesta`, `mejor` / `how to`,
`best`, `what is`…). Son 384 consultas por marca. Cada sugerencia devuelta suma
un punto a su término.

**`score = 3×(veces que salió en TikTok) + 2×(YouTube) + 1×(Google) + 2 si apareció en el top-3`**

El score **no es volumen de búsqueda**. Es *cobertura*: cuántas rutas de escritura
distintas llevan a ese término. Un término que aparece cuando escribes 30 cosas
diferentes es un término al que TikTok manda tráfico desde muchos sitios. Es el
mejor sustituto disponible de la "search popularity" de CSI, pero es un sustituto.

### La prueba de fuego (columna `Prueba`)

Al final se verificó cada candidata escribiéndola **completa** en el autocompletar:

- **EXACT@0** = TikTok devuelve la frase literal como primera sugerencia → es una
  consulta viva y frecuente. Es la mejor señal que hay sin CSI.
- **pre=N** = N de las 10 sugerencias *empiezan* por tu frase → la gente escribe
  eso y sigue escribiendo. `pre` alto = tema con muchas ramas que cubrir.
- **rel=N/10** = N sugerencias contienen todas tus palabras.
- **Sin EXACT y rel bajo** = la frase **no** es una consulta real. No la uses de
  línea 1. (Ej.: `como responder a un cliente en instagram` → rel 0/10.)

---

## 2 · Cómo leer las tablas de oferta (hashtags)

`vistas/video` es la métrica que importa, no el total de vistas.

- **>15K vistas/video** = TikTok reparte bien en esa etiqueta.
- **3K–15K** = normal.
- **<3K** = etiqueta muerta o secuestrada por spam. **No usar.**

Y `nº de videos` es la competencia. La combinación ganadora es **vistas/video
alto + nº de videos bajo**: demanda servida con hambre.

---

# COMEHOMETAG (es-PE)

**3.602 términos únicos.** Tres audiencias que en búsqueda se comportan distinto.

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `mi perro se escapo` | 98 | TT×31, G×3 | — | 🔴 **ALTA** |
| 2 | `como encontrar mi perro` | 95 | TT×30, G, YT | — | 🔴 **ALTA** |
| 3 | `mascota perdida` | 95 | TT×30, G, YT | — | 🔴 **ALTA** |
| 4 | `como encontrar a mi perro perdido` | 77 | TT×25 | **EXACT@0, pre=9** | 🔴 **ALTA** |
| 5 | `que hacer si se pierde mi perro` | — | TT verif. | **EXACT@0, pre=5** | 🔴 **ALTA** |
| 6 | `se perdio mi perro que hago` | 71 | TT×23 | **EXACT@0** | 🔴 **ALTA** |
| 7 | `mi perro se escapo que hago` | 74 | TT×24 | **EXACT@0** | 🔴 **ALTA** |
| 8 | `perro perdido lima` | — | TT verif. | **EXACT@1, pre=10** | 🔴 **ALTA** |
| 9 | `encontrar mi perro perdido` | 84 | TT×27, G | — | 🔴 ALTA |
| 10 | `se busca mascota perdida` | 77 | TT×25 | — | 🔴 ALTA |
| 11 | `como evitar que mi perro se pierda` | — | TT verif. | **EXACT@0** | 🟡 Preventiva |
| 12 | `perro se asusta con cohetes` | — | TT verif. | **EXACT@0** | 🔴 **ALTA (estacional)** |
| 13 | `pulsera de identificacion para niños` | 80 | TT×26 | **EXACT@0, pre=5** | 🟠 Comercial |
| 14 | `pulsera de seguridad para niños` | 83 | TT×27 | (sale de la anterior) | 🟠 Comercial |
| 15 | `pulsera de identificacion lima peru` | 77 | TT×25 | — | 🟠 **Comercial local** |
| 16 | `pulsera para identificacion adultos mayores` | 80 | TT×26 | — | 🟠 Comercial |
| 17 | `placa para perro personalizada` | 70 | TT×22, G×2 | — | 🟠 Comercial |
| 18 | `placa de identificación para mascotas` | 77 | TT×25 | pre=3 | 🟠 Comercial |
| 19 | `placa para perro lima` | 68 | TT×22 | — | 🟠 **Comercial local** |
| 20 | `placa para perro peru` | 59 | TT×19 | — | 🟠 **Comercial local** |
| 21 | `identificacion mascota` | 89 | TT×29 | — | 🟠 Comercial |
| 22 | `collar identificacion mascota` | 80 | TT×26 | — | 🟠 Comercial |
| 23 | `microchip para perro` | — | TT verif. | **pre=9** (`…arequipa`, `cuanto cuesta…`) | 🟠 Comercial |
| 24 | `abuelo con alzheimer` | 86 | TT×27, G, YT | — | 🔵 Info/emocional |
| 25 | `abuelo con alzheimer se pierde` | — | TT verif. | **EXACT@0** | 🔴 **ALTA** |
| 26 | `como identificar a mi mascota` | — | TT verif. | **EXACT@0** | 🟡 Preventiva |
| 27 | `encontre a mi perro` / `encontraron un perro` | 84 / 78 | TT×28 / ×26 | — | 🔵 Info (el que ENCUENTRA) |
| 28 | `perro perdido año nuevo` | — | TT verif. | **EXACT@1** | 🔴 **ALTA (estacional)** |
| 29 | `mascotas collar peru` | 78 | TT×26 | — | 🟠 Comercial local |
| 30 | `alzheimer` | — | **Google Trends PE 59,7/100** | — | 🔵 Info |

**Google Trends Perú, 12 meses (0–100 relativo dentro del grupo):**
`codigo QR` 72,6 · `alzheimer` 59,7 · `collar para perro` 7,2 · `perro perdido`
3,5 · `placa para perro` 1,9 · `mascota perdida` 0,2 · `niño perdido` 0,7 ·
`se perdio mi perro` **0** · `identificacion mascota` **0**.

**Lectura:** en Google el problema casi no se busca (nadie googlea con el perro
perdido; sale a la calle). En TikTok sí, y muchísimo. Es exactamente la
migración del brief: **este nicho vive en la búsqueda de TikTok, no en Google.**
`Rising` de alzheimer: `día mundial del alzheimer` +50% → **21 de septiembre**.

## Oferta (hashtags, medida hoy)

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #niñoperdido | 2.8K | 155.1M | **55.9K** 🟢 |
| #seguridadinfantil | 16.6K | 532.6M | **32.1K** 🟢 |
| #alzheimer | 550.9K | 14.6B | 26.6K |
| #ninoperdido (sin ñ) | 110 | 2.3M | **20.8K** 🟢 |
| #perroperdido | 14.0K | 246.4M | 17.7K |
| #mascotasperu | 15.2K | 263.4M | 17.4K |
| #perrosdelima | 166 | 2.8M | **17.1K** 🟢 |
| #adultomayor | 168.6K | 2.8B | 16.5K |
| #perritoperdido | 8.3K | 104.4M | 12.6K |
| #perroperdidoperu | 171 | 1.9M | 11.3K |
| #tenenciaresponsable | 55.2K | 564.9M | 10.2K |
| #placaparaperro | 687 | 5.6M | 8.1K |
| #collarparaperro | 1.3K | 9.1M | 6.9K |
| #cuidadordealzheimer | 40 | 265.8K | 6.6K |
| #miperroseescapo | **19** | 111.7K | 5.9K |
| #mascotaperdida | 7.7K | 41.2M | 5.3K |
| #placasparamascotas | 3.2K | 8.3M | 2.6K ⚠️ |
| #pulseraidentificacion | **16** | 20.1K | 1.3K ⚠️ |
| #abueloconalzheimer | **14** | 18.5K | 1.3K ⚠️ |
| #identificacionmascota | 30 | 13.7K | **458** 🔴 muerta |
| #qrmascota | **2** | 868 | 434 🔴 muerta |

*(#codigoqr, #pulseraseguridadninos y #perrospeloc no devolvieron datos.)*

## Content gaps

1. **`abuelo con alzheimer se pierde` — el gap más grande de la marca.**
   `abuelo con alzheimer` tiene detrás 550.9K videos y 14.6B vistas… de contenido
   *emocional*. La frase de seguridad autocompleta EXACT@0 y
   **#abueloconalzheimer tiene 14 videos.** Todo el volumen está en la emoción;
   cero está en el problema.
2. **Todo lo local peruano.** `perro perdido lima` autocompleta con **10 de 10**
   continuaciones, pero la lista se llena de *Limache* (Chile). #perroperdidoperu:
   171 videos. #perrosdelima: **166 videos con 17.1K vistas/video.** Nadie sirve
   Lima y Lima está buscando.
3. **`pulsera de identificacion lima peru` / `pulsera de seguridad para niños`.**
   Demanda comercial verificada, y **#pulseraidentificacion tiene 16 videos.**
   El producto para niños no existe en TikTok Perú.
4. **La contaminación por Minecraft.** `que hacer si se pierde mi perro` trae de
   2ª sugerencia *"…en minecraft"*, e igual `como encontrar a mi perro perdido`.
   Cuando un videojuego se cuela en el top-3 de una consulta angustiosa, es que el
   contenido humano escasea tanto que el algoritmo rellena con lo que hay.
5. **La estacionalidad de los cohetes.** `perro se asusta con cohetes` EXACT@0 y
   `perro perdido año nuevo` EXACT@1. Dos picos anuales (28-jul y 31-dic) donde
   la demanda se dispara y el producto es la respuesta exacta. **Publicar 10 días
   ANTES, no el mismo día.**
6. **`microchip para perro`: pre=9, con `cuanto cuesta ponerle microchip a perro`.**
   Es la comparación que decide la compra, y nadie la está haciendo en Perú.
7. **El que ENCUENTRA al perro.** `encontre a mi perro`, `encontraron un perro`,
   `encontre a este perro` puntúan alto y son una audiencia entera sin atender:
   el vecino que halló un perro y no sabe qué hacer. Es el otro lado de la placa.
8. **#niñoperdido: 55.9K vistas/video con 2.8K videos** — el mejor reparto del
   nicho entero. Zona sensible: entrar por prevención y protocolo, nunca por el
   caso concreto de un menor real.

## Recomendación

**Línea 1 de caption (la búsqueda literal va al frente):**

- Mascotas: `Qué hacer si se pierde tu perro en [Lima / año nuevo / 28 de julio]:`
- Niños: `Pulsera de identificación para niños: qué debe llevar y qué no —`
- Abuelos: `Si tu abuelo con alzhéimer se pierde, esto es lo que haces primero:`

**Hashtags de nicho (2, según el carril):**

- Mascotas → **#perroperdido + #mascotasperu** (o **#perrosdelima** para local)
- Niños → **#seguridadinfantil + #niñoperdido**
- Abuelos → **#alzheimer + #adultomayor**

**No usar:** #identificacionmascota, #qrmascota, #placasparamascotas (muertas).
La palabra "QR" va en el TEXTO de la lámina, nunca de hashtag.

---

# QOLCA (es-PE, negocio)

**2.496 términos únicos.** El hallazgo aquí es de vocabulario, y cambia el copy.

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `como organizar un negocio de tienda` | 173 | TT×57 | — | 🔴 **ALTA** |
| 2 | `como organizarme en mi emprendimiento` | 158 | TT×52 | — | 🔴 **ALTA** |
| 3 | `como organizar mi negocio` | 134 | TT×44 | **EXACT@0, pre=9** | 🔴 **ALTA** |
| 4 | `sistema de inventario para negocio` | 127 | TT×42, G | **EXACT@0, pre=9** | 🟠 **Comercial** |
| 5 | `como ordenar mi negocio` | 114 | TT×36, G×2, YT | **EXACT@0, pre=9** | 🔴 **ALTA** |
| 6 | `como llevar el control de mi negocio` | — | TT verif. | **EXACT@0, pre=10** | 🔴 **ALTA** |
| 7 | `ventas por whatsapp business` | 102 | TT×32, G×2, YT | **EXACT@0, pre=10** | 🟠 Comercial |
| 8 | `como automatizar mi negocio` | 94 | TT×30, G×2 | **EXACT@0, pre=10** | 🟠 **Comercial** |
| 9 | `inventario negocio` | 98 | TT×32 | — | 🟠 Comercial |
| 10 | `clientes insoportables whatsapp` | 95 | TT×31 | — | 🔵 Info/humor |
| 11 | `control de pedidos en excel` | 92 | TT×29, G, YT | **EXACT@0, pre=6** | 🔴 **ALTA** |
| 12 | `excel para mi negocio` | — | TT verif. | **EXACT@0, pre=8** | 🔴 **ALTA** |
| 13 | `automatizar mi negocio con ia` | 86 | TT×27, G×3 | — | 🟠 Comercial |
| 14 | `programa para cotizaciones` | 86 | TT×28 | — | 🟠 **Comercial** |
| 15 | `pagina para cotizaciones` | 86 | TT×28 | — | 🟠 Comercial |
| 16 | `como hacer inventario de tu negocio` | 89 | TT×29 | — | 🔴 ALTA |
| 17 | `como llevar el inventario de mi negocio pequeño` | 83 | TT×27 | — | 🔴 ALTA |
| 18 | `negocio desordenado` | — | TT verif. | **EXACT@0, pre=5** | 🔵 **Info (el dolor)** |
| 19 | `organizar mi emprendimiento en excel` | 83 | TT×27 | — | 🔴 ALTA |
| 20 | `organizar mi emprendimiento con ia` | 83 | TT×27 | — | 🟠 Comercial |
| 21 | `organizar mi emprendimiento app gratuita` | 83 | TT×27 | — | 🟠 **Comercial** |
| 22 | `automatizar mi negocio precio` | 83 | TT×27 | — | 🟠 **Comercial** |
| 23 | `como administrar un negocio pequeño` | 80 | TT×26 | — | 🔵 Info |
| 24 | `aplicacion para inventario de negocio` | 78 | TT×26 | — | 🟠 Comercial |
| 25 | `hacer cotizaciones clientes` | 80 | TT×26 | — | 🔴 ALTA |
| 26 | `atender clientes por whatsapp` | — | TT verif. | **EXACT@0** | 🔵 Info |
| 27 | `chatbot whatsapp gratis` | 90 | TT×28, G×2, YT | — | 🟠 Comercial |
| 28 | `procesos empresariales` | 78 | TT×26 | — | 🔵 Info |
| 29 | `sistema para negocio de ventas` | 80 | TT×26 | — | 🟠 Comercial |
| 30 | `ventas por whatsapp 2026` | 80 | TT×26 | — | 🟠 Comercial |

**Google Trends Perú:** `inventario` 75,7 · `crm` 68,8 · `cotizacion` 65,0 (ojo:
su *top related* es `cotizacion dolar` — la palabra suelta está secuestrada por el
tipo de cambio, **nunca usarla sola**) · `whatsapp business` 63,2 ·
`chatbot` 16,8 · `facturacion electronica` 15,2 · `automatizacion` 11,3 ·
`control de inventario` 3,2 · `inteligencia artificial para negocios` **0**.
**Rising:** `n8n` +200% · `que es chatbot y para que sirve` +1.250% ·
`software de facturacion electronica` +180% · `hubspot crm gratis` +400%.

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #pymesperu | 1.4K | 36.3M | **26.6K** 🟢 |
| #chatbotwhatsapp | 1.0K | 13.2M | **13.0K** 🟢 |
| #negociosperu | 10.2K | 104.6M | 10.2K |
| #inventario | 88.5K | 885.4M | 10.0K |
| #ventasporwhatsapp | 6.5K | 59.5M | 9.2K |
| #controldeinventario | 3.0K | 26.4M | 8.8K |
| #pymes | 175.4K | 1.5B | 8.7K |
| #automatizacion | 115.6K | 969.9M | 8.4K |
| #emprendedoresperu | 24.0K | 166.6M | 6.9K |
| #whatsappbusiness | 37.0K | 246.4M | 6.7K |
| #emprendimientoperu | 38.2K | 251.3M | 6.6K |
| #cotizaciones | 48.1K | 311.1M | 6.5K |
| #gestiondenegocios | 3.0K | 19.7M | 6.5K |
| #n8n | 65.8K | 378.3M | 5.8K |
| #procesos | 441.7K | 2.5B | 5.6K |
| #erp | 101.9K | 546.8M | 5.4K |
| #digitalizacion | 10.3K | 36.7M | 3.6K |
| #iaparanegocios | 16.5K | 55.5M | 3.4K ⚠️ |
| #automatizacionn8n | **1** | 1.2K | — |

## Content gaps

1. **El vocabulario está mal: la gente NO busca "automatizar procesos".**
   Busca **`organizar`** y **`ordenar`**. `como organizar mi negocio` (EXACT@0,
   pre=9) y `como ordenar mi negocio` (EXACT@0, pre=9) le ganan de calle a
   `procesos` en TikTok, mientras Google Trends pone `automatizacion` en 11/100 e
   `inteligencia artificial para negocios` en **0**. **Es el hallazgo más
   accionable de Qolca: cambiar la palabra de ENTRADA de "automatizar/procesos" a
   "organizar / ordenar / llevar el control", sin tocar el posicionamiento** — el
   producto sigue siendo automatización de procesos, solo se nombra como el
   cliente lo nombra.
2. **La verticalización está libre.** `como organizar mi negocio` continúa a
   `…de ropa`, `…de abarrotes`, `…desde cero`; `excel para mi negocio` a
   `…de ropa`, `…de comida`. Un post por rubro, con la palabra del rubro en la
   lámina 1. Encaja con la doctrina de abrir con los nichos como menciones.
3. **Excel es la puerta, no el enemigo.** `control de pedidos en excel` EXACT@0
   pre=6; `organizar mi emprendimiento en excel` score 83. Quien busca eso ya
   aceptó que tiene un problema de orden. **#excel: 864K videos con 24.9K
   vistas/video.** El post "lo que Excel sí puede y dónde se rompe" está pedido.
4. **La intención de compra está desatendida.** `automatizar mi negocio precio`,
   `organizar mi emprendimiento app gratuita`, `programa para cotizaciones`,
   `sistema de inventario para negocio gratis / peru / 2026`: fondo de embudo puro,
   con #controldeinventario en 3.0K videos y #gestiondenegocios en 3.0K.
   *(Regla dura: el post no menciona precios. Puede responder "cuánto cuesta esto"
   con criterios, sin cifra propia.)*
5. **#pymesperu: 26.6K vistas/video con 1.400 videos.** El mejor reparto del nicho
   y casi vacío. #iaparanegocios, en cambio, tiene 16.5K videos y 3.4K
   vistas/video: la etiqueta de IA está saturada de ruido.
6. **`negocio desordenado` EXACT@0, pre=5** — el dolor tiene nombre propio y
   autocompleta solo. Es la portada literal.
7. **n8n sube +200% en Trends Perú** con 65.8K videos ya en TikTok. Ventana corta:
   la ola existe, pero se está llenando rápido.

## Recomendación

**Línea 1:** `Cómo organizar un negocio de [ropa / abarrotes / comida] sin vivir en Excel:`
(variantes verificadas: `Cómo ordenar mi negocio pequeño`, `Cómo llevar el control
de mi negocio desde el celular`.)

**Hashtags:** **#pymesperu + #negociosperu**
Por tema: **#controldeinventario** (inventario) o **#cotizaciones** (ventas).
**Cuidado con #ventasporwhatsapp**: reparte bien (9.2K) pero empuja el
posicionamiento hacia "te contesta el WhatsApp", que es justo lo prohibido. Úsalo
solo si la lámina deja claro que lo que se automatiza es el proceso.
**Evitar:** #iaparanegocios.

---

# PROPAGA (es-PE)

**2.911 términos únicos.**

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `redes sociales para emprendedores` | 188 | TT×62 | — | 🔵 Info |
| 2 | `calendario de contenido redes sociales` | 159 | TT×52, G | **EXACT@0, pre=10** | 🟠 **Comercial** |
| 3 | `marketing para negocio en instagram` | 152 | TT×50 | — | 🔵 Info |
| 4 | `no se que publicar` | — | TT verif. | **EXACT@0, pre=10** | 🔴 **ALTA** |
| 5 | `que publicar en mi negocio de comida` | 83 | TT×27 | **pre=9** (fb, uñas, crochet, flores) | 🔴 **ALTA** |
| 6 | `redes sociales para empresas` | 119 | TT×39 | — | 🔵 Info |
| 7 | `como publicar tu negocio` | 102 | TT×34 | — | 🔴 ALTA |
| 8 | `como vender por instagram desde cero` | 99 | TT×30, G×5, YT | **EXACT@0** | 🔴 **ALTA** |
| 9 | `buscar clientes por instagram` | 98 | TT×32 | — | 🔴 **ALTA** |
| 10 | `como crecer en instagram negocios` | 98 | TT×32 | — | 🔴 ALTA |
| 11 | `publicidad para tu negocio instagram` | 98 | TT×32 | — | 🟠 Comercial |
| 12 | `ideas de contenido para mi negocio` | — | TT verif. | **pre=10** (digital, con ia, de comida) | 🔴 **ALTA** |
| 13 | `como hacer post para mi negocio` | 93 | TT×31 | — | 🔴 ALTA |
| 14 | `marketing para emprendedores 2026` | 95 | TT×31 | — | 🔵 Info |
| 15 | `redes sociales para negocios pequeños` | 85 | TT×26, G×5 | **EXACT@0** | 🔵 Info |
| 16 | `redes sociales para negocios locales` | 88 | TT×27, G×5 | — | 🔵 Info |
| 17 | `redes sociales para negocios perú` | 83 | TT×27 | — | 🔵 **Info local** |
| 18 | `redes sociales para negocios cusco` | 83 | TT×27 | — | 🔵 **Info local** |
| 19 | `ideas para publicaciones emprendimiento` | 89 | TT×29 | — | 🔴 ALTA |
| 20 | `como empezar un negocio en instagram` | 90 | TT×30 | — | 🔵 Info |
| 21 | `musica para publicar mi negocio` | 86 | TT×28 | — | 🟡 Táctico |
| 22 | `como vender por instagram ropa` | 84 | TT×27 | — | 🔴 ALTA |
| 23 | `como vender por instagram en peru` | 83 | TT×27 | — | 🔴 **ALTA local** |
| 24 | `como vender por instagram stories` | 83 | TT×27 | — | 🟡 Táctico |
| 25 | `cuantas veces publicar al dia` | — | TT verif. | pre=2, rel=7/10 (`…en tiktok`, `…en instagram`) | 🟡 Táctico |
| 26 | `como hacer que tu reels se haga viral` | 83 | TT×27 | — | 🔵 Info |
| 27 | `como hacer reels en tiktok` | 82 | TT×26, YT | — | 🟡 Táctico |
| 28 | `que publicar en mi negocio que esta empezando` | 83 | TT×27 | — | 🔴 ALTA |
| 29 | `mi negocio no vende que hago` | — | TT (sugerencia) | — | 🔴 **ALTA** |
| 30 | `contenido para redes sociales de la iglesia` | 83 | TT×27 | — | 🔵 Nicho lateral |

**Google Trends Perú:** `emprendedores` 61,6 · `redes sociales` 59,6 ·
`marketing digital` 21,3 · `publicidad en facebook` 8,2 · `community manager` 4,5 ·
`ideas de contenido` 0,5 · `instagram para negocios` **0** ·
`tiktok para negocios` **0** · `como vender por internet` **0**.
**Rising:** `parrilla de contenidos para redes sociales` +180% ·
`calendario community manager 2026` (Aumento) · `clases de marketing digital gratis` +600%.

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #tiktokparanegocios | 17.2K | 379.4M | **22.1K** 🟢 |
| #ideasdecontenido | 29.5K | 438.3M | **14.9K** 🟢 |
| #redessociales | 1.1M | 15.6B | 13.9K |
| #clientes | 1.6M | 21.4B | 13.3K |
| #contenidoparanegocios | 2.1K | 27.3M | **13.1K** 🟢 |
| #reels | 60.2M | 719.3B | 11.9K |
| #negociosperu | 10.2K | 104.6M | 10.2K |
| #emprendimiento | 20.5M | 166.0B | 8.1K |
| #communitymanager | 291.3K | 2.3B | 7.8K |
| #emprendedoresperu | 24.0K | 166.6M | 6.9K |
| #socialmediamanager | 821.1K | 5.4B | 6.6K |
| #marketingparaemprendedores | 28.2K | 184.6M | 6.5K |
| #calendariodecontenido | 2.2K | 14.0M | 6.5K |
| #instagramparanegocios | 12.8K | 64.2M | 5.0K |
| #copywriting | 168.2K | 819.1M | 4.9K |
| #marketingdigital | 7.5M | 35.8B | 4.8K ⚠️ |
| #publicidadenfacebook | 1.4K | 6.2M | 4.4K |
| #marketingperu | 2.8K | 11.8M | 4.3K |

## Content gaps

1. **`que publicar en mi negocio de [rubro]` es una fábrica de posts.** El
   autocompletar devuelve nueve continuaciones distintas: **fb, uñas, comida,
   crochet, flores, "que está empezando", viernes**. Cada una es un post
   independiente, con búsqueda propia y competencia casi nula. Es el gap más
   explotable de la marca y el más barato de producir.
2. **`no se que publicar`: EXACT@0 con pre=10.** La frase exacta del dolor,
   escrita por el propio usuario. Portada literal, sin adornos.
3. **#marketingdigital es una trampa:** 7,5M de videos y **4.8K vistas/video**.
   #tiktokparanegocios tiene 435× menos videos y **4,6× más reparto** (22.1K).
   Si Propaga usa la etiqueta grande por costumbre, está eligiendo la peor.
4. **Local sin servir:** `redes sociales para negocios perú` y `…cusco`,
   `como vender por instagram en peru`. #marketingperu: 2.8K videos.
5. **`calendario de contenido`**, con `parrilla de contenidos` +180% en Trends y
   #calendariodecontenido en apenas 2.2K videos. Además es formato guardable por
   naturaleza — encaja con la doctrina de guardados.
6. **Ojo con la frase equivocada:** `como responder a un cliente en instagram` dio
   **rel 0/10** — no es consulta viva. Lo que sí existe es
   `como le quiero responder al cliente` y `como responder a un comentario en ig`.
   Reformular ese ángulo antes de escribirlo.
7. **`musica para publicar mi negocio`** (score 86) es demanda pura y encaja
   exactamente con la palanca de IG ya documentada en ESTRATEGIA-VIRAL (música →
   elegible para la pestaña Reels). Post de utilidad con el producto detrás.

## Recomendación

**Línea 1:** `Qué publicar en tu negocio de [uñas / comida / ropa / flores] esta semana:`
(alternativa en frío: `No sabes qué publicar. Esto es lo que sí funciona en [rubro]:`)

**Hashtags:** **#tiktokparanegocios + #ideasdecontenido**
Local: cambiar el segundo por **#negociosperu**.
**Evitar:** #marketingdigital como etiqueta principal.

---

# RADAR ESTATAL (es-PE)

**4.141 términos únicos. La marca con el gap más grande del portafolio.**

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `como ser proveedor del estado` | — | TT verif. + **GT top 98/100** | **EXACT@0, pre=10** | 🔴 **ALTA** |
| 2 | `licitacion` | 179 | TT×59 | — | 🔵 Info |
| 3 | `rnp registro de proveedores` | 116 | TT×38 | — | 🔴 **ALTA** |
| 4 | `licitaciones estado` | 110 | TT×36 | — | 🔴 ALTA |
| 5 | `constancia de rnp` | — | TT verif. + **GT top 100/100** | **EXACT@0, pre=9** | 🔴 **ALTA** |
| 6 | `licitaciones peru` | 104 | TT×33, G, YT | **EXACT@1** | 🔴 ALTA |
| 7 | `perú compras` | 104 | TT×33, G, YT | — | 🟡 Herramienta |
| 8 | `contrataciones del estado` | 98 | TT×31, G, YT | — | 🔵 Info |
| 9 | `venderle al estado peruano` | 95 | TT×31 | **EXACT@0** | 🔴 **ALTA** |
| 10 | `como ganar una licitacion publica` | 92 | TT×29, G, YT | **EXACT@0, pre=4** | 🔴 **ALTA** |
| 11 | `proveedores del estado peru` | 97 | TT×31, G×2 | — | 🔴 ALTA |
| 12 | `certificado seace` | — | TT verif. | **EXACT@0, pre=5** | 🔴 **ALTA** |
| 13 | `subasta inversa electronica` | — | TT verif. + GT top 100 | **EXACT@0, pre=9** | 🔵 Info técnica |
| 14 | `como buscar licitaciones del estado` | — | TT verif. | **EXACT@0, pre=4** | 🔴 **ALTA** |
| 15 | `registro nacional de proveedores del estado` | 84 | TT×26, G×4 | pre=8 | 🔴 ALTA |
| 16 | `adjudicacion simplificada que es` | 85 | TT×27, G×2 | **EXACT@0** | 🔵 Info |
| 17 | `nueva ley de contrataciones del estado` | — | TT verif. + **GT rising: Aumento** | **EXACT@0** | 🔴 **ALTA (caliente)** |
| 18 | `contrataciones del estado 2026` | 86 | TT×27, G, YT | — | 🔴 **ALTA (caliente)** |
| 19 | `adjudicacion simplificada ley 30225` | 84 | TT×27, G | — | 🔵 Info técnica |
| 20 | `perú compras como participar` | 83 | TT×27 | **EXACT@0** | 🔴 **ALTA** |
| 21 | `proveedores del estado consulta` | 85 | TT×27, G×2 | **EXACT@0** | 🟡 Herramienta |
| 22 | `como cotizar al estado` | — | TT verif. | **EXACT@0** | 🔴 **ALTA** |
| 23 | `licitaciones del estado servicio` | 83 | TT×27 | — | 🔴 ALTA |
| 24 | `venderle al estado muebles` / `…ropas` | 83 | TT×27 | — | 🔴 **ALTA por rubro** |
| 25 | `proveedores del estado huancayo` | 83 | TT×27 | — | 🔴 **ALTA local** |
| 26 | `registro nacional de proveedores como se hace` | 83 | TT×27 | — | 🔴 ALTA |
| 27 | `como ver las licitaciones del estado` | 84 | TT×27, G | — | 🔴 ALTA |
| 28 | `licitaciones peru 2026` | 83 | TT×27 | — | 🔴 ALTA |
| 29 | `contrataciones del estado 30269` (nº de ley) | 83 | TT×27 | — | 🔵 Info técnica |
| 30 | `proveedores del estado exitosos` | 83 | TT×27 | — | 🔵 Info |

**Google Trends Perú:** `seace` 77,8 · `contrataciones del estado` 64,3 ·
`rnp` 58,1 · `osce` 39,9 · `proveedor del estado` 5,0 · `licitaciones` 3,0 ·
`perú compras` 1,7 · `subasta inversa` 1,5 · `adjudicacion simplificada` **0**.
**Top related:** `seace 3.0` (100), `seace buscador` (92), `rnp constancia` (100),
`rnp consulta` (93), `imprimir rnp` (62), `como ser proveedor del estado` (98),
`requisitos para ser proveedor del estado` (27).
**Rising (calientes AHORA):** `reglamento de la ley de contrataciones del estado
2026` **(Aumento)** · `nueva ley de contrataciones del estado 2026` **(Aumento)** ·
`ley de contrataciones del estado 2026` **(Aumento)** · `proveedores sancionados
osce` +60% · `osce cuaderno de obra digital` +100%.

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #gobiernoperu | **901** | 57.9M | **64.3K** 🟢🟢 |
| #estadoperuano | 3.9K | 113.2M | **29.3K** 🟢 |
| #osce | 46.9K | 953.0M | **20.3K** 🟢 |
| #contadorpublico | 23.8K | 444.3M | 18.7K |
| #mype | 11.6K | 203.9M | **17.5K** 🟢 |
| #sunat | 224.4K | 3.2B | 14.1K |
| #concursopublico | 381.4K | 5.2B | 13.6K |
| #rnp | 10.3K | 121.3M | 11.8K |
| #seace | **2.5K** | 29.8M | 11.8K |
| #oece | 2.4K | 24.9M | 10.4K |
| #perucompras | 1.6K | 16.5M | 10.0K |
| #licitaciones | 10.8K | 93.8M | 8.7K |
| #contratacionesdelestado | 4.2K | 34.0M | 8.0K |
| #tributacion | 13.6K | 104.0M | 7.7K |
| #facturacion | 15.8K | 113.5M | 7.2K |
| #adjudicacionsimplificada | **6** | 38.7K | 6.5K |
| #subastainversa | **79** | 461.1K | 5.8K |
| #proveedordelestado | **310** | 1.3M | 4.3K |
| #mypeperu | 236 | 746.7K | 3.2K ⚠️ |
| #comprasestatales | **54** | 168.0K | 3.1K ⚠️ |
| #licitacionespublicas | 1.1K | 3.4M | 3.0K ⚠️ |
| #ventasalestado | 662 | 2.0M | 3.0K ⚠️ |
| #licitacionesperu | **100** | 249.7K | 2.5K 🔴 |

## Content gaps

1. **La categoría entera está vacía.** `como ser proveedor del estado` sale
   EXACT@0 con **10 de 10** continuaciones y es la 2ª *related query* de Google
   Perú (98/100). Del otro lado: **#proveedordelestado = 310 videos.
   #comprasestatales = 54. #adjudicacionsimplificada = 6.** No es un hueco: es
   una categoría sin ocupar. La investigación previa (COMPETENCIA.md: los rivales
   solo hacen SEO) ya lo anticipaba. **Ahora está medido.**
2. **`seace` a secas NO funciona en TikTok.** Escribirlo autocompleta a
   *"se acerca mi cumpleaños"*, *"se acerca halloween"*. En cambio
   **`certificado seace` sí (EXACT@0, pre=5)**, y en Google `seace` puntúa 77,8
   con `seace 3.0` y `seace buscador` arriba. **Regla operativa: en TikTok escribe
   la frase completa; el acrónimo solo acompañado de palabras que lo desambigüen.**
3. **La ola normativa está corriendo AHORA.** Tres consultas sobre la ley de
   contrataciones 2026 marcan *Aumento* (el nivel más alto de rising) en Trends
   Perú, y `nueva ley de contrataciones del estado` sale EXACT@0 en TikTok.
   Ventana abierta y con fecha de caducidad.
4. **`constancia de rnp`: EXACT@0, pre=9, y top-1 (100/100) del clúster RNP en
   Google.** Junto a `imprimir rnp` (62) y `rnp consulta` (93) forman el trámite
   más buscado del nicho, con **#rnp en solo 10.3K videos**. Es la puerta de
   entrada más barata que tiene la marca.
5. **#gobiernoperu: 64.3K vistas/video con 901 videos.** El mejor reparto medido
   en las siete marcas. Aviso: es un espacio político, y Radar Estatal es la única
   marca sin humor ni opinión — entrar solo con contenido informativo y
   verificable, o no entrar.
6. **La verticalización por rubro y por región está libre:** `venderle al estado
   muebles`, `…ropas`, `licitaciones del estado servicio`, `proveedores del estado
   huancayo`. Cada rubro es un post con su propia búsqueda.
7. **`proveedores sancionados osce` +60% y `consulta de proveedores sancionados
   por el tce`** aparecen solos en el autocompletar. Contenido de riesgo,
   informativo y verificable: el registro es público.
8. **#mype (17.5K vistas/video) es donde está el CLIENTE**, no #licitaciones
   (8.7K). La etiqueta de la categoría reparte peor que la etiqueta de la persona.

## Recomendación

**Línea 1:** `Cómo ser proveedor del Estado en 2026: los [N] pasos, en orden —`
(variantes verificadas: `Constancia de RNP: cómo se saca y cuánto demora`,
`Cómo buscar licitaciones del Estado sin perderte en el SEACE`.)
Escribe **"licitaciones del Estado"** y **"proveedor del Estado"** completos en la
línea 1; deja **SEACE, RNP, OECE** para el cuerpo del caption y el texto de lámina.

**Hashtags:** **#mype + #osce**
Alcance: cambiar #osce por **#estadoperuano** (29.3K vistas/video).
**Evitar:** #licitacionesperu, #licitacionespublicas, #ventasalestado, #mypeperu,
#comprasestatales (todas por debajo de 3.2K vistas/video).

---

# DIPLOMY (en, global)

**3.718 términos únicos. La marca con el diagnóstico más incómodo.**

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `certificate courses` | 206 | TT×68 | — | 🔵 Info |
| 2 | `course certificate` | 197 | TT×64, G, YT | — | 🔵 Info |
| 3 | `free online certificate courses` | 189 | TT×63 | — | 🔴 **ALTA (alumno)** |
| 4 | `professional certificate course` | 179 | TT×59 | — | 🔵 Info |
| 5 | `certificate verification` | 179 | TT×59 | — | 🟠 **Comercial (núcleo)** |
| 6 | `free course online with certificate` | 164 | TT×54 | — | 🔴 ALTA (alumno) |
| 7 | `fake certificate` | — | TT verif. | **pre=10/10** (`…of employment`, `…award`) | 🔴 **ALTA** |
| 8 | `certificate online course in resume` | 140 | TT×46 | — | 🔴 **ALTA (alumno)** |
| 9 | `linkedin course with certificate` | 128 | TT×42 | — | 🔴 ALTA |
| 10 | `are certificates worth it` | — | TT verif. | **EXACT@0** (`are coursera certificates worth it`) | 🔵 **Info (debate)** |
| 11 | `digital certificate` | 101 | TT×32, G, YT | — | 🔵 Info |
| 12 | `certificate of completion template` | 99 | TT×31, G×2, YT | **EXACT@0** | 🟠 Comercial |
| 13 | `certificates template` | 89 | TT×29 | — | 🟠 Comercial |
| 14 | `linkedin certificate post` | 96 | TT×30, G×2, YT | — | 🟡 Táctico |
| 15 | `online course certificates` | 98 | TT×32 | — | 🔵 Info |
| 16 | `computer course certificate` | 98 | TT×32 | — | 🔵 Info |
| 17 | `certificate for students` | 98 | TT×32 | pre=2 | 🔵 Info |
| 18 | `credential verification` | 87 | TT×27, G×2, YT | — | 🟠 Comercial |
| 19 | `best platform to sell online courses` | — | TT verif. | **EXACT@0** | 🟠 **Comercial (cliente real)** |
| 20 | `online academy business` | — | TT verif. | **EXACT@0, rel=6/10** | 🟠 **Comercial (cliente real)** |
| 21 | `certificates not important` | 86 | TT×28 | — | 🔵 **Info (debate)** |
| 22 | `employer certificate for verification` | 92 | TT×30 | — | 🟠 **Comercial** |
| 23 | `google digital skills certificate` | 95 | TT×31 | — | 🔵 Info |
| 24 | `is my certificate real` | — | TT verif. | EXACT@3 | 🔴 **ALTA** |
| 25 | `certificate of completion program` | 95 | TT×31 | — | 🔵 Info |
| 26 | `online course certificate aesthetic` | 83 | TT×27 | — | 🟡 Táctico |
| 27 | `add certificate linkedin` | — | TT (sugerencia) | — | 🟡 Táctico |
| 28 | `certificate template design` | 87 | TT×28, G | — | 🟠 Comercial |
| 29 | `online degree certificate` | 93 | TT×31 | — | 🔵 Info |
| 30 | `online courses certificate malaysia` | 134 | TT×44 | — | 🔵 **Info (geo)** |

**Google Trends (global, en):** `certificate template` 61,8 ·
`verify certificate` 61,3 · `online course certificate` 59,7 ·
`certificate of completion` 40,2 · `credly` 22,9 · `digital credentials` 21,2 ·
`digital badge` 14,1 · `open badges` 9,3 · `micro credentials` 5,5.
**Rising:** `credly digital badges` +300% · `what is credly badge` +250% ·
`verifiable digital credentials` +80% · `udemy certificate of completion` +70% ·
`which online course certificate is valuable` +110%.

⚠️ `verify certificate` está contaminado por SSL/TLS (`openssl verify certificate`,
`failed to verify certificate signed by unknown authority`). **Nunca usar
"verify certificate" a secas.**

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #academiaonline (ES) | 8.0K | 147.6M | **18.4K** 🟢 |
| #resumetips | 170.1K | 2.9B | **17.0K** 🟢 |
| #certificateverification | **103** | 1.3M | **13.0K** 🟢 |
| #digitalbadge | 2.8K | 32.4M | **11.7K** 🟢 |
| #freecertificate | 1.1K | 12.5M | **11.6K** 🟢 |
| #linkedintips | 80.3K | 851.2M | 10.6K |
| #fakecertificate | **459** | 4.8M | 10.5K |
| #careerchange | 196.3K | 1.5B | 7.8K |
| #certificate | 96.4K | 724.7M | 7.5K |
| #onlinelearning | 267.3K | 1.9B | 7.1K |
| #microcredentials | 533 | 3.7M | 6.8K |
| #onlinecourse | 103.0K | 672.6M | 6.5K |
| #elearning | 118.2K | 748.4M | 6.3K |
| #freecourses | 89.9K | 543.9M | 6.0K |
| #upskilling | 18.0K | 84.8M | 4.7K |
| #edtech | 143.5K | 660.9M | 4.6K |
| #teachonline | 8.2K | 29.5M | 3.6K ⚠️ |
| #credly | 125 | 357.9K | 2.9K ⚠️ |
| #onlinecoursecreator | 2.7K | 6.9M | 2.5K ⚠️ |
| #coursecreator | 23.4K | 55.1M | 2.4K ⚠️ |
| #digitalcredentials | 141 | 285.3K | 2.0K 🔴 |
| #certificateofcompletion | 728 | 1.2M | 1.6K 🔴 |
| #verifiablecredentials | 80 | 83.8K | 1.0K 🔴 |
| **#openbadges** | **67** | **14.1K** | **211** 🔴🔴 |

## Content gaps

1. **Toda la jerga del producto está muerta en TikTok.** `open badges` no es
   consulta viva (autocompleta a *"event badges"*, *"open badge fun"*) y
   **#openbadges tiene 67 videos con 211 vistas/video.** Igual
   #verifiablecredentials (1.0K) y #digitalcredentials (2.0K). **Diplomy no puede
   entrar por el nombre de su tecnología.** Las palabras siguen valiendo dentro
   del texto para indexación, pero como puerta de entrada no existen.
2. **La puerta real es `fake certificate`: pre=10/10.** Diez de diez sugerencias
   siguen esa frase (`fake certificate of employment`, `fake certificate award`,
   `fake certificates`). #fakecertificate: **459 videos, 10.5K vistas/video.**
   Demanda masiva con oferta mínima, y es exactamente el problema que Diplomy
   resuelve — dicho con la palabra que la gente escribe.
   → Y su gemela: **#certificateverification tiene 103 videos con 13.0K
   vistas/video.** Ciento tres videos en el mundo entero.
3. **El comprador (academias) casi no busca; el alumno busca muchísimo.** Todas
   las etiquetas del lado creador reparten mal: #coursecreator 2.4K,
   #onlinecoursecreator 2.5K, #teachonline 3.6K. Las del lado alumno vuelan:
   #resumetips 17.0K, #careerchange 7.8K. **Decisión estratégica: el contenido
   frío se hace para el ALUMNO (que es quien pregunta si su certificado sirve) y
   la academia se capta por conversión, no por búsqueda.** Encaja con la prioridad
   ya definida (academias primero) sin pelearse con la plataforma.
4. **El debate está pedido y no lo da nadie.** `are certificates worth it`
   EXACT@0, con `are coursera certificates worth it` de continuación, y
   `certificates not important` con score 86. Trends confirma con
   `which online course certificate is valuable` +110%. Es el post de opinión
   fundamentada que instala la categoría.
5. **`certificate online course in resume` (score 140) y `linkedin course with
   certificate` (128).** El puente entre el certificado y el trabajo — el "para
   qué" — con #linkedintips en 10.6K vistas/video.
6. **Credly sube (+300% `credly digital badges`, +250% `what is credly badge`) y
   tiene 125 videos en TikTok.** El competidor es notorio en Google e invisible en
   TikTok: hueco comparativo para "cómo funciona y en qué se diferencia".
7. **Geografía:** el espacio EN de certificados está dominado por Malasia,
   Filipinas, India y Vietnam (`online courses certificate malaysia` con score
   134; sugerencias en vietnamita dentro del top-40). No es el mercado que Diplomy
   tiene en la cabeza. **Si el objetivo es US/EU hay que anclar la geografía en el
   texto, o aceptar que la audiencia orgánica será del sudeste asiático.**
8. **#academiaonline (español): 18.4K vistas/video.** Si alguna vez se prueba
   Diplomy en español, esa etiqueta es la mejor del conjunto.

## Recomendación

**Línea 1:** `How to tell if a certificate is fake (and what a real one has):`
(alternativa de debate: `Are online course certificates worth it? Here's what
employers actually check —`)

**Hashtags:** **#certificateverification + #resumetips**
Producto: cambiar el primero por **#digitalbadge** (11.7K) o **#fakecertificate**
(10.5K). **NO usar #openbadges, #verifiablecredentials, #digitalcredentials,
#certificateofcompletion, #credly.** Esas palabras van en el texto, no en la etiqueta.

---

# CHEAPFIX (en-US)

**5.316 términos únicos — el mayor volumen de las siete.** Confirma con datos el
ángulo del brief de la cuenta: se entra por el fastidio, no por el producto.

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `small apartment storage hacks` | 105 | TT×32, G×5, YT | **EXACT@0** | 🔴 **ALTA** |
| 2 | `shower drain hair catcher` | 100 | TT×31, G×3, YT | **EXACT@0** | 🟠 **Comercial** |
| 3 | `amazon under 20 dollars` | 100 | TT×32, YT | **EXACT@1, pre=7** | 🟠 **Comercial** |
| 4 | `small apartment hacks` | 101 | TT×32, G, YT | — | 🔴 ALTA |
| 5 | `remove hair from shower drain` | 98 | TT×32 | — | 🔴 **ALTA** |
| 6 | `how to get hair out of shower drain` | 98 | TT×32 | **EXACT@0, rel=8/10** | 🔴 **ALTA** |
| 7 | `stop hair from going in shower drain` | 98 | TT×32 | — | 🔴 **ALTA (preventiva)** |
| 8 | `bathroom hacks ideas` | 98 | TT×32 | — | 🔵 Info |
| 9 | `cleaning hair out of shower drain` | 96 | TT×32 | — | 🔴 ALTA |
| 10 | `organization hacks` | 95 | TT×30, G, YT | — | 🔵 Info |
| 11 | `renter friendly hacks` | — | TT verif. | **EXACT@0, rel=10/10** | 🔴 **ALTA** |
| 12 | `clogged drain fix` | — | TT verif. | pre=1, **rel=8/10** | 🔴 **ALTA** |
| 13 | `amazon finds under 20 dollars` | 92 | TT×30 | — | 🟠 Comercial |
| 14 | `things under 20 on amazon` | 92 | TT×30 | — | 🟠 Comercial |
| 15 | `shower drain hair trap` | 91 | TT×29, G×2 | — | 🟠 Comercial |
| 16 | `home organization hacks` | 89 | TT×29 | — | 🔵 Info |
| 17 | `car organization ideas` | — | TT verif. | **EXACT@0, pre=6** (`…women`, `…men`) | 🔴 ALTA |
| 18 | `car organization girly` | 86 | TT×28 | — | 🔴 ALTA |
| 19 | `cheap home upgrades` | — | TT verif. | **EXACT@0** | 🔴 ALTA |
| 20 | `things i wish i bought sooner` | — | TT verif. | **EXACT@0** | 🟠 **Comercial** |
| 21 | `kitchen gadgets that actually work` | — | TT verif. | **EXACT@0** | 🟠 Comercial |
| 22 | `small apartment hacks for kids` | 89 | TT×29 | — | 🔴 ALTA |
| 23 | `organization hacks for bedroom` | 84 | TT×27, G | — | 🔴 ALTA |
| 24 | `kitchen gadgets 2026` | 82 | TT×26, YT | — | 🟠 Comercial |
| 25 | `storage hacks small apartment` | 79 | TT×26, G | — | 🔴 ALTA |
| 26 | `small apartment closet hacks` | 79 | TT×26, G | — | 🔴 ALTA |
| 27 | `moving tips and hacks small apartment` | 93 | TT×31 | — | 🔴 **ALTA (estacional)** |
| 28 | `car organization with kids` | 74 | TT×24 | — | 🔴 ALTA |
| 29 | `small apartment rental hacks` | 78 | TT×26 | — | 🔴 ALTA |
| 30 | `bathroom diy hacks` | 83 | TT×27 | — | 🔵 Info |

**Google Trends US:** `shower drain` 72,0 · `car organization` 49,9 ·
`home organization` 33,8 · `closet organization` 26,8 · `kitchen gadgets` 7,3 ·
`amazon finds` 4,4 · `cleaning hacks` 2,2 · `apartment hacks` 0,9 · `temu finds` 0,2.
**Rising:** `how to clean shower drain` **+500%** · `clean shower drain` +350% ·
`shower drain repair` +70% · `best closet organization systems` +130% ·
`amazon summer decor finds` (Breakout).

**Lectura:** `shower drain` (72,0) le gana a `amazon finds` (4,4) por **16×** en
Google. El brief de la cuenta —abrir por el fastidio, no por el producto— queda
confirmado por el dato.

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #temufinds | 975.4K | 134.1B | **137.4K** 🟢🟢 |
| #lifehacks | 5.4M | 239.8B | **44.6K** 🟢 |
| #cloggeddrain | **24.9K** | 1.0B | **40.9K** 🟢 |
| #apartmenthacks | **31.1K** | 1.2B | **40.2K** 🟢 |
| #smallapartment | 23.0K | 747.2M | **32.5K** 🟢 |
| #cleantok | 8.2M | 256.0B | 31.3K |
| #renterfriendly | 101.9K | 3.2B | **31.2K** 🟢 |
| #amazonmusthaves | 1.6M | 45.2B | 29.1K |
| #carhacks | 289.2K | 7.9B | 27.3K |
| #cleaninghacks | 1.7M | 45.8B | 27.1K |
| #diyhome | 318.7K | 8.3B | 26.1K |
| #showerdrain | **3.5K** | 84.2M | **24.1K** 🟢 |
| #homehacks | 1.1M | 26.1B | 23.4K |
| #amazonfinds | 5.7M | 118.0B | 20.6K |
| #carorganization | 52.5K | 1.1B | 20.6K |
| #closetorganization | 189.2K | 3.8B | 20.0K |
| #organizationhacks | 144.8K | 2.8B | 19.3K |
| #homeimprovement | 3.2M | 45.8B | 14.4K |
| #bathroomhacks | 47.4K | 669.5M | 14.1K |
| #kitchengadgets | 1.4M | 18.8B | 13.1K |
| #under20 | 7.5K | 77.2M | 10.3K |
| #homeorganization | 711.4K | 7.1B | 10.0K |
| #tiktokmademebuyit | 42.8M | 354.3B | 8.3K ⚠️ |
| #budgetfinds | 193.9K | 1.1B | 5.7K ⚠️ |

## Content gaps

1. **#temufinds: 137.400 vistas por video.** Es, con diferencia, el mejor reparto
   medido en las 7 marcas (3,3× el segundo). Y la cuenta ya tiene a Temu como
   motor previsto. *(Antes de usarla en un post con enlace, revisar
   `affiliate/COMPLIANCE.md`; sin rail activo la etiqueta describe el contenido y
   no afirma nada.)*
2. **El drenaje: demanda enorme, etiqueta chica.** `how to clean shower drain`
   sube **+500%** en Trends US, `shower drain` puntúa 72/100, y **#showerdrain
   tiene 3.500 videos con 24.1K vistas/video.** El post fundacional de la cuenta
   ya estaba bien elegido — ahora está confirmado con números.
3. **#cloggeddrain (40.9K) y #apartmenthacks (40.2K) reparten 4–5× mejor que
   #amazonfinds (20.6K) y #tiktokmademebuyit (8.3K).** Las etiquetas grandes de
   "finds" son las peores de la lista. La cuenta gana etiquetando el **problema**,
   no la tienda — otra vez el ángulo del brief, medido.
4. **`renter friendly hacks`: EXACT@0 con rel 10/10** (`…for hanging things`,
   `…balcony`, `cheap renter friendly hacks`). #renterfriendly: 31.2K
   vistas/video. Restricción, no producto: el inquilino que no puede taladrar.
5. **`things i wish i bought sooner` EXACT@0.** Formato de lista con
   arrepentimiento incorporado. Guardable por diseño.
6. **`car organization` se bifurca por género y por hijos:** `…girly`, `…for men`,
   `…women`, `…with kids`, `…asmr`. Cuatro posts de la misma foto.
   ⚠️ En Google, `car organization` está contaminado por `world health
   organization` (100/100 en related). **No usar "organization" sola en la línea 1.**
7. **`moving tips and hacks small apartment` (score 93)** — la mudanza es el
   momento de máxima disposición a comprar cachivaches, y es estacional.

## Recomendación

**Línea 1:** `How to get hair out of your shower drain without pulling it out by hand:`
(plantilla general: `[El fastidio, en las palabras de quien lo sufre] — and the
$[x] thing that ends it:`)

**Hashtags:** el **específico del fastidio** + el **de reparto**:

- Drenaje → **#cloggeddrain + #showerdrain**
- Depa chico → **#apartmenthacks + #renterfriendly**
- Producto barato → **#temufinds + #under20**

**Evitar como principal:** #tiktokmademebuyit (8.3K) y #budgetfinds (5.7K).

---

# SERVICESTACK (en-US)

**1.909 términos únicos — el espacio más pequeño de las siete, y eso es dato:** el
operador que trabaja solo busca menos en TikTok que el consumidor. Lo compensa con
intención altísima.

## Búsquedas rankeadas

| # | Término exacto | Score | Fuente | Prueba | Intención |
|---|---|---|---|---|---|
| 1 | `client wont pay` / `client won't pay` | — | TT verif. | **EXACT@0, pre=4** | 🔴 **ALTA** |
| 2 | `when a client doesn't pay` | 96 | TT×31, G | — | 🔴 **ALTA** |
| 3 | `when your client doesn't want to pay` | 95 | TT×31 | — | 🔴 **ALTA** |
| 4 | `client not paying` | 89 | TT×29 | — | 🔴 **ALTA** |
| 5 | `customer wont pay` | 89 | TT×29 | — | 🔴 **ALTA** |
| 6 | `how to get more clients` | 101 | TT×31, G×6 | **EXACT@0, pre=9** | 🔴 **ALTA** |
| 7 | `freelancer tips` | 111 | TT×29, **G×20**, YT | — | 🔵 Info |
| 8 | `freelancing client red flag` | 98 | TT×32 | — | 🔴 ALTA |
| 9 | `freelance red flags` | — | TT verif. | **EXACT@0** | 🔴 ALTA |
| 10 | `how to schedule clients` | 99 | TT×32, G | **EXACT@0** | 🔴 **ALTA** |
| 11 | `scheduling client appointments` | 98 | TT×32 | — | 🟠 Comercial |
| 12 | `contract for freelancer` | 98 | TT×32 | — | 🟠 Comercial |
| 13 | `freelance contract template` | 87 | TT×27, G×2, YT | **EXACT@0** | 🟠 **Comercial** |
| 14 | `ghosting a client` / `ghosting client` | 95 / 92 | TT×31 / ×30 | — | 🔴 ALTA |
| 15 | `what to do when a client ghosts you` | — | TT verif. | pre=1 (`…mid proyect`) | 🔴 **ALTA** |
| 16 | `follow up client` | 95 | TT×31 | — | 🔴 ALTA |
| 17 | `following up email client` | 89 | TT×29 | — | 🔴 ALTA |
| 18 | `late payment` | 92 | TT×30 | — | 🔴 ALTA |
| 19 | `how to price freelance work` | — | TT verif. + **GT rising +400%** | **EXACT@0** | 🔴 **ALTA** |
| 20 | `client scheduling app` | — | TT verif. | **EXACT@0** | 🟠 **Comercial** |
| 21 | `how to automate my business` | — | TT verif. | **EXACT@0** | 🟠 **Comercial** |
| 22 | `invoice the downpayment for the client` | 92 | TT×30 | — | 🟠 Comercial |
| 23 | `nail client didn't pay` / `when a client doesn't pay nails` | 86 / 87 | TT×28 / ×29 | — | 🔴 **ALTA (vertical)** |
| 24 | `photographer scheduling clients` | 89 | TT×29 | — | 🔴 **ALTA (vertical)** |
| 25 | `small business client appointment book` | 89 | TT×29 | — | 🟠 Comercial |
| 26 | `booking appointments small business` | 84 | TT×28 | — | 🟠 Comercial |
| 27 | `freelance business ideas` | 105 | TT×32, G×5, YT | — | 🔵 Info |
| 28 | `getting more clients` | 89 | TT×29 | — | 🔴 ALTA |
| 29 | `customer follow up` | 87 | TT×29 | — | 🔴 ALTA |
| 30 | `starting freelance business` | 89 | TT×29 | — | 🔵 Info |

**Google Trends US:** `get clients` 75,9 · `invoice` 71,7 · `freelance` 26,4 ·
`freelance rates` 23,8 · `freelance contract` 14,3 · `late payment` 13,7 ·
`client management` 8,8 · `scheduling software` 6,1 · `automate my business` 3,6.
**Rising:** `how to price freelance services` **+400%** · `invoice automation`
+250% · `client management app` +120% · `freelance platforms` +130%.

⚠️ `late payment` en Google es casi todo crédito personal (`late payment on credit
report`, `capital one late payment`). **En TikTok sí es del freelancer; en Google
no.** No mezclar las dos señales.

## Oferta

| Etiqueta | Videos | Vistas | Vistas/video |
|---|---|---|---|
| #zapier | **9.6K** | 211.4M | **21.9K** 🟢 |
| #contractor | 783.9K | 12.5B | **16.0K** 🟢 |
| #aitools | 800.9K | 9.8B | 12.2K |
| #latepayment | **3.2K** | 35.6M | **11.2K** 🟢 |
| #freelancertips | 46.2K | 458.4M | 9.9K |
| #freelancer | 810.7K | 8.0B | 9.8K |
| #freelancelife | 183.3K | 1.8B | 9.6K |
| #productivity | 2.3M | 22.2B | 9.6K |
| #automation | 792.2K | 6.2B | 7.8K |
| #freelancing | 363.4K | 2.8B | 7.8K |
| #smallbusinesstips | 380.8K | 2.6B | 6.8K |
| #businesstips | 1.7M | 11.1B | 6.6K |
| #sidehustle | 6.3M | 41.1B | 6.5K |
| #selfemployed | 424.5K | 2.6B | 6.2K |
| #n8n | 65.8K | 378.3M | 5.8K |
| #invoicing | 4.1K | 23.4M | 5.7K |
| #solopreneur | 119.9K | 502.0M | 4.2K ⚠️ |
| #onlinebusiness | 7.0M | 26.6B | 3.8K ⚠️ |
| #servicebusiness | 28.5K | 104.7M | 3.7K ⚠️ |
| #clientwork | 16.8K | 58.2M | 3.5K ⚠️ |
| #gettingclients | **798** | 1.9M | 2.4K 🔴 |
| #clientmanagement | 7.9K | 13.4M | 1.7K 🔴 |
| #systemeio | 7.0K | 12.2M | 1.7K 🔴 |
| #businessautomation | **80.0K** | 87.7M | **1.1K** 🔴🔴 |

## Content gaps

1. **"El cliente no paga" es el tema con más caminos de entrada de la marca.**
   Seis formulaciones distintas puntúan alto y `client wont pay` sale EXACT@0 con
   pre=4. **#latepayment: 3.200 videos, 11.2K vistas/video.** Demanda enorme,
   oferta de tres mil videos, y es exactamente el problema que resuelve un stack
   de facturación.
2. **#businessautomation es la peor etiqueta medida: 80.000 videos y 1.100
   vistas/video.** Es la etiqueta que una cuenta de automatización usaría por
   instinto, y es un agujero negro. Lo mismo #clientmanagement (1.7K) y
   #systemeio (1.7K — y ese es el motor de afiliación de la cuenta).
   **#zapier, en cambio: 9.600 videos y 21.900 vistas/video** — 20× mejor reparto
   con 8× menos competencia. **Nombrar la herramienta concreta gana a nombrar la
   categoría abstracta, y por un margen enorme.**
3. **La verticalización por oficio está libre y es específica:**
   `nail client didn't pay`, `when a client doesn't pay nails`,
   `photographer scheduling clients`. Uñas, fotografía, servicios a domicilio: la
   misma plantilla con el oficio en la lámina 1.
4. **`how to price freelance work` EXACT@0, y `how to price freelance services`
   +400% en Trends.** La pregunta más ansiosa del freelance, subiendo ahora mismo.
5. **Dos frases del brief NO son consultas vivas:** `how to follow up with a
   client` (rel 0/1) y `late payment invoice email` (rel 0/4). Lo que la gente
   escribe de verdad es **`follow up client`**, **`following up email client`**,
   **`customer follow up`** y **`late payment`** a secas. Corregir el fraseo antes
   de escribir.
6. **`what to do when a client ghosts you` devuelve UNA sola sugerencia**
   (`…mid proyect`). Consulta real con oferta casi nula — el caso puro de hueco.
7. **`client scheduling app` y `how to automate my business` salen EXACT@0**:
   intención comercial explícita, que es justo donde el stack de afiliación
   convierte.

## Recomendación

**Línea 1:** `What to do when a client won't pay — the 4 messages, in order:`
(plantilla: `[El problema del operador, en su idioma] — the exact setup that fixes
it:`; verticalizada: `When a nail client doesn't pay:`)

**Hashtags:** **#freelancertips + #zapier**
Por tema: **#latepayment** (cobros) o **#contractor** (oficios).
**Evitar:** #businessautomation, #clientmanagement, #gettingclients, #systemeio,
#onlinebusiness. (Sí: el hashtag de la marca que se afilia es una etiqueta muerta.
La mención va en el caption, no en la etiqueta.)

---

# 10 · La rutina CSI de 1 minuto (para Carlos, en la app)

> ⚠️ **Honestidad sobre esta sección:** la búsqueda web estaba agotada y ni la
> documentación de TikTok ni los blogs de practicantes se pudieron recuperar hoy
> (CAPTCHA / 404 / SPA vacía). Lo de abajo es **conocimiento del modelo (corte
> mayo 2026)**, no una fuente traída en esta sesión. La disponibilidad y los
> nombres exactos de las pestañas **cámbialos por lo que veas en pantalla**; si
> algo no coincide, manda captura y se corrige el documento.

**Qué es.** Creator Search Insights es una herramienta dentro de la app de TikTok
que muestra **qué se está buscando** y, sobre todo, **qué se busca y casi nadie
responde**. Es lo único que da popularidad de búsqueda de primera mano; todo este
documento es su reconstrucción desde fuera.

**Cómo entrar.** Busca `Creator Search Insights` en el buscador de TikTok y toca
el resultado (no es un video: es la tarjeta de la herramienta). También suele
estar en *Herramientas de creador*. Requisito habitual: cuenta con un mínimo de
publicaciones recientes.

**Lo que muestra:**

- Temas buscados **por categoría** y por región de tu audiencia.
- **"Content gap" / "Gap de contenido"** — la lista que importa: búsquedas con
  demanda y **poco contenido publicado**. Es literalmente lo que este documento
  intenta calcular por división.
- **"For you" / temas relacionados con lo que TÚ publicas** — sesgado a tu cuenta.

## La rutina (60 segundos, por cuenta, 1 vez por semana)

1. **(0:00)** Abre TikTok con la cuenta de la marca → busca `Creator Search Insights`.
2. **(0:10)** Entra a **Content gap** y filtra por la categoría de la marca.
3. **(0:20)** **Captura de pantalla de la lista completa.** No la resumas: la
   captura literal vale más que tu memoria de ella.
4. **(0:30)** Vuelve al buscador y escribe, **sin enviar**, la línea 1 recomendada
   de esta marca. **Captura el desplegable de sugerencias.** Ese autocompletar es
   lo que primero envejece en este documento.
5. **(0:45)** Repite el paso 4 con la búsqueda 🔴 **ALTA** nº 1 de la marca.
6. **(1:00)** Manda las 3 capturas al chat con una línea: `CSI <marca> <fecha>`.

**Qué se hace con eso:** se cruzan los content gaps reales de CSI contra las
tablas de este documento. Donde coincidan, esa búsqueda pasa al frente de la cola
de publicación. Donde CSI muestre algo que aquí no está, entra como semilla nueva
y se vuelve a correr la cosecha (§11).

**Cadencia sugerida:** una marca por día, rotando. Siete días, siete marcas, un
minuto diario. Con capturas de dos semanas se puede medir qué gap se cerró.

---

# 11 · Cómo re-correr esta cosecha

Los scripts que produjeron todo lo de arriba son de una pieza y no dependen de
ninguna clave. Lo que hay que conservar son **los cuatro endpoints y sus trampas**:

```
# 1) Autocompletar de TikTok — la fuente principal
GET https://www.tiktok.com/api/search/general/sug/
    ?keyword=<frase>&aid=1988&app_language=es&region=PE
    &device_platform=web_pc&channel=tiktok_web
    Headers: User-Agent de navegador + Referer: https://www.tiktok.com/search
    -> sug_list[].content
    Expansión: por cada semilla lanzar la semilla + "semilla a".."semilla z"
    + prefijos de pregunta. Contar cuántas veces reaparece cada término.
    Pausa de 160 ms. NO usar extra_info.hot_level (siempre 0).

# 2) Oferta por hashtag — los números duros
GET https://www.tiktok.com/api/challenge/detail/?challengeName=<tag>&aid=1988
    -> challengeInfo.statsV2.{videoCount,viewCount}
       (statsV2, NO stats: stats.videoCount llega en 0 y viewCount redondeado)

# 3) Google / YouTube autocompletar
GET https://suggestqueries.google.com/complete/search?client=firefox&q=..&hl=es&gl=PE
GET https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=..

# 4) Google Trends — REQUIERE cookie previa
GET https://trends.google.com/trends/explore?geo=PE&q=x      <- solo por la cookie
GET https://trends.google.com/trends/api/explore?hl=es-PE&tz=300&req={...}
    -> widgets[]   (quitar el prefijo )]}' antes de parsear)
GET https://trends.google.com/trends/api/widgetdata/multiline|relatedsearches
    ?hl=..&tz=300&req=<widget.request>&token=<widget.token>
    Sin la cookie: 429 en todo. Con ella: series + top/rising related queries.
```

**Vigencia.** Los rankings de autocompletar cambian en semanas; los números de
hashtag, en meses; los gaps estructurales (Radar Estatal, la verificación de
certificados) tardan mucho más. **Repetir la cosecha completa cada 6–8 semanas y
las capturas de CSI cada semana.**

---

# 12 · Lo que este documento NO puede decirte

Para que nadie lo cite como si fuera más de lo que es:

1. **No hay volumen de búsqueda absoluto en TikTok.** Nadie lo publica fuera de
   CSI. El `score` mide cobertura de autocompletar, no búsquedas/mes. Un score de
   98 no es "98 mil búsquedas": es "salió por 31 caminos distintos de escritura".
2. **Google Trends es relativo dentro de su grupo.** `alzheimer 59,7` significa
   59,7 **comparado con las otras cuatro palabras de ESE grupo**, no con nada más.
   Los números de grupos distintos no se comparan entre sí.
3. **Vistas/video de un hashtag es histórico y acumulado**, no el reparto que
   tendrá tu post mañana. Sirve para comparar etiquetas entre sí — que es para lo
   único que se usó aquí.
4. **El autocompletar tiene algo de personalización** (`is_personalized: 1` en
   varias respuestas), aunque las peticiones fueron anónimas y sin cookies.
5. **Los porcentajes de Metricool del brief (+114% búsqueda / −59% sonido) siguen
   sin verificar.** El estudio existe y su muestra está confirmada (2.314.756
   posts, 92.000+ cuentas, 12-05-2026), y de él sí se pudo leer que **la FYP
   genera 7 de cada 10 vistas**. Los dos porcentajes están tras el formulario de
   descarga. **No los pongas en una lámina** (regla dura: cero cifras sin fuente).
6. **Creative Center quedó fuera.** Si en algún momento hace falta, la vía es una
   sesión real de anunciante en el navegador y copiar las cabeceras firmadas;
   desde fuera devuelve `40101` siempre.

---

*Cosechado el 2026-09-01. 24.093 términos únicos, 178 hashtags medidos, 7 marcas,
0 errores de red, 0 cifras inventadas.*
