# Diplomy — definición de marca para contenido

Quinta marca del sistema de carruseles (agregada 2026-08-04). Dominio recién
comprado: **diplomy.org**. Producto en construcción.

> **ESTA MARCA ESCRIBE EN INGLÉS.** Decisión de Carlos (2026-08-04): mercado
> global, no Perú. Todas las láminas y captions van en inglés plano y directo
> (registro US/internacional, segunda persona). El MÉTODO del skill
> `copy-carruseles` aplica igual — los 7 filtros duros, la lámina 2 sin
> regancho, cero olor a venta, bullets sin párrafos — pero los ejemplos en
> español de la galería son plantillas, no copy publicable. **El calendario de
> eventos peruano NO aplica**: esta marca tiene el suyo (§Calendario).

## Qué es (la línea de la lámina 6 — un extraño la entiende)

> **Diplomy** (diplomy.org): the platform where you issue certificates your
> students can actually prove. You set up your school's brand, pick a design,
> and every certificate you send comes with its own verification page that
> anyone can check, plus a PDF and a badge they can add to LinkedIn.

Tagline de producto: "Certificates that can be verified, not just printed."

Cuatro capacidades (en orden de gancho):
1. **La página de verificación**: cada certificado vive en su propia URL. La
   abres en el navegador y ves quién lo emitió, a quién, cuándo, y qué tuvo que
   hacer para ganarlo, con el check verde calculado EN VIVO (firma
   criptográfica + lista de revocación + expiración), no leído de una columna
   de base de datos.
2. **Emisión con tu marca, no con la nuestra**: logo, colores y diseño de la
   institución. Diplomy aparece como pie de página, igual que Stripe en un
   checkout. Es un argumento de venta, no un detalle.
3. **Estándar abierto (Open Badges / Verifiable Credentials)**: el certificado
   no queda encerrado en Diplomy. La misma URL sirve la página HTML a un
   humano y el JSON firmado a una máquina; el alumno se lo lleva a LinkedIn,
   al CV o a otra plataforma.
4. **Revocación y expiración reales**: un certificado revocado sigue teniendo
   página, pero en rojo y con fecha. Uno vencido lo dice. Borrar el enlace
   sería mentir por omisión.

## Cómo funciona por dentro (para no escribir tonterías)

Lo que el contenido puede explicar con precisión:

- **Una URL, dos respuestas** (content negotiation por el header `Accept`):
  navegador → página HTML de verificación; máquina (`application/vc`,
  `application/json`) → el credencial firmado en crudo. Es la forma estándar.
- **El check verde se calcula en cada request**: se busca el credencial, se
  resuelve la clave pública del emisor desde su `did.json`, se verifica la
  firma, se consulta la lista de estado (revocación) y la expiración. Cachear
  uno o dos minutos está bien; leer un booleano de la base NO — eso sería una
  base de datos con una imagen de checkmark, y cualquiera con acceso a la BD
  podría falsificar un certificado.
- **Rutas**: `/{tenant}/{uuid}` (página o credencial) ·
  `/{tenant}/{uuid}/badge.png` (PNG con la credencial "horneada") ·
  `/{tenant}/{uuid}/cert.pdf` · `/{tenant}/did.json` (clave pública del emisor)
  · `/{tenant}/status/{id}` (lista de revocación).
- **UUID desconocido** → jamás un 404 mudo: "no certificate exists at this
  address". Quien escanea el QR de un PDF falsificado necesita ver el fallo,
  no una página de error genérica.
- **Jerarquía visual de la página**: manda la institución (su logo, su nombre);
  Diplomy es el pie de página. Mismo motivo que el checkout de Stripe.

**Nunca decir "blockchain"**: no lo es, y decirlo destruye la credibilidad
técnica delante del único público que puede evaluarnos.

## El cliente ideal — empezamos por los chicos

Carlos (2026-08-04): el objetivo son las instituciones **pequeñas y medianas**.
Las universidades no adoptan un sistema nuevo rápido (comité, TI, ciclo de
venta de un año) — se dejan para después, no se les escribe contenido ahora.

**1. La academia o instituto privado** (el que paga primero) — idiomas,
oficios, marketing, cocina, TI, música, manejo, cursos cortos. Emite entre 20 y
500 certificados al mes. Hoy los hace en Canva o Word, exporta un PDF y lo
manda por WhatsApp o correo. Sabe que su certificado no prueba nada y le
incomoda, pero lo urgente es llenar el próximo grupo.

**2. La empresa que capacita** (L&D, RRHH, consultoras de formación) — cursos
internos o a clientes. Necesita probar QUIÉN se capacitó y CUÁNDO: auditoría,
cumplimiento, renovaciones anuales, expediente del empleado. Su dolor es la
hoja de cálculo y la carpeta compartida.

**3. El organizador de eventos y colegios profesionales** — congresos,
diplomados, ponencias, horas de formación continua. Emite todo de golpe, una
vez por evento, y después le llueven correos de asistentes pidiendo "el
certificado otra vez".

## REGLA DE REGISTRO: siempre en positivo, nunca insinuar mala fe

**Regla dura de Carlos (2026-08-04), la más importante de esta marca.** Diplomy
es una marca profesional y seria. El contenido **jamás** insinúa que alguien
actúa de mala fe, ni el lector, ni sus alumnos, ni un tercero anónimo.

Prohibido, en láminas y en captions:
- Fraude, falsificación, adulteración: "anyone can fake it", "change the name",
  "forge", "tamper with", "someone could pretend". Ni siquiera en hipotético.
- Sospecha sobre los alumnos: "your students can't prove", "who actually
  finished", "only who paid". El alumno es el protagonista positivo, siempre.
- El lector como culpable o descuidado: "you're doing it wrong", "your
  certificate proves nothing", "nobody can check what you send".
- Miedo, alarma y urgencia negativa como gancho. Nada de 🚨.

Se dice al revés, siempre. El mismo hecho, en positivo y en informativo:

| ❌ Prohibido | ✅ Cómo se dice |
|---|---|
| "Anyone can change the name on your certificate" | "Give every certificate a link that confirms it" |
| "Your students cannot prove they took your course" | "Give your students proof they can share anywhere" |
| "A PDF proves nothing" | "What makes a certificate easy to check" |
| "Nobody can verify what you send" | "Three things that make a certificate verifiable" |
| "You'll need to revoke one eventually" | "Keep every certificate under your control after sending" |

El producto se sostiene solo por lo que SUMA: un certificado que se puede
comprobar vale más para quien se lo ganó, viaja mejor y deja el nombre de la
institución en cada perfil donde aterriza. Ese es el argumento entero. No hace
falta un villano, y esta marca no lo usa.

## Lo que este cliente quiere lograr (en su voz, en positivo)

- "I want the certificate to look like the course was worth it."
- "I want students to share it, not file it away."
- "I want one place where every certificate we ever issued lives."
- "I want the whole intake issued in one go, not one by one."
- "I want our name on it to mean something to whoever sees it."
- "I want a graduate from three years ago to still open theirs."

## Lo que este cliente GUARDA y comparte (los pilares de contenido)

1. **Qué hace bueno a un certificado** (el filo de la marca, en positivo): qué
   lleva un certificado que se puede comprobar, por qué el enlace de
   verificación es lo que le da valor a quien lo recibe, qué mira un empleador
   cuando lo abre, qué es un estándar abierto y por qué conviene emitir en uno.
   Nunca "lo que tu certificado NO prueba": siempre "lo que un certificado
   completo SÍ hace".
2. **Cómo-hacer del emisor** (registro utilidad, el dominante): qué debe llevar
   un certificado para que sirva, cuándo poner expiración, cómo se revoca uno
   emitido por error, cómo emitir 200 de golpe, qué criterios escribir (el
   campo "criteria" es lo que separa un certificado serio de un diploma de
   adorno), qué hacer cuando alguien pierde el suyo.
3. **El certificado como marketing** (el ángulo que nadie ocupa): cada alumno
   que sube su credencial a LinkedIn es una mención con enlace a tu escuela.
   Un certificado verificable es el único activo de marketing que tus alumnos
   publican por gusto propio. Referidos, alumni, re-inscripción.
4. **El estándar explicado en cristiano**: Open Badges, credenciales
   verificables, por qué la verificación se calcula y no se consulta, por qué
   el certificado tiene que seguir funcionando aunque la plataforma
   desaparezca. Sin jerga, con analogías (el checkout de Stripe, el candado
   del navegador, el QR del boleto de avión).
5. **El negocio de la formación**: tasa de finalización, alumnos que
   desaparecen a mitad de curso, cómo se llena el siguiente grupo, qué pasa
   entre que el alumno termina y se olvida de ti.

Ganchos de calibre galería (en inglés, positivos, pasan los 7 filtros duros):
- "Do this before you send your next batch of certificates"
- "Give your students proof they can share anywhere"
- "Three things that make a certificate easy to check"
- "Put your criteria on the certificate and watch what happens"
- "Your certificate should still open five years from now"
- "Every certificate you send can point back to your school"
- "Add your course to a student's LinkedIn in one tap"
- "Issue the whole intake in one go"

## Calendario de eventos propio (el peruano NO aplica)

Esta marca no vive de feriados de consumo. Sus fechas son de **ciclo
académico y laboral**, y casi todas se repiten dos veces al año por hemisferio:

- **Enero**: propósitos, "new year upskilling", nuevas matrículas, temporada
  alta de contratación.
- **Enero–marzo y agosto–septiembre**: arranque de ciclos y back to school
  (los dos picos de matrícula del año).
- **Mayo–junio**: temporada de graduaciones y de fin de curso → pico de
  emisión de certificados.
- **Marzo–mayo y septiembre–noviembre**: temporada de congresos y
  conferencias (certificados de asistencia y horas).
- **Noviembre–diciembre**: cierre de presupuesto de capacitación corporativa
  y campañas de venta de cursos (comportamiento, no precios).
- **Evergreen fuerte**: el momento exacto en que termina un curso — es cuando
  el alumno publica en LinkedIn, o no publica nada nunca.
- **Ciclos de renovación**: certificaciones anuales u obligatorias
  (seguridad, primeros auxilios, manipulación de alimentos, compliance) que
  vencen y hay que reemitir. Es el argumento nativo de la expiración.

## Reglas de afirmaciones (la ficha dura)

- **Verificable ≠ acreditado ≠ con validez legal.** Es LA trampa de esta
  marca. Diplomy prueba que el certificado lo emitió esa institución, a esa
  persona, en esa fecha, y que nadie lo alteró. **No** convierte un curso en
  título oficial, no acredita a la institución ante ningún ministerio y no le
  da validez legal a nada. Jamás escribir "legally valid", "officially
  recognized" ni "accredited". Se dice: verifiable, tamper-evident,
  independently checkable.
- **Nunca "blockchain"** (no lo usamos) ni "unhackable" / "impossible to
  fake" — además de impreciso, mete la idea de fraude en la cabeza del lector,
  y eso está prohibido (ver la regla de registro). Se describe en positivo:
  cualquiera puede confirmar que el certificado es el que la institución
  emitió.
- **Cero cifras inventadas** (regla dura de las 5 marcas). Y las cifras de
  fraude de CV o de títulos falsos **no se usan aunque sean verificables**: esa
  familia entera de datos vive de insinuar mala fe. El asombro de esta marca
  sale del lado bueno (cuánta gente agrega credenciales a su perfil, cuántos
  certificados emite un instituto al año), nunca del lado oscuro.
- **Nunca nombrar competidores** (Credly, Accredible, Sertifier, Certifier y
  compañía) ni compararse con ellos. Tampoco burlarse de Canva o de Word: el
  lector los usa hoy, y burlarse es burlarse de él. El contraste va contra el
  FORMATO ("a PDF proves nothing"), nunca contra la herramienta ni la persona.
- **Nada de testimonios ni casos de clientes** mientras no haya uno real con
  permiso. Las historias son ruta tipo ("this is how a small academy switches
  over"), nunca una persona concreta que existió.
- **Nada de promesas de resultado**: no prometemos más matrículas, más
  alumnos ni mejores empleos. Se describe el mecanismo, no el resultado.
- **Precios: JAMÁS** (regla dura global de Carlos para las 5 marcas — ni
  planes, ni "free tier", ni "starts at"). Tampoco en captions.
- **Verificar la norma antes de afirmar**: Open Badges va por la 3.0 y se
  alinea con Verifiable Credentials del W3C. Cualquier lámina que afirme algo
  normativo del estándar se contrasta con la especificación vigente de 1EdTech
  antes de publicar. Si el producto todavía no implementa algo, no se dice en
  presente.
- **LinkedIn**: lo que sí es cierto es que el alumno puede agregar la
  credencial a la sección de licencias y certificaciones con el enlace de
  verificación. No prometer integraciones, insignias ni sellos que LinkedIn no
  dé.

## Voz

Inglés plano, segunda persona, frases cortas. Registro de alguien que ya
manejó una escuela, no de una empresa de software: concreto, sin adjetivos de
marketing ("seamless", "empower", "revolutionize" están prohibidos). El
vocabulario del dominio siempre correcto: issue, revoke, expire, recipient,
issuer, criteria, verification page, credential. Cero emojis dentro del texto
de la lámina (van en el campo `emoji`, regla global del renderizador).

**El apodo corto del producto va entre comillas la primera vez que aparece**
(adaptación al inglés de la regla de Carlos, 2026-08-04): the "verify page",
the "badge". La audiencia fría no sabe que es el nombre que le damos a algo
nuestro. El nombre de marca (Diplomy) y el dominio (diplomy.org) nunca se
comillan.

## Identidad visual

- **Display: Figtree a 900** (`shared/fonts/Figtree-Variable.ttf`). La marca
  arrancó con un serif de alto contraste (Fraunces) y Carlos lo cortó el mismo
  día: **ilegible en el celular**. En carruseles la legibilidad manda sobre el
  carácter tipográfico; la personalidad la ponen las plates. No volver a un
  serif fino por mucho que "diga diploma".
- **Largo de post: el mínimo posible** (Carlos, 2026-08-04). 5 láminas por
  defecto: portada, 2 de valor, producto, cierre. 6 solo si el método tiene 3
  pasos reales. **Sin lámina de recap** en esta marca: repite lo ya dicho, y la
  regla aquí es cero redundancia.
- **El logo ES la paleta**: azul y blanco, nada más. Tokens: paper `#FBFCFE` ·
  ink `#0A1F45` · royal `#0058D8` (el azul exacto del logo) · royal-deep
  `#0043A8` · sky `#84B8F8` · mist `#DCEAFB` · line `#CBDCF3`.
- **Colisión con Radar Estatal, resuelta sin cambiar el color** (decisión de
  Carlos, 2026-08-04): las dos marcas son azules y LIGHT. La separación la
  hacen dos cosas, y hay que respetarlas o el feed se vuelve una sola cuenta:
  1. **Tipografía**: Diplomy usa **Fraunces Bold**, un serif de alto contraste
     (institucional, de diploma). Radar Estatal usa Chakra Petch (HUD techno).
     A distancia de scroll, el serif es lo que distingue.
  2. **Motivo de las plates**: Diplomy va de **sello, cinta, borde grabado
     tipo guilloché, roseta y check de verificación**. Radar Estatal va de
     anillos de radar y retícula blueprint. Prohibido cruzarlos.
  Además el papel de Diplomy es blanco frío puro (`#FBFCFE`), más limpio y
  contrastado que el papel azul-neblina de Radar (`#F6F9FC`).
- Sensación: **institucional moderno** — precisión de imprenta fina, no
  solemnidad antigua ni startup juguetona. Nada de dorado, nada de laureles
  ni pergaminos amarillentos: eso es diploma de los años 90.
- Marca LIGHT: portadas y value claras; emph oscuro azul-tinta da el contraste.
- Cuerpo: Montserrat.

## Estado operativo (2026-08-04)

- `logo.png`: recortado y con fondo transparente desde `diplomy_logo.png`
  (raíz del repo), 709×600.
- `plates/`: **28 de 30** generadas (faltan `value-paper-05` y `-06`; con los
  espejados el pool del caballo de batalla queda en 8, alcanza). Revisadas al
  100%: cero pseudo-texto, cero caras (los graduados de `cine-09` están
  desenfocados más allá del reconocimiento, las manos de `cine-07` no muestran
  cara, la pantalla de `cine-08` no tiene texto legible). Los 4 objetos
  opcionales también están, en `product/`.
- `plates_graded/`: 46 (28 + espejados de los abstractos). **El grade de esta
  marca lleva `punch()`** (grade.py, 2026-08-04): el grabado venía a ~2% de
  contraste y el duotono lo borraba entero — la portada graduada era papel en
  blanco. Medido sobre la ventana que ve Instagram, que recorta y 285..1635 y
  se come cualquier motivo pegado al borde superior.
- `product/`: pendiente. Cuando la app esté desplegada, capturar la **página de
  verificación** (el check verde con la marca de la academia), el editor de
  diseño del certificado y la vista de emisión masiva. La página de
  verificación es LA captura de la marca: es el producto entero en una imagen.
- `posts/val.json`: 3 posts de VALIDACIÓN renderizados (`out/val/`) para probar
  el sistema entero, no para publicar. Borrarlos antes del primer lote real, o
  el índice de la app los va a listar como una serie.
  Lo que destaparon: el renderizador escribía **"PARA GUARDAR"** en duro en la
  lámina de recap — ahora sigue `brand.json.lang` y en inglés pone "SAVE THIS"
  (`tools/render.py`). Y un emoji en portada de cine cae ENCIMA de la foto: el
  👀 aterrizó sobre el diploma enrollado y parecía un muñeco. En esta marca,
  portada `story` = sin emoji.
- Falta por decidir con Carlos: si el contenido sale de una cuenta en inglés
  nueva (handles), y si se hace investigación de competencia como en Radar
  Estatal (`COMPETENCIA.md`) antes del primer lote.
