# Catálogo web · Meridional Plastic

Catálogo de productos para envase y embalaje de **Meridional Plastic, S.L.**, construido a
partir del _Catálogo de productos 2024_ en PDF. Es una web estática, sin backend, pensada
para consultarse igual de bien en móvil que en escritorio.

## Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera dist/ listo para publicar
npm run preview  # sirve dist/ para comprobarlo antes de subir
```

`npm run build` genera una carpeta `dist/` con rutas relativas, así que se puede publicar
tal cual en cualquier hosting estático (Netlify, Vercel, GitHub Pages, o un directorio
del servidor actual).

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

- **Catálogo completo** agrupado en cinco categorías: polímeros, cintas adhesivas y
  precintos, fleje, cartón y papel, y palets.
- **Buscador** sin acentos ni mayúsculas: busca en nombre, familia, descripción,
  características, referencias y etiquetas.
- **Filtros** por categoría y por característica (impresión personalizada, uso manual,
  uso automático, a medida, ecológico).
- **Ficha de producto** en panel lateral (inferior en móvil) con características y
  referencias disponibles.
- **«Mi solicitud»**: el usuario marca productos y genera un correo o un mensaje de
  WhatsApp ya redactado. La selección se guarda en el navegador.
- **Modo claro y oscuro.**

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
  hooks/useQuote.ts      Lista de productos seleccionados (localStorage)
  components/            Header, Hero, ProductCard, ProductDrawer, QuoteDrawer, Footer
public/img/              Imágenes de producto extraídas del catálogo en PDF
```

## Mantenimiento

Casi todo se toca en un único sitio: [`src/data/catalog.ts`](src/data/catalog.ts).

- **Añadir un producto**: añade un objeto al array `products` con un `id` único, la
  `category`, la `family` (subtítulo), la imagen y sus `specs`.
- **Cambiar una imagen**: deja el archivo en `public/img/` y apunta `image` a
  `/img/nombre.jpg`. Las imágenes se muestran ajustadas sin recortar (`fit="contain"`)
  sobre fondo blanco, así que valen fotos con distintas proporciones.
- **Datos de contacto, teléfono y email**: constante `COMPANY`. El teléfono aparece dos
  veces, en formato legible (`phone`) y sin separadores para los enlaces de WhatsApp
  (`phoneRaw`); hay que actualizar los dos.

## Notas sobre el contenido

- Los textos y las imágenes provienen de los PDF `CATÁLOGO 2024.pdf` y
  `Meridional Plastic_Pliegos.pdf`.
- Algunas familias comparten fotografía porque el PDF original solo incluye una imagen
  para todas sus variantes (por ejemplo, los tres tipos de film estirable). Sustituir esas
  fotos por una de cada variante es la mejora más visible que se puede hacer.
- Unas pocas imágenes de cinta del PDF son de baja resolución (unos 150 px). Se ven
  correctamente porque se muestran a tamaño reducido, pero conviene reemplazarlas si se
  dispone de los originales.
- El PDF indica el código postal de dos formas distintas (50171 y 50172). Se ha usado
  **50171**, que es el de La Puebla de Alfindén; conviene confirmarlo.
