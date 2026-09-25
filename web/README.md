# Catálogo web · Meridional Plastic

Catálogo de productos para envase y embalaje de **Meridional Plastic, S.L.**, construido a
partir del listado de productos facilitado por el cliente. Es una web estática, sin backend, pensada
para consultarse igual de bien en móvil que en escritorio.

## Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera dist/ listo para publicar
npm run preview  # sirve dist/ para comprobarlo antes de subir
```

`npm run build` compila el sitio **y pregenera una página por producto** (ver
[Pregenerado y SEO](#pregenerado-y-seo)). El resultado, en `dist/`, es estático y se
puede publicar tal cual en cualquier hosting (Netlify, Vercel, GitHub Pages, o un
directorio del servidor actual).

Para publicar en un subdirectorio en vez de en la raíz del dominio, hay que pasar la
ruta en `BASE_PATH`, con barra final: `BASE_PATH=/catalogo/ npm run build`.

## Configuración

Hay dos ajustes que viven fuera del código, en un fichero `.env` (se parte de
[`.env.example`](.env.example)):

| Variable | Para qué sirve |
| --- | --- |
| `VITE_FORM_ENDPOINT` | Dirección a la que se envía el formulario de presupuesto. Vale cualquier servicio que acepte un POST con JSON: Formspree, Netlify Forms, Basin… **Mientras esté vacío, el formulario abre el correo del visitante con la solicitud ya redactada** en lugar de fingir un envío. |
| `VITE_SITE_URL` | Dominio público, sin barra final. Lo usan las URL canónicas, la imagen de Open Graph y el sitemap, que han de ser absolutas. |

El número de WhatsApp está en `COMPANY.whatsapp`, en
[`src/data/catalog.ts`](src/data/catalog.ts). Va vacío a propósito: el teléfono de la
empresa es un fijo y `wa.me` sólo funciona con una línea móvil, así que **los botones de
WhatsApp no se dibujan hasta que haya un número ahí**.

## Con Docker

Desde la carpeta del proyecto (la que contiene `docker-compose.yml`):

```bash
docker compose up -d --build     # compila y sirve en http://localhost:8080
docker compose logs -f catalogo  # ver el registro
docker compose down              # parar
```

La imagen se construye en dos fases: Node compila el sitio y nginx sirve el resultado.
La imagen final sólo contiene ficheros estáticos, así que es pequeña y es exactamente
lo que se subiría a producción.

Para trabajar con recarga en caliente dentro de Docker, sin instalar Node en el equipo:

```bash
docker compose --profile dev up dev   # http://localhost:5173
```

Al cambiar el código hay que reconstruir la imagen de producción (`--build`); el
servicio `dev`, en cambio, refleja los cambios al momento.

## Qué hace

- **Catálogo completo** agrupado en nueve categorías: cinta adhesiva, film estirable,
  burbuja, foam, lámina/semitubo/bolsas, fleje y accesorios, cartón, palés y maquinaria.
- **Buscador** sin acentos ni mayúsculas: busca en nombre, familia, descripción,
  características, referencias y etiquetas.
- **Filtros** por categoría y por característica (impresión personalizada, uso manual,
  uso automático, a medida), con el número de resultados en cada una.
- **Ficha de producto** en panel lateral (inferior en móvil) con características y
  referencias disponibles. Cada ficha tiene además **su propia dirección**,
  `/producto/<id>`, que se puede pasar a un cliente o indexar.
- **Lista de solicitud**: se van apuntando productos según se recorre el catálogo
  («Añadir a mi solicitud») y se piden todos de una vez. **No es un carrito**: no hay
  precios, ni unidades, ni pago, por indicación del cliente. Se guarda en el navegador,
  así que sobrevive a cerrar la pestaña.
- **Formulario de presupuesto** con los productos apuntados, validación y casilla de
  consentimiento. Antes todas las llamadas a la acción eran `mailto:`, que en un
  ordenador sin cliente de correo configurado no hacen nada.
- **Contacto directo** por teléfono y, si se configura el número, WhatsApp.
- **Modo claro y oscuro**, según la preferencia del sistema.

## Pregenerado y SEO

El sitio es una aplicación de una sola página: el navegador recibe un HTML casi vacío y
React dibuja todo después. Un buscador que no ejecute el JavaScript no veía **ni un solo
producto**, y las fichas vivían en `#p/<id>` — un fragmento que ni siquiera llega al
servidor, así que no se podía indexar, ni ponerle una `canonical`, ni una imagen propia
al compartirla.

`npm run build` ejecuta [`scripts/prerender.mjs`](scripts/prerender.mjs) después de
compilar, que escribe dentro de `dist/`:

- `index.html` con el catálogo entero —las nueve familias y los 39 productos, con enlace
  a cada ficha— ya en el HTML inicial.
- `producto/<id>/index.html` por cada producto, con su `<title>`, su descripción, su
  `canonical`, su imagen de Open Graph y sus datos estructurados `Product`.
- `sitemap.xml` con las 40 direcciones y `robots.txt` apuntando a él.

El contenido pregenerado va **dentro de `#root`**: React lo sustituye al montar, así que
no hay dos versiones que mantener en pantalla. Se ve mientras carga el JavaScript, y es
lo único que ven los buscadores y quien navegue sin JavaScript.

Dos consecuencias a tener presentes al tocar el proyecto:

- **La base de compilación es absoluta** (`/`, o lo que diga `BASE_PATH`). Ya no se puede
  usar `./`: desde `/producto/<id>/` un `./assets/…` buscaría en
  `/producto/<id>/assets/…`, que no existe.
- **El script reemplaza etiquetas del `<head>` de [`index.html`](index.html) por
  expresiones regulares.** Si se reescribe el `<title>` o los `<meta>` con otro formato,
  hay que revisar que las sigue encontrando.

El servidor tiene que servir los directorios: `nginx.conf` ya lo hace con
`try_files $uri $uri/ /index.html`, que encuentra `producto/<id>/index.html` y deja el
`index.html` de la raíz como red de seguridad.

## Animaciones

Todo el movimiento es nativo del navegador: no hay ninguna librería de animación
instalada, así que no añade nada al tamaño del bundle y se ejecuta en el compositor.

- **Entrada de las tarjetas** con animaciones ligadas al scroll
  (`animation-timeline: view()`), sin JavaScript ni `IntersectionObserver`. Va dentro de
  un `@supports`, así que en navegadores que no lo soporten la tarjeta aparece ya visible.
- **Cambio de categoría o de filtro** con la View Transitions API. Sólo se funde la zona
  de resultados, que lleva `view-transition-name: catalogo`; la cabecera y el hero no se
  mueven. Como React pinta de forma asíncrona, el cambio de estado va dentro de un
  `flushSync` (ver [`src/hooks/useViewTransition.ts`](src/hooks/useViewTransition.ts)).
  Donde no exista la API, el filtro se aplica sin animar.
- **Las fotos** hacen un fundido al terminar de descargarse, no al montarse, para que las
  imágenes con carga diferida no parpadeen.
- **`prefers-reduced-motion`**: todo lo que anima está dentro de
  `@media (prefers-reduced-motion: no-preference)`. Con la opción del sistema activada la
  web queda completamente estática, y las tarjetas se ven al 100 % de opacidad.

Al tocar las animaciones de las tarjetas, anima la propiedad `translate` y no `transform`:
`transform` está reservado para el desplazamiento del hover y, al ser propiedades
independientes, ambas se componen sin pisarse.

## Estructura

```
src/
  data/catalog.ts        Todo el contenido del catálogo (productos, categorías, contacto)
  theme.ts               Colores corporativos y tipografía
  components/            Header, Hero, Filters, ProductCard, ProductDrawer,
                         QuoteModal, ContactCta, Footer
  hooks/useRoute.ts      Rutas `/producto/<id>` (y redirección de los `#p/<id>` antiguos)
  hooks/useQuote.ts      Lista de solicitud, guardada en el navegador
scripts/prerender.mjs    Genera una página por producto, el sitemap y robots.txt
public/img/              Fotografías de producto
```

## Mantenimiento

Casi todo se toca en un único sitio: [`src/data/catalog.ts`](src/data/catalog.ts).

- **Añadir un producto**: añade un objeto al array `products` con un `id` único, la
  `category`, la `family` (subtítulo), la imagen y sus `specs`.
- **Cambiar una imagen**: deja el archivo en `public/img/` y apunta `image` a
  `/img/nombre.jpg`. Las imágenes se muestran ajustadas sin recortar (`fit="contain"`)
  sobre fondo blanco, así que valen fotos con distintas proporciones.
- **Datos de contacto, teléfono y email**: constante `COMPANY`. El teléfono aparece dos
  veces, en formato legible (`phone`) y sin separadores para los enlaces `tel:`
  (`phoneRaw`); hay que actualizar los dos. `whatsapp` es aparte, y ha de ser una línea
  móvil.
- **Motivos de compra de la portada**: constante `HIGHLIGHTS`. Sólo debería haber ahí
  afirmaciones que el catálogo respalde. Plazo de entrega, años de actividad y zona de
  reparto son los que más convencen en este sector y **faltan**: en cuanto el cliente los
  confirme, van aquí.
- **Al añadir o renombrar un producto** cambia su dirección `/producto/<id>`. El `id` es
  parte de la URL pública: si se renombra uno que ya esté indexado o repartido por
  correo, conviene dejar una redirección en el servidor.

## Notas sobre el contenido

- El listado de productos sigue `latest/LISTADO DE PRODUCTOS WEB.xlsx`. Donde el Excel
  indica «TEXTO CATALOGO» se conserva la redacción del catálogo de 2024 en PDF.
- Parte de las fotografías las envió el cliente (carpeta `latest/`) y el resto se
  extrajeron de los PDF del catálogo y de las fichas técnicas de maquinaria.
- Faltan fotos propias de: mesa flejadora semiautomática y tensores. Mientras no las
  haya, esas dos fichas muestran un hueco con los colores de la casa y el nombre de la
  familia (`PhotoFallback`), en lugar del «Foto pendiente» de antes, que al cliente le
  decía que la web estaba a medio hacer.
- Las hebillas y los enlazadores («fichas») se muestran a menor tamaño mediante
  `imageSize: "sm"`, porque estaban fotografiados de cerca y se veían desproporcionados
  junto a una bobina.
- Algunas fotos llevan la marca del fabricante de la máquina (Robopac) porque proceden de
  su ficha técnica; conviene confirmar que se pueden publicar así.
- El PDF indica el código postal de dos formas distintas (50171 y 50172). Se ha usado
  **50171**, que es el de La Puebla de Alfindén; conviene confirmarlo.
