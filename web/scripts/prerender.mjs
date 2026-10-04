/**
 * Pregenerado del catálogo.
 *
 * El sitio es una aplicación de una sola página: el navegador recibe un HTML
 * casi vacío y React dibuja todo después. Un buscador que no ejecute el
 * JavaScript —o que lo ejecute con menos paciencia de la que se supone— no ve
 * ni un solo producto, así que las 39 fichas y las 9 familias eran invisibles
 * para Google.
 *
 * Este script se ejecuta después de `vite build` y escribe, dentro de `dist`:
 *
 *   · `index.html` con el catálogo completo en el HTML inicial,
 *   · `producto/<id>/index.html` por cada ficha, con su `<title>`, su
 *     descripción, su `canonical`, su imagen de Open Graph y sus datos
 *     estructurados `Product`,
 *   · `sitemap.xml` y `robots.txt`.
 *
 * El contenido va dentro de `#root`: React lo sustituye al montar, así que no
 * hay dos versiones que mantener en pantalla — la estática sólo se ve mientras
 * carga el JavaScript, y es la única que ven los buscadores y quien navegue sin
 * JavaScript.
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

/** Escapa texto que se inserta como contenido o como valor de atributo. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Carga los datos con el propio Vite: son TypeScript y usan `import.meta.env`,
 * así que Node no puede importarlos tal cual.
 */
const loadModules = async () => {
  const server = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });
  try {
    return {
      catalog: await server.ssrLoadModule('/src/data/catalog.ts'),
      seo: await server.ssrLoadModule('/src/data/seoContent.ts'),
    };
  } finally {
    await server.close();
  }
};

const { catalog, seo } = await loadModules();
const { COMPANY, SITE_URL, categories, products } = catalog;
const { guides } = seo;

/**
 * Meta descripción. Google corta sobre los 155 caracteres, así que se recorta
 * por palabra entera en vez de dejar que la corte él a mitad.
 */
const meta = (text) => {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= 155) return t;
  const cut = t.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '')}…`;
};

/**
 * Título de ficha. Google corta sobre los 60 caracteres y hay nombres de
 * producto largos («Envolvedora de brazo giratorio Masterwrap HD Plus XL»), así
 * que se va soltando lastre —primero la razón social, luego la familia— en vez
 * de dejar que el corte se coma el nombre, que es lo único que no puede faltar.
 */
const productTitle = (p, category) => {
  const brand = 'Meridional Plastic';
  const candidates = [
    `${p.name} — ${category.name} | ${brand}`,
    `${p.name} | ${brand}`,
    p.name,
  ];
  return candidates.find((t) => t.length <= 60) ?? p.name;
};

const site = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
const base = (process.env.BASE_PATH || '/').replace(/\/*$/, '/');

const url = (path = '') => `${site}${base}${path}`.replace(/([^:])\/{2,}/g, '$1/');

const template = await readFile(join(dist, 'index.html'), 'utf8');

/*
 * Las dos fuentes van alojadas en el propio sitio (paquetes @fontsource-variable).
 * Vite les pone un hash en el nombre, así que aquí se localizan los ficheros
 * latinos —los que cubren el castellano— y se precargan desde el <head>: el
 * navegador empieza a bajarlos a la vez que el CSS en lugar de esperar a
 * encontrarlos dentro de él. Sin esto el texto se pintaba con la tipografía de
 * reserva y saltaba a la buena al llegar.
 */
const fontFiles = (await readdir(join(dist, 'assets'))).filter((f) =>
  /^(dm-sans|plus-jakarta-sans)-latin-wght-normal-.*\.woff2$/.test(f),
);
const fontPreloads = fontFiles
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="${base}assets/${f}" crossorigin />`)
  .join('\n    ');

/* ------------------------------------------------------------------ Plantilla */

/**
 * Sustituye las etiquetas que cambian de una página a otra. La plantilla que
 * deja Vite ya trae las de la portada, así que se reemplazan en lugar de
 * añadirse: si no, quedarían dos `<title>` y dos descripciones.
 */
const render = ({ title, description, canonical, image, imageAlt, jsonLd, body }) => {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${esc(description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${esc(title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${esc(description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image"[^>]*>/,
    `<meta property="og:image" content="${esc(image)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:alt"[^>]*>/,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
  );

  // Canónica y og:url no existen en la plantilla: se añaden antes de </head>.
  const extra = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    fontPreloads,
    jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ]
    .filter(Boolean)
    .join('\n    ');

  html = html.replace('</head>', `    ${extra}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  return html;
};

/* -------------------------------------------------------- Contenido estático */

/*
 * Hoja mínima para que lo que se ve antes de que arranque React —y lo que ve
 * quien navega sin JavaScript— se lea bien, en vez de parecer una página rota.
 */
const FALLBACK_CSS = `
  .mp-static{max-width:1100px;margin:0 auto;padding:24px 16px 64px;font-family:'DM Sans Variable','DM Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.55;color:#1a1b1e}
  .mp-static a{color:#0d6dff}
  .mp-static h1,.mp-static h2,.mp-static h3{font-family:'Plus Jakarta Sans Variable','DM Sans Variable',system-ui,sans-serif}
  .mp-static h1{font-size:clamp(2rem,5vw,3.25rem);font-weight:800;line-height:1.1;margin:.2em 0}
  .mp-static h2{font-size:clamp(1.5rem,3.2vw,2.125rem);font-weight:800;margin:1.6em 0 .4em;border-bottom:1px solid #e9ecef;padding-bottom:.3em}
  .mp-static h3{font-size:1rem;font-weight:700;margin:0;line-height:1.25}
  .mp-static ul{padding-left:1.2em}
  .mp-static .mp-muted{color:#666}
  .mp-static .mp-lead{font-size:1.1rem;color:#444;max-width:62ch}
  .mp-static img{max-width:100%;height:auto;border-radius:8px}

  /*
   * El grid y la tarjeta reproducen el aspecto de <ProductCard> (ver
   * src/components/ProductCard.module.css) a propósito: si se parecen, sea
   * cual sea el tiempo que tarde en cargar el JavaScript, el cambio a la app
   * real se nota como una mejora (aparecen las insignias, el hover, la
   * animación) y no como un parpadeo a una página distinta.
   */
  .mp-static .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;list-style:none;padding:0}
  .mp-static .mp-grid li{border:1px solid #e9ecef;border-radius:10px;overflow:hidden;background:#fff}
  .mp-static .mp-grid a{display:flex;flex-direction:column;height:100%;color:inherit;text-decoration:none}
  .mp-static .mp-grid .mp-photo{height:170px;box-sizing:border-box;padding:16px;display:flex;align-items:center;justify-content:center;background:#fff;border-bottom:1px solid #e9ecef;color:#adb5bd;font-size:.8rem;text-align:center}
  .mp-static .mp-grid .mp-photo img{max-width:100%;max-height:100%;width:auto;height:auto;border-radius:0}
  .mp-static .mp-grid .mp-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px}
  .mp-static .mp-grid .mp-eyebrow{font-size:.72rem;font-weight:700;color:#868e96;text-transform:uppercase;letter-spacing:.02em}
  .mp-static .mp-grid .mp-summary{font-size:.9rem;color:#666;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
`;

const contactBlock = () => `
  <h2>Contacto</h2>
  <p class="mp-muted">
    ${esc(COMPANY.name)} · ${esc(COMPANY.address)}, ${esc(COMPANY.city)}<br />
    <a href="tel:+${esc(COMPANY.phoneRaw)}">${esc(COMPANY.phone)}</a> ·
    <a href="mailto:${esc(COMPANY.email)}">${esc(COMPANY.email)}</a>
  </p>
`;

const staticShell = (inner) =>
  `<style>${FALLBACK_CSS}</style><div class="mp-static">${inner}</div>`;

/** Portada: el catálogo entero, con un enlace por producto. */
const homeBody = () =>
  staticShell(`
    <h1>Envases y embalajes industriales en ${esc(COMPANY.province)}</h1>
    <p class="mp-lead">
      Precinto, film estirable, burbuja, foam, fleje, cartón, palés y maquinaria, con
      un solo proveedor. Ficha técnica en cada producto y presupuesto sin compromiso en
      ${esc(COMPANY.town)}, ${esc(COMPANY.province)}.
    </p>
    <h2>Familias</h2>
    <ul>${categories
      .map(
        (c) =>
          `<li><a href="${esc(base)}categoria/${esc(c.id)}/">${esc(c.name)}</a> — ${esc(c.tagline)}</li>`,
      )
      .join('')}</ul>
    ${categories
      .map(
        (c) => `
      <h2>${esc(c.name)}</h2>
      <p class="mp-muted">${esc(c.description)}</p>
      <ul class="mp-grid">
        ${products
          .filter((p) => p.category === c.id)
          .map(
            (p) => `<li>
              <a href="${esc(base)}producto/${esc(p.id)}/">
                <div class="mp-photo">${
                  p.image
                    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" decoding="async" />`
                    : esc(p.family)
                }</div>
                <div class="mp-body">
                  <div class="mp-eyebrow">${esc(p.family)}</div>
                  <h3>${esc(p.name)}</h3>
                  <div class="mp-summary">${esc(p.summary)}</div>
                </div>
              </a>
            </li>`,
          )
          .join('')}
      </ul>`,
      )
      .join('')}
    ${contactBlock()}
  `);

/** Ficha: todo lo que el panel lateral enseña, en HTML plano. */
const productBody = (p) => {
  const category = categories.find((c) => c.id === p.category);
  return staticShell(`
    <p class="mp-muted"><a href="${esc(base)}">Catálogo</a> › ${esc(category.name)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="mp-muted">${esc(p.family)}</p>
    ${p.image ? `<p><img src="${esc(p.image)}" alt="${esc(p.name)}" width="480" /></p>` : ''}
    <p class="mp-lead">${esc(p.summary)}</p>
    <h2>Características</h2>
    <ul>${p.specs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    ${
      p.variants?.length
        ? `<h2>Referencias disponibles</h2><ul>${p.variants
            .map((v) => `<li>${esc(v)}</li>`)
            .join('')}</ul>`
        : ''
    }
    <p class="mp-muted">
      Todos los productos disponen de características técnicas y certificados CE.
      Referencia: ${esc(p.id)}.
    </p>
    ${contactBlock()}
  `);
};

/** Familia: entradilla, productos, tabla de «cómo elegir» y preguntas frecuentes. */
const categoryBody = (c) => {
  const g = guides[c.id];
  const list = products.filter((p) => p.category === c.id);
  return staticShell(`
    <p class="mp-muted"><a href="${esc(base)}">Catálogo</a> › ${esc(c.name)}</p>
    <h1>${esc(g.h1)}</h1>
    <p class="mp-lead">${esc(g.intro)}</p>
    <h2>${esc(c.name)}</h2>
    <ul class="mp-grid">
      ${list
        .map(
          (p) => `<li>
            <a href="${esc(base)}producto/${esc(p.id)}/">
              <div class="mp-photo">${
                p.image
                  ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" decoding="async" />`
                  : esc(p.family)
              }</div>
              <div class="mp-body">
                <div class="mp-eyebrow">${esc(p.family)}</div>
                <h3>${esc(p.name)}</h3>
                <div class="mp-summary">${esc(p.summary)}</div>
              </div>
            </a>
          </li>`,
        )
        .join('')}
    </ul>
    ${
      g.guide
        ? `<h2>${esc(g.guide.heading)}</h2>
           <ul>${g.guide.rows
             .map(([need, pick]) => `<li><strong>${esc(need)}:</strong> ${esc(pick)}</li>`)
             .join('')}</ul>`
        : ''
    }
    <h2>Preguntas frecuentes</h2>
    ${g.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
    <h2>Otras familias</h2>
    <ul>${categories
      .filter((x) => x.id !== c.id)
      .map((x) => `<li><a href="${esc(base)}categoria/${esc(x.id)}/">${esc(x.name)}</a></li>`)
      .join('')}</ul>
    ${contactBlock()}
  `);
};

/* ----------------------------------------------------------- Datos de empresa */

/*
 * `LocalBusiness` además de `Organization`: es un almacén con dirección y
 * teléfono al que se va y se llama, y es lo que Google usa para el panel local.
 * No se declaran horario, precios ni valoraciones porque el cliente no los ha
 * facilitado: un dato inventado ahí se convierte en una llamada a puerta cerrada.
 */
const organization = {
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${url()}#organizacion`,
  name: COMPANY.name,
  url: url(),
  email: COMPANY.email,
  telephone: `+${COMPANY.phoneRaw}`,
  image: url('img/hero-tapes.jpg'),
  logo: url('img/logo.png'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    postalCode: '50171',
    addressLocality: COMPANY.town,
    addressRegion: COMPANY.province,
    addressCountry: 'ES',
  },
  areaServed: { '@type': 'AdministrativeArea', name: COMPANY.province },
  // El mismo enlace que el botón «Encuéntrenos en Google» (`COMPANY.googleMaps`).
  hasMap: COMPANY.googleMaps,
};

/** Migas de pan, para que el buscador dibuje la ruta bajo el resultado. */
const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item,
  })),
});

/* ------------------------------------------------------------------- Escritura */

const write = async (relDir, html) => {
  const dir = join(dist, relDir);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html, 'utf8');
};

// Portada
await write(
  '.',
  render({
    title: `Envases y embalajes en ${COMPANY.province} | ${COMPANY.name}`,
    description: meta(
      `Precinto, film estirable, burbuja, fleje, cartón, palés y maquinaria de embalaje. Ficha técnica y presupuesto sin compromiso en ${COMPANY.province}.`,
    ),
    canonical: url(),
    image: url('img/hero-tapes.jpg'),
    imageAlt: 'Bobinas de precinto de Meridional Plastic',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        {
          '@type': 'CollectionPage',
          name: `Catálogo de envase y embalaje — ${COMPANY.name}`,
          url: url(),
          isPartOf: { '@id': `${url()}#organizacion` },
          // Las nueve familias, para que el buscador vea la estructura del
          // catálogo y no una sola página con 40 productos sueltos.
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: categories.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.name,
              url: url(`categoria/${c.id}/`),
            })),
          },
        },
      ],
    },
    body: homeBody(),
  }),
);

// Una página por familia
for (const c of categories) {
  const g = guides[c.id];
  const canonical = url(`categoria/${c.id}/`);
  const list = products.filter((p) => p.category === c.id);
  const first = list.find((p) => p.image);

  await write(
    `categoria/${c.id}`,
    render({
      title: g.title,
      description: meta(g.metaDescription),
      canonical,
      image: first ? `${site}${first.image}` : url('img/hero-tapes.jpg'),
      imageAlt: c.name,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            name: g.h1,
            description: g.intro,
            url: canonical,
            isPartOf: { '@id': `${url()}#organizacion` },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: list.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.name,
                url: url(`producto/${p.id}/`),
              })),
            },
          },
          breadcrumbs([
            ['Catálogo', url()],
            [c.name, canonical],
          ]),
          {
            '@type': 'FAQPage',
            mainEntity: g.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
      },
      body: categoryBody(c),
    }),
  );
}

// Una página por ficha
for (const p of products) {
  const category = categories.find((c) => c.id === p.category);
  const canonical = url(`producto/${p.id}/`);
  // `p.image` ya viene resuelto contra la base (`/img/…`): se pasa a absoluto.
  const image = p.image ? `${site}${p.image}` : url('img/hero-tapes.jpg');

  await write(
    `producto/${p.id}`,
    render({
      title: productTitle(p, category),
      // Antes se cortaba a 300 caracteres y Google la truncaba a media frase.
      description: meta(`${p.summary} Presupuesto sin compromiso en ${COMPANY.province}.`),
      canonical,
      image,
      imageAlt: p.name,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          // No se declara `Product`: Google lo valida como fragmento de producto
          // y exige `offers`, `review` o `aggregateRating`. El catálogo es a
          // presupuesto, sin precios ni reseñas, así que la ficha se describe
          // como página de artículo en lugar de inventarse esos datos.
          {
            '@type': 'ItemPage',
            name: p.name,
            description: p.summary,
            url: canonical,
            ...(p.image
              ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } }
              : {}),
            isPartOf: { '@id': `${url()}#organizacion` },
            about: { '@type': 'Thing', name: p.name, description: p.summary },
            publisher: organization,
          },
          breadcrumbs([
            ['Catálogo', url()],
            [category.name, url(`categoria/${category.id}/`)],
            [p.name, canonical],
          ]),
        ],
      },
      body: productBody(p),
    }),
  );
}

/* --------------------------------------------------------- sitemap y robots */

const urls = [
  { loc: url(), priority: '1.0' },
  // Las familias van por delante de las fichas: son las páginas que se quiere
  // posicionar y las que reparten enlaces hacia el resto del catálogo.
  ...categories.map((c) => ({ loc: url(`categoria/${c.id}/`), priority: '0.9' })),
  ...products.map((p) => ({ loc: url(`producto/${p.id}/`), priority: '0.8' })),
];

const today = new Date().toISOString().slice(0, 10);

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
);

await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${url('sitemap.xml')}\n`,
  'utf8',
);

console.log(
  `Pregeneradas ${products.length + categories.length + 1} páginas (portada, ${
    categories.length
  } familias, ${products.length} fichas), sitemap con ${urls.length} direcciones (${site}${base}).`,
);
