# La app — publicar desde el celular

Una web en Next.js que sirve los mismos 181 carruseles de `brands/<marca>/out/`.
Pensada para el pulgar: eliges un post, guardas las fotos en **Fotos** del iPhone,
copias el caption, y lo marcas como publicado para no repetirlo.

No tiene backend, ni base de datos, ni variables de entorno. El repositorio *es*
el contenido y el navegador guarda el avance.

---

## Correrla en la laptop

```bash
cd carousels
npm install
npm run dev        # http://localhost:3000
```

`npm run dev` y `npm run build` corren primero `scripts/build-index.mjs`, que:

- enlaza (hardlink, no copia) las fotos originales a `public/posts/…` — son las que
  se guardan en el celular, **nunca se re-comprimen**;
- genera vistas previas de 540 px en `public/preview/…` (~18 KB cada una, para que
  el deslizador cargue rápido con datos móviles);
- genera portadas de 300 px en `public/thumb/…` para la grilla;
- escribe `data/index.json` con títulos, captions, ALT y PDF de cada post,
  leyéndolos de `brands/<marca>/posts/<serie>.json`.

`sharp` (el que genera las derivadas) está en `dependencies` y no en
`devDependencies` a propósito: si un build no instalara las de desarrollo, el
script seguiría corriendo pero copiaría los originales como vistas previas, y
cada post pesaría diez veces más sin que nadie se dé cuenta.

Todo eso está en `.gitignore`: se regenera solo. **Después de re-renderizar
láminas con `tools/render.py`, corre `npm run prepare-assets`** (o simplemente
`npm run dev`) para que la app vea los cambios.

---

## Publicarla en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa el repositorio
   `posts-carrousels`. Vercel detecta Next.js solo.
2. Deja todo por defecto: Root Directory `/`, Build Command `npm run build`,
   Output `.next`. **No agregues ninguna variable de entorno.**
3. Deploy. La compilación tarda ~2 min desde cero: genera las 2 631 imágenes
   derivadas y prerenderiza las 189 páginas (medido en un clon limpio).

### Un dominio propio

Project → **Settings → Domains → Add**, escribe el dominio y sigue los registros
DNS que te muestra. La app no tiene ninguna URL escrita a mano ni `basePath`, así
que funciona igual en `algo.vercel.app`, en `carruseles.tudominio.com` o en
`localhost`. No hay que reconstruir al cambiar de dominio.

### Detalles que conviene saber

- **Cuenta personal.** El plan Hobby de Vercel no conecta repositorios de una
  organización de GitHub. `elchale` es una cuenta personal, así que entra sin
  problema — pero si algún día mueves el repo a una org, hay que pasar a Pro.
- **Peso.** El deploy sube ~490 MB de fotos estáticas (439 MB de originales +
  47 MB de previews). Eso está bien: el límite de 100 MB de Vercel aplica solo a
  los deploys hechos con `vercel deploy` desde la CLI, no a los que salen de Git.
  Si algún día prefieres la CLI, hay que subir por Git igual.
- **Tráfico.** Ver un post consume ~2,7 MB. Con el límite gratis de 100 GB/mes no
  hay forma de acercarse publicando a mano.
- **Ponla en la pantalla de inicio.** Safari → Compartir → *Añadir a pantalla de
  inicio*. Se abre a pantalla completa y el avance se guarda igual.

---

## Cómo se usa

**Inicio** — cuántos llevas de 181, y un acceso directo al siguiente post de la
marca más atrasada, para que las tres cuentas avancen parejas.

**Marca** — la grilla de portadas. Por defecto muestra **solo pendientes**, así
que lo publicado desaparece y no lo vuelves a descargar por error. Los chips de
arriba filtran por serie; el número del chip es lo que falta de esa serie.

**Post** — el deslizador con las láminas y, abajo, dos columnas:

| | Instagram | TikTok |
|---|---|---|
| **Guardar N fotos** | abre el menú de iOS → *Guardar N imágenes* → van a Fotos | igual, con las láminas 9:16 |
| **Copiar caption** | el texto de IG (Facebook usa las mismas fotos, ver `⋯`) | el texto de TikTok |

Y la fila **Publicado**, con un botón por red: márcalas cuando subas. Cuando las
dos están marcadas el post queda sellado y aparece **Siguiente pendiente**.

El botón `⋯` guarda el resto: leer los captions completos, copiar el de Facebook,
copiar el texto ALT, abrir el PDF de LinkedIn (Qolca), invertir el orden de
guardado y borrar el estado de ese post.

### Por qué el guardado funciona así

La única forma de que una foto llegue a **Fotos** desde el navegador del iPhone
(y no a *Archivos*) es el menú nativo de compartir. La app precarga las fotos
apenas abres el post, porque Safari exige que el menú se abra en el mismo toque:
si tuviera que descargarlas primero, perdería el gesto. Por eso a veces, con
señal mala, el botón dice **Toca de nuevo** — las fotos ya están listas, solo
falta el segundo toque.

En Android o en la laptop no existe ese menú: ahí las fotos se descargan una por
una y la app lo advierte.

### El orden de las láminas

Se guardan 01 → 07. iOS les pone la hora del momento en que se guardaron, así que
un selector que muestre "las más recientes primero" te va a mostrar la 07 arriba.
Si te pasa, en `⋯` → **Orden al guardar** cámbialo a invertido.

---

## Dónde se guarda el avance

En el `localStorage` del navegador, con la llave `carruseles.v1`. Es por
dispositivo: si publicas desde el celular, el avance no aparece en la laptop.

**Inicio → ⇄ (Respaldo)** copia todo el avance como texto y lo pega en otro
navegador. Al restaurar se combinan los dos avances y se queda con la marca más
reciente de cada post — restaurar un respaldo viejo nunca despublica nada.

---

## Estructura

```
app/
  layout.jsx  page.jsx            inicio
  [brand]/page.jsx                grilla de la marca
  [brand]/[series]/[slug]/page.jsx  el post
  respaldo/page.jsx               copiar / restaurar el avance
  components/                     HomeScreen · BrandScreen · PostScreen · Sheet · Toast
  lib/data.js                     lee data/index.json (solo en el servidor)
  lib/store.js                    localStorage: descargado / publicado
  lib/save.js                     compartir a Fotos, copiar al portapapeles
  globals.css                     todo el diseño, sin framework
scripts/build-index.mjs           genera public/ y data/index.json
```

Las 189 páginas se generan estáticas en el build; en producción no se ejecuta
nada del lado del servidor.
