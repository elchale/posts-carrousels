# Research — Diplomy, septiembre 2026

Investigación de fuentes primarias hecha el **2026-09-01** para subir la
SUSTANCIA de `brands/diplomy/posts/sep.json` (30 posts) al estado del arte
real de credenciales y L&D. Regla dura de Carlos para esta ronda: **cada
recomendación de cada lámina tiene que venir de lo que enseñan expertos
reales, no de relleno que suene plausible.**

Método: WebSearch quedó agotado a mitad de sesión, así que todo se hizo por
**fetch directo de la fuente** (curl + WebFetch sobre la URL canónica) y
lectura del texto crudo — specs, eCFR, govinfo, PDFs. Las tablas normativas
de Open Badges 3.0 se leyeron del HTML crudo porque un resumidor sobre la
misma URL reportó `name`/`description`/`criteria` como OPCIONALES cuando en
la spec son `[1]` REQUERIDOS.

Leyenda:
- **CONFIRMADO** = lo leí en la página/PDF citado.
- **PLAUSIBLE** = fuente secundaria o blog de proveedor, no norma.
- **NO VERIFICADO** = se buscó y no se pudo confirmar → **no se publica**.

> Nota de marca: varias fuentes de la §3 son competidores directos
> (Certifier, Sertifier, virtualbadge). Sirven como investigación interna;
> **nunca se nombran en un post** (regla dura de la ficha).

---

## 0 · Lo que cambió en los posts por culpa de esta investigación

Cuatro hallazgos obligaron a reescribir o reemplazar posts completos:

1. **«Los presupuestos de capacitación son use-it-or-lose-it en Q4» NO se
   pudo verificar** para L&D corporativo → el post 29 se reemplazó entero.
2. **LinkedIn eliminó el autofill** del botón Add to Profile → el post 19
   decía «in one tap», que hoy es falso.
3. **El «mínimo de 2 cm» para un QR no existe en ninguna norma** → el post 13
   cambió a las reglas que sí están en ISO/IEC 18004 y en DENSO WAVE.
4. **«Attendance» no existe como tipo de logro** en el vocabulario de Open
   Badges 3.0 / CTDL, y el corte profesional real (ICE) es
   asistencia · finalización · **evaluación** → posts 06 y 11 rehechos.

---

## 1 · El estándar: qué contiene de verdad una credencial verificable

Fuente principal: **1EdTech, Open Badges Specification v3.0**, Final Release
27 may 2024, documento 1.4.5 (29 jun 2026) — https://www.imsglobal.org/spec/ob/v3p0/
Complementos: guía de implementación https://www.imsglobal.org/spec/ob/v3p0/impl/ ·
W3C VC Data Model 2.0 y Bitstring Status List 1.0, ambas Recommendation del
15 may 2025.

### 1.1 Campos OBLIGATORIOS (esto es el esqueleto de todo el pilar de contenido)

**`Achievement`** — solo cinco campos son `[1]`: `id`, `type`, **`name`**,
**`description`**, **`criteria`**. — CONFIRMADO (tabla normativa §B.1.1).

**`AchievementCredential`** — `[1]`: `@context`, `id`, `type`,
`credentialSubject`, **`issuer`**, **`validFrom`**. `validUntil` es opcional.
— CONFIRMADO (§B.1.2).

> **Recomendación publicable:** un certificado completo nombra al emisor,
> nombra al que lo recibe, dice **qué había que hacer para ganarlo**, lo
> **describe**, y lleva fecha. Eso no es opinión: son los campos que la norma
> marca como obligatorios.
> → posts **01, 02, 03, 22**

### 1.2 `criteria` — el campo que separa un certificado serio de un adorno

Verbatim (§B.1.6): *"Criteria is used to allow would-be recipients to learn
what is required of them to be recognized with an assertion of a particular
achievement. It is also used after the assertion is awarded to a recipient to
let those inspecting earned achievements know the general requirements that
the recipients met in order to earn it."* — CONFIRMADO.

También: *"Embedding criteria allows either enhancement of an external
criteria page or increased portability and ease of use by allowing issuers to
skip hosting the formerly-required external criteria page altogether."*
La clase tiene solo dos propiedades: `id` = *"The URI of a webpage that
describes in a human-readable format the criteria"*, y `narrative`, tipado
como **Markdown**. — CONFIRMADO.

> **Recomendación publicable:** los criterios tienen **dos audiencias** —
> el alumno ANTES (por eso van en el sílabo y en la página del curso) y un
> extraño DESPUÉS (por eso van impresos en el certificado). Escribir una
> frase concreta de desempeño, no prosa de marketing.
> → posts **03, 20, 22**

### 1.3 Fechas: `validFrom`, `awardedDate`, `validUntil`

Verbatim sobre `awardedDate`: *"Timestamp of when the credential was awarded.
validFrom is used to determine the most recent version of a Credential in
conjunction with issuer and id. Consequently, the only way to update a
Credential is to update the validFrom, losing the date when the Credential was
originally awarded. **awardedDate is meant to keep this original date.**"*
— CONFIRMADO.

`validUntil`: *"If the credential has some notion of validity period, this
indicates a timestamp when a credential should no longer be considered valid.
After this time, the credential should be considered invalid."* — CONFIRMADO.

El sujeto lleva además `activityStartDate` / `activityEndDate` (*"The datetime
the activity started/ended"*) y `term` (*"The academic term in which this
assertion was achieved"*). — CONFIRMADO.

> **Recomendación publicable:** la regla de reemisión en un campo — **mantén
> el `id`, mueve el `validFrom`, no toques nunca el `awardedDate`**. Un
> certificado reemitido a un egresado de hace tres años lleva DOS fechas
> verdaderas: la del día que lo ganó y la del día que lo emitiste.
> → posts **07, 16, 17, 18**

### 1.4 Revocación y estado

`credentialStatus`: *"used to discover information about the current status of
a verifiable credential, such as whether it is suspended or revoked."*
— CONFIRMADO. La guía de implementación: *"The recommended option for checking
revocation is the Bitstring Status List v1.0 specification."* La revocación es
irreversible, la suspensión es reversible; las listas tienen un mínimo de
131.072 bits por «herd privacy» y los índices se asignan al azar. 1EdTech
deprecó su propia lista de revocación a favor de esta (oct 2025).
— CONFIRMADO.

### 1.5 La verificación se CALCULA, no se consulta

§9 verbatim: *"Verification is the process to determine whether a verifiable
credential or verifiable presentation is an authentic and timely statement of
the issuer... This includes checking that: the credential (or presentation)
conforms to the specification; the proof method is satisfied; and, if present,
the status check succeeds. Verification of a credential does not imply
evaluation of the truth of claims encoded in the credential."* — CONFIRMADO.

> **Recomendación publicable:** son **tres chequeos** cada vez que se abre el
> enlace: el emisor está nombrado, la firma cuadra (nada cambió desde que lo
> emitiste), y el estado se lee en vivo. Es exactamente el argumento de la
> marca contra «un booleano en una columna».
> → post **02**

### 1.6 `evidence` — enlazar el trabajo real

Verbatim: *"A description of the work that the recipient did to earn the
credential. This can be a page that links out to other pages if linking
directly to the work is infeasible."* Campos: `id`, `narrative`, `name`,
`description`, `genre`, `audience`. Y: *"If both the description and narrative
properties are present, displayers can assume the narrative value goes into
more detail and is not simply a recapitulation of description."* — CONFIRMADO.

La guía de implementación añade la regla operativa: *"Links that a learner or
another party has access to edit (i.e.: YouTube, photo sharing site, document
sharing site, etc.) should not be used."* — CONFIRMADO.

> **Recomendación publicable:** una pieza por certificado, alojada donde no se
> mueva (lo aloja la escuela), más una línea llana diciendo qué muestra.
> → post **04** (reemplazó al viejo «the hour a course ends», que era
> redundante con el 30 y no tenía fuente)

### 1.7 `alignment` — apuntar a un marco de competencias

*"Describes an alignment between an achievement and a node in an educational
framework."* Obligatorios dentro del objeto: **`targetName` [1]** y
**`targetUrl` [1]**; opcionales `targetCode`, `targetDescription`,
`targetFramework`, `targetType` (CFItem, CFRubric, ceasn:Competency,
ceterms:Credential, CTDL). — CONFIRMADO.

> **Recomendación publicable:** si nombras un nivel o una competencia, nombra
> **también dónde puede el lector ir a leer ese marco**. La norma exige la URL.
> → post **26**

### 1.8 Horas y créditos son campos de datos, no adorno

`Achievement.creditsAvailable`: *"Credit hours associated with this entity, or
credit hours possible. For example 3.0."* · `AchievementSubject.creditsEarned`:
*"The number of credits earned... This field correlates with the Achievement
creditsAvailable field."* — CONFIRMADO.
→ post **05**

### 1.9 Idioma y ediciones paralelas

`inLanguage` (tipo `LanguageCode`, **BCP 47** — ojo: es `inLanguage`, **no**
`@language`, que no aparece en la spec). Y `related`: *"The related property
identifies another Achievement that should be considered the same for most
purposes. **It is primarily intended to identify alternate language editions or
previous versions of Achievements.**"* — CONFIRMADO.

El nombre de la persona se modela por partes: `givenName`, `familyName`,
`additionalName`, `patronymicName`, prefijo de apellido (*"the leading part of
a family name (e.g. 'de' in the name 'de Boer')"*), `honorificPrefix/Suffix`.
— CONFIRMADO.

> **Recomendación publicable:** dos idiomas = **dos ediciones enlazadas de UN
> registro**, no dos registros; y el nombre va en su ortografía y su orden
> registrales.
> → post **14**

### 1.10 `version`, `humanCode`, `otherIdentifier`, `source`, `official`

- `version`: *"particularly useful when replacing a previous version with an
  update."* — CONFIRMADO → posts **07, 25**
- `humanCode`: *"The code, generally human readable, associated with an
  achievement."* + credential `id` = *"Unambiguous reference to the
  credential"* → post **08**
- `source`: *"The person, organization, or system that assessed the achievement
  **on behalf of the issuer**. For example, a school may assess the achievement,
  while the school district issues the credential."* — CONFIRMADO → post **10**
- Perfil del emisor, `official`: *"If the entity is an organization, official is
  the name of an authorized official of the organization."* → post **27**

### 1.11 «Baking» sigue vivo en 3.0

`AchievementSubject.image`: *"must be a PNG or SVG image, and should be prepared
via the 'baking' instructions."* PNG por chunk `iTXt` con clave
`openbadgecredential`; SVG por una etiqueta `<openbadges:credential>`.
— CONFIRMADO. Advertencia real: una imagen «horneada» lleva el payload entero,
PII incluida.
→ post **12**

### 1.12 El `id` es una URL que no se puede mover

`Achievement.id` = *"Unique URI for the Achievement"*, y la guía lo llama el
campo más importante: una URL HTTPS en un dominio estable donde el logro se
publica de verdad. — CONFIRMADO.

Refuerzo canónico: **W3C / Tim Berners-Lee, «Cool URIs don't change»**
(https://www.w3.org/Provider/Style/URI) — *"A cool URI is one which does not
change."* · *"URIs don't change: people change them."* · *"It is the duty of a
Webmaster to allocate URIs which you will be able to stand by in 2 years, in 20
years, in 200 years."* · Cuando se rompen, los usuarios *"lose confidence in
the owner of the server"*. El método: dejar FUERA de la URI todo lo que se pone
viejo (nombres de autor, clasificaciones, «draft/old/latest», extensiones).
— CONFIRMADO.

> **Recomendación publicable:** una URL de certificado **no lleva el nombre del
> curso ni el año**, porque eso es justo lo que cambia en un rebrand.
> → post **25**

---

## 2 · Qué miran de verdad los empleadores (encuestas reales, sin marco de fraude)

> Nota: se descartó a propósito toda la familia de datos de fraude de CV y
> títulos falsos. Regla de la marca.

### 2.1 SHRM — la muestra más grande, y la pregunta más útil

**SHRM + SHRM Foundation, *The Rise of Alternative Credentials in Hiring*,
campo verano 2021** —
https://www.shrm.org/content/dam/en/shrm/about/press-room/The-Rise-Of-Alternative-Credentials-In-Hiring.pdf
Muestra: 500 ejecutivos · 1.129 profesionales de RRHH · 1.200 supervisores ·
1.525 trabajadores (ponderada). — CONFIRMADO.

**El hallazgo que sostiene el post 01.** SHRM preguntó qué haría que una
credencial alternativa equivaliera a educación formal. Para RRHH — los que
efectivamente filtran postulaciones — el ranking es:

| # | Profesionales de RRHH |
|---|---|
| 1 | **«Si hay un examen o prueba para obtenerla (o sea, hay gente que la falla)» — 59%** |
| 2 | Obtenida a través de una organización relevante del rubro — 46% |
| 3 | El tipo de habilidad que representa — 45% |
| 4 | Reputación del proveedor — 41% |
| 5 | Requiere experiencia laboral real — 33% |

(Ejecutivos y supervisores ponen «tipo de habilidad» primero, 35% / 37%.)
— CONFIRMADO (tabla leída en el PDF).

Otros datos CONFIRMADOS del mismo informe: 86% ejecutivos / 80% supervisores /
91% RRHH consideran valiosas las credenciales alternativas para el desarrollo;
85% / 76% / 80% aceptan que ciertas credenciales alternativas equivalen a un
grado asociado; solo un tercio de los RRHH cuyas empresas usan prefiltrado
automático dice que ese prefiltrado siquiera reconoce credenciales alternativas
— y SHRM lo lee como *"there is still no standard approach to collecting this
information"*. **Ese último es el mejor argumento de que el cuello de botella
es la legibilidad por máquina, no la voluntad del empleador.**

### 2.2 UPCEA + Collegis — las objeciones son informativas, nunca acusatorias

**UPCEA + Collegis, feb 2023, n=514 empleadores** —
https://collegiseducation.com/wp-content/uploads/2023/02/UPCEA-Collegis-Employers-and-Microcredentials-Report.pdf
— CONFIRMADO.

- 95% al menos algo familiarizados con credenciales no-grado.
- 74% dicen que ayudaron a cubrir brechas de habilidades; 71% que su
  organización es cada vez más receptiva; **80% que una ruta apilable
  (stackable) subiría su interés.**
- Lo que asocian a un CV con credencial no-grado: 76% «disposición a
  desarrollarse», 63% «iniciativa», 60% «competencias fácilmente comunicadas».
- **Las brechas que nombran: 46% «inseguro de la calidad», 42% «inseguro de
  las habilidades adquiridas», 33% «inseguro del alineamiento con estándares»,
  31% «inseguro de qué representa la credencial».**

> **Lectura clave para la marca:** todas las objeciones top son *«no sé qué
> significa esto»*, ninguna es *«no le creo a esta persona»*. Es un problema de
> metadatos, y es exactamente lo que resuelven `criteria`, `description` y
> `alignment`.
> → posts **01, 11, 15, 20, 22, 26**

### 2.3 Coursera — micro-credenciales 2025

**Coursera Micro-Credentials Impact Report 2025** (2.000+ estudiantes y
empleadores) — https://www.coursera.org/enterprise/resources/ebooks/micro-credentials-report-2025
— CONFIRMADO: 96% de los empleadores dicen que una micro-credencial fortalece
una postulación; 87% contrataron a alguien con una en el último año; los
estudiantes tienen 2x más probabilidad de elegir un programa que las ofrece.

### 2.4 Crecimiento real del formato (usar con cuidado)

- **Credential Engine, *Counting U.S. Postsecondary and Secondary Credentials*
  2025**: 1.850.034 credenciales únicas en EE.UU. (vs 1.076.358 en 2022);
  badges 430.272 → 1.022.028 —
  https://credentialengine.org/wp-content/uploads/2025/12/Counting-Credentials-2025-Report.pdf
  — CONFIRMADO.
- **1EdTech Badge Count 2025**: 320,4 millones de badges otorgados a nivel
  global (74,7M en 2022) — https://content.1edtech.org/badge-count-2025
  — CONFIRMADO.
- ⚠ **Ambos informes advierten que parte del salto es mejor conteo**
  (24 plataformas respondientes vs 15; global incluido por primera vez).
  Si alguna vez se citan, va la advertencia.

### 2.5 Dos correcciones a supuestos comunes — NO publicar la versión fácil

- **«Los requisitos de título siguen cayendo» ya no es cierto.** Indeed Hiring
  Lab (ene 2026): 19,3% de las ofertas exigían bachelor's en nov 2025, **arriba**
  desde 16,6% en nov 2023 —
  https://hiringlab.indeed.com/2026/01/28/where-do-college-degrees-still-matter-in-a-skills-first-job-market/
  — CONFIRMADO.
- **Burning Glass Institute / HBS (2024)**: quitar el requisito de título movió
  solo ~97.000 de 77 millones de contrataciones anuales, *"not even 1 in 700"*,
  y casi todo el efecto vino del 37% de las empresas —
  https://www.burningglassinstitute.org/research/skills-based-hiring-2024
  — CONFIRMADO. Si se usa: «la intención es real, la plomería aún no está
  puesta», **nunca** como mala fe del empleador.

### 2.6 NO VERIFICADO

- **Cualquier efecto medido de que un alumno publique su credencial en LinkedIn
  sobre la visibilidad de la institución emisora.** Solo hay afirmaciones de
  proveedores, sin método ni muestra. **No publicar.** (Por eso el post 19 ya
  no promete alcance, sino que explica el mecanismo.)

---

## 3 · Qué va en un certificado: la práctica de emisores

### 3.1 El conjunto núcleo (unánime entre todas las fuentes leídas)

Nombre completo del receptor · título del curso/credencial · organización
emisora con su logo · fecha de emisión · una firma · una **ruta de
verificación**. Añadidos frecuentes pero no unánimes: fecha de vencimiento,
criterios explícitos, nombre del instructor, horas/créditos, calificación.
**Ninguna fuente exige un «nivel» en la cara.** — CONFIRMADO como consenso a
través de: Certifier https://certifier.io/blog/14-best-practices-of-certificate-design
y https://certifier.io/blog/how-to-design-a-certificate-step-by-step-guide ·
Sertifier https://sertifier.com/blog/what-is-a-digital-credential/ ·
virtualbadge https://virtualbadge.io/blog-articles/a-practical-checklist-for-launching-digital-certificates
· y las tablas normativas de OB 3.0 (§1).
→ posts **01, 21**

### 3.2 Identificador único

Certifier, verbatim: *"Every certificate issued has a unique identifier (serial
number), or UUID, which guarantees its uniqueness."* — CONFIRMADO.
virtualbadge nombra «faltan identificadores únicos o enlaces de verificación»
como el fallo #1 de emitir a mano, y el ID es **el respaldo cuando el QR no
escanea**: la página de validación acepta el QR **o** el número escrito.
— CONFIRMADO
(https://virtualbadge.io/blog-articles/how-real-time-validation-strengthens-digital-certificates).

**Ninguna fuente prescribe un formato** más allá de «serial o UUID». Cualquier
plantilla más específica (por ejemplo «curso, año, correlativo») sería
inventada → el post 08 dice **«corto y único, nunca reutilizado»** y ya no
propone una plantilla.
→ post **08**

### 3.3 QR en el certificado impreso

- **Debe abrir esa credencial concreta**, no un sitio genérico; la página
  muestra emisor, descripción y criterios. — CONFIRMADO
  (https://certifier.io/blog/verifiable-digital-certificate).
- **QR Code es ISO/IEC 18004** — DENSO WAVE (el inventor),
  https://www.qrcode.com/en/about/standards.html — CONFIRMADO.
- **Zona de silencio: cuatro módulos por los cuatro lados.** Verbatim:
  *"QR Code requires a four-module wide margin at all sides of a symbol."*
  https://www.qrcode.com/en/howto/code.html — CONFIRMADO (corroborado por GS1).
- **Imprimir lo más grande que permita el diseño.** Verbatim: *"it is
  recommended that QR Code symbols be printed as large as possible within the
  available printing area"* y *"The larger the module is, the more stable and
  easier to read"* — https://www.qrcode.com/en/howto/cell.html — CONFIRMADO.
- Módulo mínimo en impresora láser común ≈ **0,17 mm** —
  https://www.qrcode.com/en/faq.html — CONFIRMADO. GS1 fija X mínima de
  0,396 mm y objetivo 0,495 mm para GS1 QR Code (GS1 General Specifications
  26.0) — CONFIRMADO.
- ⚠ **El «mínimo de 2 cm» que repite medio internet NO aparece en ninguna
  especificación.** El post 13 fue reescrito para no decirlo.
- **Ninguna fuente da una regla de ubicación** (esquina inferior derecha, etc.)
  → se eliminó esa lámina del post 13.
→ post **13**

### 3.4 Terminología: qué puede reclamar cada documento

**La cita fuerte — ICE (Institute for Credentialing Excellence), ACAP
Self-Assessment Checklist (rev. 2019)**, .docx oficial:
https://www.credentialingexcellence.org/Portals/0/Docs/Accreditation/ACAP%20Self-Assessment%20Checklist%20(rev.%202019).docx
— CONFIRMADO.

> *"This standard is for an assessment-based certificate program, **not a
> certificate of attendance or participation, or a certification program**."*

ICE 1100:2019, Standard 1, los tres criterios verbatim:
> *"Provides instruction and training to aid participants in acquiring specific
> knowledge, skills, and/or competencies"* ·
> *"Evaluates participants' accomplishment of the intended learning outcomes"* ·
> ***"Issues a certificate only to those meeting the standard for the
> assessment"***

Standard 3 exige publicar *"explanation of what inferences can properly be made
regarding individuals who hold the certificate"* y tener política escrita para
quien *"claims, states, or implies that the certificate is a professional
certification"*. — CONFIRMADO.

**Definiciones formales — vocabulario `achievementType` de Open Badges 3.0,
cada término «exact match» de CTDL (Credential Engine):** — CONFIRMADO
- **CertificateOfCompletion**: *"Credential that acknowledges completion of an
  assignment, training or other activity. A record of the activity may or may
  not exist..."*
- **Certificate**: *"Credential that designates requisite knowledge and skills
  of an occupation, profession, or academic program."*
- **Certification**: *"**Time-limited, revocable, renewable** credential awarded
  by an authoritative body for demonstrating the knowledge, skills, and
  abilities to perform specific tasks or an occupation."*
- **Diploma**: *"Credential awarded by educational institutions for successful
  completion of a course of study or its equivalent."*
- **License**: otorgada por una agencia de gobierno, constituye autoridad legal,
  *"time-limited and must be renewed periodically"*.
- **MicroCredential**: *"Credential that addresses a subset of field-specific
  knowledge, skills, or competencies; **often developmental with relationships
  to other micro-credentials and field credentials**."*
- **«Attendance» aparece CERO veces en toda la spec de OB 3.0** (grep sobre el
  texto completo de la página). Esa ausencia es informativa: la asistencia no
  es un tipo de logro reconocido en el vocabulario.

> **Recomendación publicable, y el corte real:** asistencia (estuvo) ·
> finalización (lo terminó) · **evaluación (pasó un estándar que se podía no
> pasar)**. Y **nunca** dar a entender «certification»: esa palabra implica un
> cuerpo externo que renueva.
> → posts **06** (rehecho a tres categorías), **09**, **11**

⚠ **ASTM E2659: NO VERIFICADO.** astm.org y webstore.ansi.org devuelven 403.
No atribuir texto a esa norma. Lo citable es **ICE 1100:2019**.

### 3.5 Horas de contacto y CEU

**IACET**, verbatim en dos páginas distintas: *"One (1) CEU is equivalent to ten
(10) contact hours of participation in an organized learning experience
delivered under responsible sponsorship, capable direction, and qualified
instruction."* —
https://www.iacet.org/standards/continuing-education-unit-ceu/about-the-ceu/ y
https://www.iacet.org/news/iacet-blog/blog-articles/what-is-a-ceu/
— CONFIRMADO.

⚠ **Ninguna de las dos páginas define «contact hour» por separado**; la
definición formal está detrás del muro de pago de ANSI/IACET 1-2018.
NO VERIFICADO → el post 05 dice «tiempo dentro de la experiencia de aprendizaje
organizada», que es la frase de la propia definición del CEU, y no inventa una
definición aparte.

La categoría 8 del estándar ANSI/IACET se llama *"Awarding the IACET CEU and
Maintaining Learner Records"* — CONFIRMADO (el contenido es de pago; no citar).
→ post **05**

### 3.6 Nivel y marcos de cualificaciones

- **EQF: 8 niveles**, y Europass dice que los certificados y diplomas de nueva
  emisión *"should in principle contain a clear reference to the appropriate
  EQF and NQF level"* —
  https://europass.europa.eu/en/europass-tools/european-qualifications-framework
  — CONFIRMADO. Descriptores por Knowledge / Skills / Responsibility & Autonomy
  en https://europass.europa.eu/en/description-eight-eqf-levels — CONFIRMADO.
- **CEFR: seis niveles A1 a C2**, agrupables en Basic User / Independent User /
  Proficient User, *"defined through 'can-do' descriptors"*, lanzado en 2001 —
  Council of Europe,
  https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
  — CONFIRMADO (leído por curl; coe.int devuelve 403 a algunos fetchers).
  Corroborado en Cambridge English
  https://www.cambridgeenglish.org/exams-and-tests/cefr/.
- **Open Badges 3.0 NO tiene campo de nivel.** El nivel vive en el título, en
  `achievementType`, o en los niveles de rúbrica de `ResultDescription`
  (`allowedValue` *"ordered from low to high"*, `requiredValue` *"required to
  pass as determined by the achievement creator"*). — CONFIRMADO.

> **Recomendación publicable:** el nivel va **dentro del título** y viene de una
> escala que el lector puede ir a mirar; y como `alignment` exige `targetUrl`,
> nombrar el marco significa decir dónde leerlo.
> → posts **11** (descriptores «can-do»), **16** (`requiredValue` = la nota de
> corte fijada de antemano), **26**

### 3.7 Firma y firmante — el área más floja de la literatura

Lo único CONFIRMADO: la firma debe ser *"of the person responsible for issuing
the certificate"* (Certifier), el nombre del instructor es opcional
*"(if applicable)"*, y OB 3.0 tiene en el perfil del emisor
`official` = *"the name of an authorized official of the organization"*.

**Cuántas firmas van, y si el nombre impreso y el cargo deben ir bajo la línea:
NO VERIFICADO — no se publica.**

> Lo honesto y publicable, que además es el mejor argumento de la marca: **una
> firma dibujada es un elemento de diseño, no un mecanismo criptográfico.** OB
> 3.0: *"at least one proof mechanism... MUST be expressed for a credential to
> be a verifiable credential"*. Europass sella sus credenciales con un
> *"electronic seal (a form of digital signature belonging to a trusted
> institution)"* —
> https://europass.europa.eu/en/european-digital-credentials-learning
> — CONFIRMADO.
> → post **27** (lámina «HONEST») y post **10** (a quién nombrar de verdad:
> quien **evaluó**, campo `source`)

### 3.8 Multilingüe

European Digital Credentials for Learning *"can be issued in all EU and Europass
languages"*; incluyen verificaciones que permiten *"anyone viewing the
credential to trust its origin and verify its validity and authenticity"*.
— CONFIRMADO (URL arriba). Combinado con `inLanguage` + `related` de §1.9.
→ post **14**

### 3.9 Parcial y apilable

Combinando CTDL **MicroCredential** (*"often developmental with relationships to
other micro-credentials"*) con la ausencia de cualquier tipo «parcial» en el
vocabulario, y con el 80% de UPCEA sobre rutas apilables:

> **Recomendación publicable:** no lo llames «parcial». Emite un
> **certificado de finalización del módulo que sí se completó** — es un logro
> real por derecho propio — y enlázalo al programa mayor con `related` /
> `alignment`. Esto es razonamiento desde la norma, no una cita: se marca como
> **PLAUSIBLE (derivado)**.
> → post **15**

⚠ **Cómo redactar una finalización parcial (empezó y no terminó): NO
VERIFICADO.** Ninguna fuente leída lo trata. Por eso el post 15 no propone
fraseo de «parcial».

---

## 4 · LinkedIn: cómo funciona HOY la sección de licencias y certificaciones

⚠ **Dos cosas se movieron bajo los pies de LinkedIn y obligaron a reescribir el
post 19.**

1. **`addtoprofile.linkedin.com` está muerto**: hoy hace 301 al artículo de
   ayuda `a528030`. El índice CDX de Wayback muestra el último 200 el
   2026-03-20 y el primer 301 el 2026-05-03. — CONFIRMADO.
2. El artículo «Manage Licenses & certifications» (`a567169`) **da 404** en
   linkedin.com; se leyó del snapshot de Wayback del 2026-06-09. — CONFIRMADO.

### 4.1 El autofill se eliminó

LinkedIn, verbatim (https://www.linkedin.com/help/linkedin/answer/a528030):
> *"if a member wants to add certification or degree fields to their profile,
> they can continue to do so using the Add to Profile button. However, **it will
> no longer autofill and members must enter the relevant information directly on
> their profile.** ... Existing customized buttons will continue to work, but
> they'll now direct to the new experience without auto-filling certificate or
> degree information."*
— CONFIRMADO.

> **Consecuencia directa:** el post 19 decía **«Add your course to a student's
> LinkedIn in one tap»**. Eso hoy es **falso**. El post se reescribió: los tres
> campos que importan, y una lámina que le dice al emisor que **avise a sus
> alumnos que ya no se llena solo**.

### 4.2 Los campos

Lo que LinkedIn nombra con sus propias palabras:
- **«Issuing organization»** — y es un typeahead: *"A list displaying companies
  will appear as you type in the Issuing organization field. **Be sure to select
  the correct authority from the menu so their logo appears next to the
  certification on your profile.**"* — CONFIRMADO.
- **«Credential URL»** — etiqueta propia de LinkedIn (fila `certUrl` del
  microsite archivado); a `certId` lo llama «Certificate ID». — CONFIRMADO.
- **Las fechas son mes + año, sin día** — referencia de API
  (`startMonthYear` / `endMonthYear`: *"Does not support 'day' field"*),
  https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/certification
  — CONFIRMADO.

**PLAUSIBLE (solo terceros, LinkedIn no publica la lista de campos del
formulario):** las etiquetas «Name», «Issue date», «Expiration date»,
«Credential ID», «Skills» y la casilla «This credential does not expire».
**«Media»: NO VERIFICADO — no publicar.**

Dato útil y poco conocido, CONFIRMADO: *"licenses and certifications appear in
the order they are added and cannot be manually re-ordered."*

### 4.3 Logo y Página

- Se necesita **LinkedIn Page** para el programa Add to Profile y para que
  aparezca cualquier logo; *"Add to Profile is free to any company or school
  that has a LinkedIn Page. There's no approval process required."* — CONFIRMADO.
- El logo solo aparece si el alumno elige la organización real del menú; texto
  libre = entrada sin logo. — CONFIRMADO.
- *"The Add to Profile program currently uses only the logo featured on your
  Page. If you want to show a different logo for a certification, create a Page
  for your certification."* — CONFIRMADO.

### 4.4 ¿Publica un post en el feed?

- La página de marketing **retirada** afirmaba que sí y que el usuario empieza a
  seguir la Página. **No lo respalda ninguna página viva de LinkedIn.**
- El ajuste vivo **«Share profile updates»** cubre solo *"job changes,
  promotions, education changes, and work anniversaries"* — las palabras
  «certification» y «license» **no aparecen** en esa página
  (https://www.linkedin.com/help/linkedin/answer/86236). — CONFIRMADO por
  ausencia.
- El auto-follow **sí** está documentado para escuelas/títulos: *"When graduates
  add your school to their profile, they automatically begin following your
  LinkedIn Page."* — CONFIRMADO.

> **Por eso el post 19 no promete difusión.** Solo el mecanismo verificable:
> elegir la organización del menú (para que salga el logo), pegar la URL de la
> credencial, poner mes y año.

### 4.5 Verificación

La sección es **autodeclarada**: todos los campos son opcionales en el modelo de
LinkedIn, LinkedIn deriva las consultas al emisor (*"We are not accepting
partner inquiries at this time"*), y el typeahead solo **asocia** el logo de una
Página — eso no es verificación. — CONFIRMADO.
→ post **19**

---

## 5 · L&D corporativo: presupuestos, reembolso, cartas y expedientes

### 5.1 Reembolso de estudios — IRS §127

- **$5.250 por empleado por año calendario**, exclusión de renta bruta.
  Estatuto verbatim (26 U.S.C. §127(a)(2)) —
  https://www.govinfo.gov/content/pkg/USCODE-2023-title26/html/USCODE-2023-title26-subtitleA-chap1-subchapB-partIII-sec127.htm
  — CONFIRMADO. Ratificado por IRS Publication 15-B (2026),
  https://www.irs.gov/pub/irs-pdf/p15b.pdf — CONFIRMADO.
- Califican matrícula, aranceles, libros, materiales y equipo, cursos dictados
  por el empleador y pagos de préstamo educativo. **No** califican herramientas
  que el empleado se queda, comidas, alojamiento, transporte, ni cursos de
  deportes, juegos o pasatiempos. — CONFIRMADO.
- **Cambio 2025 verificado en la ley promulgada** (Pub. L. 119-21 §70412,
  https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm):
  el pago de préstamos bajo §127 es **permanente**, y el tope se **indexa a
  inflación pero solo para años tributarios posteriores a 2026**. Para 2026
  sigue siendo exactamente $5.250. — CONFIRMADO.
- ⚠ **No publicar ninguna cifra indexada de 2027.** No existe todavía.

### 5.2 Qué papeles pide de verdad un reembolso

Política publicada de **Duke University** (SHRM está tras muro de pago):
https://hr.duke.edu/benefits/educational/employee-tuition-assistance/reimbursement/
— CONFIRMADO.
- **Preaprobación antes del curso** (aplicación aprobada por el supervisor).
- Después, **dentro de 90 días de terminado el curso**: factura detallada de
  matrícula, y **transcript no oficial que demuestre nota C o mejor** (*"a
  'Pass' or 'Satisfactory' designation if a grade is not provided"*). Verbatim:
  *"screenshots of grades will no longer be accepted."*
- Verbatim sobre el plazo: *"All required documentation must be submitted within
  90 days of course completion; otherwise, you risk forfeiting your
  reimbursement."*
- Datos que el empleado debe declarar del curso: *"Sem/Qtr, Term, Year, Course
  Name, Course Type, Number, Start Date, Last Date, ESL?, Academic Credit?,
  Amount Requested"*.

Modelo público equivalente del gobierno federal: **OPM Standard Form 182**
(https://www.opm.gov/forms/pdf_fill/sf182.pdf), cuya Sección F es
*"Certification of Training Completion and Evaluation"* — CONFIRMADO.

> **Recomendación publicable:** lo que pide finanzas es **curso, fechas, nombre
> tal como lo tiene el empleador, y prueba de finalización con un RESULTADO**
> (no una línea de asistencia) — y la ventana se cierra en **semanas, no
> meses**. Por eso se emite la misma semana que termina el curso.
> → post **24**

### 5.3 ⚠ «Use it or lose it» en Q4 — NO VERIFICADO para capacitación

- El efecto real y citable es de **compras públicas federales**, no de L&D:
  Liebman & Mahoney, NBER w19481 — *"Spending in the last week of the year is
  4.9 times higher than the rest-of-the-year weekly average, and year-end
  information technology projects have substantially lower quality ratings."*
  https://www.nber.org/papers/w19481 — CONFIRMADO.
- **Training Magazine, 2025 Training Industry Report**: se leyó completo y **no
  contiene ningún dato de estacionalidad, trimestre ni cierre fiscal**.
  https://trainingmag.com/2025-training-industry-report/ — CONFIRMADO por
  ausencia.
- **LinkedIn Workplace Learning Report**: igual, sin datos de estacionalidad.
  — CONFIRMADO por ausencia.
- **ATD State of the Industry: NO OBTENIDO** (td.org devolvió 429). No citar
  ninguna cifra de ATD.

> **Consecuencia:** el post 29 («Training budgets have one quarter left»)
> descansaba entero sobre folclore. **Se reemplazó** por «Some of your courses
> come back on a fixed clock», que sí tiene norma detrás (§5.5).

Cifras que **sí** son citables del mismo informe de Training Magazine
(CONFIRMADO, metodología: firma externa, abril-julio 2025, empresas de EE.UU.
con 100+ empleados, proyectado sobre 152.572 empresas): gasto total de
capacitación en EE.UU. $102,8 mil millones en 2025 (+4,9%); **gasto en
productos y servicios externos +29%, a $16 mil millones** (esa es la bolsa a la
que le vende una academia); $874 por alumno; horas promedio **bajaron a 40**
desde 47; compliance empatado como mayor línea del presupuesto con 13%.

### 5.4 Cartas de constancia de estudios

- Se llama **enrollment verification**, la emite el Registrar, y confirma
  *"enrollment status, dates of attendance, and degree(s) conferred"*; se usa
  ante *"insurers and lenders"* y para confirmar títulos a *"employers"* —
  Penn State, https://www.registrar.psu.edu/enrollment-verifications/
  — CONFIRMADO.
- La versión oficial es un documento de seguridad: papel especial con el código
  federal de la escuela, sello y firma del Registrar, enviado por correo físico.
  — CONFIRMADO.
- **Los terceros no van al Registrar**: se derivan al **National Student
  Clearinghouse**, que cubre el **97% de los estudiantes de educación superior
  actualmente matriculados en EE.UU.**, y lo financian *"the employers,
  background screening firms and others who use them"* —
  https://www.studentclearinghouse.org/solutions/ed-verifications/ — CONFIRMADO.

> **Recomendación publicable:** lo que el solicitante necesita es lo mismo que
> pone un Registrar: **qué estudió, en qué fechas, y cómo terminó**, en algo que
> cualquiera pueda abrir sin cuenta. Un enlace por certificado reemplaza la
> carta retipeada. Y toda una utilidad nacional existe solo porque las
> instituciones no querían responder esos correos una por una.
> → post **23**

### 5.5 Expedientes de capacitación: qué exige la norma, literal

Todo leído del texto crudo de eCFR / OSHA. — CONFIRMADO.

| Norma | Qué debe contener el registro | Retención / ciclo |
|---|---|---|
| Montacargas, 29 CFR 1910.178(l)(6) | *"the name of the operator, the date of the training, the date of the evaluation, and the identity of the person(s) performing the training or evaluation"* | evaluación **al menos cada 3 años** (l)(4)(iii) |
| Patógenos en sangre, 29 CFR 1910.1030(h)(2) | fechas · *"contents or a summary"* · *"names and qualifications of persons conducting the training"* · *"names and job titles of all persons attending"* | **3 años**; capacitación **anual** (g)(2)(ii) |
| Bloqueo/etiquetado, 29 CFR 1910.147(c)(7)(iv) | *"each employee's name and dates of training"* | inspección periódica **al menos anual** (c)(6)(i) |
| Tala, 29 CFR 1910.266(i)(10) | identidad del empleado · fechas · firma de quien capacitó | *"The most recent training certification shall be maintained"* |
| HAZWOPER, 29 CFR 1910.120(e)(6) | ***"A written certificate shall be given to each person so certified"*** | **8 horas de refresco anuales** (e)(8) |
| Protección respiratoria, 29 CFR 1910.134(m) | identificación · método de prueba · marca/modelo/talla · fecha · resultado | recapacitación **anual** (k)(5) |
| Manipulador de alimentos, California, Cal. H&SC §113948 | el establecimiento *"shall maintain records documenting that each food handler... possesses a valid food handler card"* | tarjeta válida **3 años** |

- **ISO 9001:2015 cláusula 7.2(d)** exige *"retain appropriate documented
  information as evidence of competence"* — citado verbatim en la publicación
  oficial del **ISO 9001 Auditing Practices Group (ISO/TC 176 + IAF)**,
  https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf
  — CONFIRMADO. Y la frase comercialmente más importante del documento:
  > *"training records could be verified to ensure that a training course had
  > been successfully completed, but **a participation at the course alone does
  > not necessarily provide evidence that the trainee is competent**, as it may
  > only demonstrate that knowledge was gained, not necessarily that it is being
  > effectively applied."*

> **Recomendación publicable, doble entrega:** la norma pide **las dos cosas a
> la vez** — un certificado individual por persona (HAZWOPER lo dice literal) y
> una **planilla para la empresa** con nombres, **cargos**, quién capacitó y qué
> se cubrió (patógenos en sangre lo enumera). No es una preferencia de venta:
> son dos lectores con dos obligaciones distintas.
> → posts **10, 28, 29**

> **Y sobre los ciclos:** hay cursos anuales por norma y cursos con reloj de
> varios años. Hacer coincidir la fecha de vencimiento del certificado con el
> ciclo real convierte las renovaciones en un calendario.
> → posts **17, 29**

⚠ **«La certificación de RCP/primeros auxilios dura 2 años»: NO VERIFICADO.**
redcross.org y cpr.heart.org bloquean con 403. **No publicar la cifra.**
Sustituto CONFIRMADO, de OSHA 3317 (*Best Practices Guide: Fundamentals of a
Workplace First-Aid Program*,
https://www.osha.gov/sites/default/files/publications/OSHA3317first-aid.pdf):
la retención de destrezas es de 6 a 12 meses, el comité ECC de la AHA
recomienda práctica cada 6 meses, y *"Instructor-led retraining for
life-threatening emergencies should occur at least annually."*

---

## 6 · Índice: qué fundamenta cada post

| # | Post | Fuente que lo sostiene |
|---|---|---|
| 01 | what a recruiter checks | SHRM 2021 ranking de RRHH (§2.1) + campos obligatorios OB 3.0 (§1.1) |
| 02 | easy to check | OB 3.0 §9 Verification, los tres chequeos (§1.5) |
| 03 | syllabus lines | `criteria`, audiencia «would-be recipients» (§1.2) |
| 04 | link the work | `evidence` + regla de enlaces no editables (§1.6) |
| 05 | hours on it | IACET 1 CEU = 10 contact hours (§3.5) + `creditsAvailable` (§1.8) |
| 06 | attended or assessed | ICE 1100 Std 1 + vocabulario CTDL; «attendance» ausente (§3.4) |
| 07 | after you send | `awardedDate` / `validFrom` / `version` / `credentialStatus` (§1.3, §1.4) |
| 08 | number every one | credential `id` + `humanCode` (§1.10) + el ID como respaldo del QR (§3.2) |
| 09 | congress lanyard | asistencia sin reclamo de examen (§3.4) + horas (§3.5) |
| 10 | who assessed it | `source` (§1.10) + registros OSHA que nombran al evaluador (§5.5) |
| 11 | what they can do | `description` obligatoria (§1.1) + descriptores «can-do» del CEFR (§3.6) + UPCEA «no sé qué representa» (§2.2) |
| 12 | frame and link | «baking» PNG/SVG en OB 3.0 (§1.11) |
| 13 | QR on printed | ISO/IEC 18004, zona de 4 módulos, imprimir grande (§3.3) |
| 14 | language | `inLanguage` + `related` (§1.9) + Europass multilingüe (§3.8) |
| 15 | modules finished | CTDL MicroCredential (§3.4) + 80% rutas apilables UPCEA (§2.2) |
| 16 | self paced | `activityEndDate` (§1.3) + `requiredValue` fijado de antemano (§3.6) |
| 17 | refresher renewals | `validUntil` (§1.3) + Certification «time-limited, revocable, renewable» (§3.4) + ciclos OSHA (§5.5) |
| 18 | past intakes | `awardedDate` conserva la fecha original (§1.3) |
| 19 | LinkedIn fields | Ayuda de LinkedIn: autofill eliminado, typeahead, mes/año (§4) |
| 20 | course page | `criteria.id`, página pública leída antes de inscribirse (§1.2) |
| 21 | checks before a batch | conjunto núcleo (§3.1) + entrada manual como fallo nombrado (§3.2) |
| 22 | criteria lines | `criteria` obligatoria, Markdown, dos audiencias (§1.2) |
| 23 | letter requests | enrollment verification: estado, fechas, resultado (§5.4) |
| 24 | reimbursement | IRS §127 (§5.1) + requisitos y plazo de 90 días (§5.2) |
| 25 | rebrand | «Cool URIs don't change» + `version` / `related` (§1.12) |
| 26 | level on it | EQF «clear reference to the level» + CEFR + `alignment.targetUrl` (§3.6, §1.7) |
| 27 | who signs | `official` (§1.10) + honestidad: la firma es diseño, la prueba es el enlace (§3.7) |
| 28 | corporate two records | 1910.1030(h)(2) planilla + 1910.120(e)(6) certificado individual + ISO 9001 7.2(d) (§5.5) |
| 29 | courses on a clock | ciclos anuales y multianuales de la tabla de §5.5 |
| 30 | close the term | ICE 1100 Std 4, roster de titulares y política de registros (§3.4, §5.5) |

---

## 7 · Lista negra de esta ronda (no publicar)

1. Cualquier cifra de fraude de CV o títulos falsos (regla de marca).
2. «Los presupuestos de capacitación son use-it-or-lose-it en Q4» (§5.3).
3. «Los requisitos de título siguen cayendo» (§2.5 — subieron desde 2024).
4. «Un QR necesita al menos 2 cm» (§3.3).
5. «Añade tu curso a LinkedIn en un toque» / cualquier autofill (§4.1).
6. «La certificación de RCP dura 2 años» (§5.5).
7. Cualquier cifra indexada del tope §127 para 2027 (§5.1).
8. Cualquier efecto medido de compartir credenciales sobre la visibilidad de la
   institución (§2.6).
9. Citas atribuidas a ASTM E2659 (§3.4).
10. Una definición propia de «contact hour» separada de la del CEU (§3.5).
11. Reglas de ubicación del QR, cantidad de firmas, o fraseo de «finalización
    parcial» — ninguna fuente los da (§3.3, §3.7, §3.9).
