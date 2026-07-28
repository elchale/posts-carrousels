# Sistema de color — teoría aplicada por marca

Auditado 2026-07-28 contra: regla 60-30-10, esquemas de armonía clásicos y
contraste WCAG (medido, no estimado). Paletas extraídas de los sitios reales.

## La regla aplicada

| Rol (60-30-10) | ComeHomeTag | Qolca | Propaga |
|---|---|---|---|
| **60% dominante** (fondo) | lavanda/blanco `#eceafc→#f5f3ff` | azul marino `#0d162f` | crema cálido `#faf0e2` |
| **30% secundario** (texto) | tinta azul-noche `#131829` | blanco hielo `#f2f7ff` | piedra oscura `#2d1a1a` |
| **10% acento** (kicker/números/CTA) | violeta `#6a4cff` · rosa `#ec7ea5` | celeste `#5aa7ff` | carmesí `#be001a` · dorado `#ffc266` |

## Esquema de armonía por marca

- **ComeHomeTag — análogo frío** (violeta→rosa→azul, vecinos en la rueda).
  Feed blanco+morado como la cuenta real. Láminas oscuras invierten el
  esquema (marino-violeta dominante, texto hielo, acento rosa).
- **Qolca — monocromático azul** (marino→celeste→hielo). Coincide con el
  feed real (celeste + azul oscuro). La lámina "paper" invierte a hielo con
  tinta marino. Un solo matiz = máxima coherencia de marca B2B.
- **Propaga — análogo cálido** (carmesí→naranja→dorado sobre neutros piedra).
  El rojo `#be001a` se usa SOLO como acento (10%): dos rojos dominantes
  competirían; como acento sobre crema, dirige el ojo al CTA.

## Contraste medido (WCAG)

Todos los pares texto/fondo del sistema, calculados sobre los plates graduados:

| Par | Ratio | Nivel |
|---|---|---|
| CHT tinta / lavanda | 14.9:1 | AAA |
| CHT violeta / lavanda (solo texto grande) | 4.3:1 | AA-large ✓ |
| CHT texto / marino-violeta | 13.1:1 | AAA |
| CHT rosa / marino-violeta | 5.6:1 | AA |
| QOL texto / marino | 16.4:1 | AAA |
| QOL celeste / marino | 7.0:1 | AAA |
| QOL tinta / hielo | 16.2:1 | AAA |
| PRO tinta / crema | 14.6:1 | AAA |
| PRO carmesí / crema | 5.8:1 | AA |
| PRO texto / cine oscuro | 16.5:1 | AAA |
| PRO dorado / cine oscuro | 11.0:1 | AAA |

Regla de uso: los acentos solo aparecen en tamaños grandes (kicker 34px+,
números 84px, sub-líneas 40px+), donde el umbral WCAG es 3:1 — el par más
bajo del sistema (4.3:1) lo supera con margen.

## Reglas de mantenimiento

1. El acento nunca pasa del ~10% del área de una lámina (kicker + número +
   línea CTA + chip). Si un diseño "pide" más acento, el problema es la
   jerarquía, no el color.
2. Nunca introducir un segundo matiz dominante: CHT es violeta, Qolca es azul,
   Propaga es cálido. Los plates cinematográficos se gradúan HACIA ese matiz
   (split-tone en `tools/grade.py`).
3. Todo color nuevo se verifica con el script de contraste antes de usarse
   (está en el historial de `tools/`; umbrales: 4.5:1 texto normal, 3:1 grande).
