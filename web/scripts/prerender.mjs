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

import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
 * Carga `catalog.ts` con el propio Vite: es TypeScript y usa `import.meta.env`,
 * así que Node no puede importarlo tal cual.
 */
const loadCatalog = async () => {
  const server = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });
  try {
    return await server.ssrLoadModule('/src/data/catalog.ts');
  } finally {
    await server.close();
  }
};

const catalog = await loadCatalog();
const { COMPANY, SITE_URL, categories, products } = catalog;

const site = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
const base = (process.env.BASE_PATH || '/').replace(/\/*$/, '/');

const url = (path = '') => `${site}${base}${path}`.replace(/([^:])\/{2,}/g, '$1/');

const template = await readFile(join(dist, 'index.html'), 'utf8');

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
  .mp-static{max-width:1100px;margin:0 auto;padding:24px 16px 64px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.55;color:#1a1b1e}
  .mp-static a{color:#0d6dff}
  .mp-static h1{font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.15;margin:.2em 0}
  .mp-static h2{font-size:1.35rem;margin:1.6em 0 .4em;border-bottom:1px solid #e9ecef;padding-bottom:.3em}
  .mp-static h3{font-size:1rem;margin:.2em 0}
  .mp-static ul{padding-left:1.2em}
  .mp-static .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;list-style:none;padding:0}
  .mp-static .mp-grid li{border:1px solid #e9ecef;border-radius:10px;padding:12px}
  .mp-static .mp-muted{color:#666}
  .mp-static .mp-lead{font-size:1.1rem;color:#444;max-width:62ch}
  .mp-static img{max-width:100%;height:auto;border-radius:8px}
  @media (prefers-color-scheme:dark){
    .mp-static{color:#c1c2c5}
    .mp-static h2{border-color:#2c2e33}
    .mp-static .mp-grid li{border-color:#2c2e33}
    .mp-static .mp-muted{color:#909296}
    .mp-static .mp-lead{color:#a6a7ab}
  }
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
    <h1>${esc(COMPANY.claim)}</h1>
    <p class="mp-lead">
      Distribución de material de envase y embalaje para industria y comercio en
      ${esc(COMPANY.province)}: precinto, film estirable, burbuja, foam, fleje, cartón,
      palés y maquinaria de envolver.
    </p>
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
              <h3><a href="${esc(base)}producto/${esc(p.id)}/">${esc(p.name)}</a></h3>
              <p class="mp-muted">${esc(p.summary)}</p>
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

/* ----------------------------------------------------------- Datos de empresa */

const organization = {
  '@type': 'Organization',
  '@id': `${url()}#organizacion`,
  name: COMPANY.name,
  url: url(),
  email: COMPANY.email,
  telephone: `+${COMPANY.phoneRaw}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    postalCode: '50171',
    addressLocality: COMPANY.town,
    addressRegion: COMPANY.province,
    addressCountry: 'ES',
  },
};

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
    title: `Envase y embalaje en ${COMPANY.province} — ${COMPANY.name}`,
    description: `Precinto, film estirable, burbuja, foam, fleje, cartón, palés y maquinaria de envolver. Catálogo con ficha técnica y presupuesto sin compromiso en ${COMPANY.town}, ${COMPANY.province}.`,
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
        },
      ],
    },
    body: homeBody(),
  }),
);

// Una página por ficha
for (const p of products) {
  const category = categories.find((c) => c.id === p.category);
  const canonical = url(`producto/${p.id}/`);
  // `p.image` ya viene resuelto contra la base (`/img/…`): se pasa a absoluto.
  const image = p.image ? `${site}${p.image}` : url('img/hero-tapes.jpg');

  await write(
    `producto/${p.id}`,
    render({
      title: `${p.name} — ${category.name} | ${COMPANY.name}`,
      description: `${p.summary} Presupuesto sin compromiso en ${COMPANY.town}, ${COMPANY.province}.`.slice(
        0,
        300,
      ),
      canonical,
      image,
      imageAlt: p.name,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.summary,
        sku: p.id,
        category: category.name,
        url: canonical,
        ...(p.image ? { image } : {}),
        brand: { '@type': 'Brand', name: COMPANY.name },
        // Sin precios publicados: el catálogo es a presupuesto, así que no se
        // declara `offers` en lugar de inventarse una disponibilidad.
        manufacturer: organization,
      },
      body: productBody(p),
    }),
  );
}

/* --------------------------------------------------------- sitemap y robots */

const urls = [
  { loc: url(), priority: '1.0' },
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
  `Pregeneradas ${products.length + 1} páginas, sitemap con ${urls.length} direcciones (${site}${base}).`,
);
