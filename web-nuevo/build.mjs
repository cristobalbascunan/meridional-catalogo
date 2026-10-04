// Generador del sitio nuevo (versión catálogo): HTML estático por página, sin framework.
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'dist');
const { company: C, categories, products, guides, audiences } = JSON.parse(
  await readFile(join(here, 'data.json'), 'utf8'),
);
const SITE = 'https://www.meridionalplastic.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const cat = (id) => categories.find((c) => c.id === id);
const prod = (id) => products.find((p) => p.id === id);
const count = (id) => products.filter((p) => p.category === id).length;
const TAGS = ['Uso manual', 'Uso automático', 'A medida'];

/* ------------------------------------------------------------------ Layout */

const nav = [
  ['/catalogo/', 'Catálogo'],
  ['/soluciones/', 'Soluciones'],
  ['/nosotros/', 'Nosotros'],
  ['/contacto/', 'Contacto'],
];

const searchIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;

const layout = ({ path, title, description, image, jsonLd, body }) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${SITE}${path}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${SITE}${path}" />
<meta property="og:image" content="${SITE}${image || '/img/hero-tapes.jpg'}" />
<meta property="og:locale" content="es_ES" />
<meta name="theme-color" content="#ff5a1f" />
<link rel="icon" href="/img/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/style.css" />
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
<div class="top"><div class="wrap">
  <span>Distribuidor de envase y embalaje en ${esc(C.province)}</span>
  <span><a href="tel:+${C.phoneRaw}">${esc(C.phone)}</a> · <a href="mailto:${C.email}">${esc(C.email)}</a></span>
</div></div>
<header class="site"><div class="wrap">
  <a class="brand" href="/"><img src="/img/logo.png" alt="" /><span><b>Meridional Plastic</b><small>Envase y embalaje</small></span></a>
  <form class="hsearch" role="search">${searchIcon}<input type="search" placeholder="Buscar producto, material o medida…" aria-label="Buscar en el catálogo" /></form>
  <button class="burger" aria-expanded="false" aria-controls="nav">Menú</button>
  <nav class="main" id="nav">
    ${nav.map(([h, t]) => `<a href="${h}"${path.startsWith(h) ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
    <a class="btn sm" href="/contacto/">Mi presupuesto<span class="qcount"></span></a>
  </nav>
</div></header>
<div class="catbar"><div class="wrap">${categories.map((c) => `<a href="/categoria/${c.id}/"${path === `/categoria/${c.id}/` ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}</div></div>
<main id="main">${body}</main>
<footer class="site"><div class="wrap">
  <div class="cols">
    <div>
      <a class="brand" href="/" style="color:#fff"><img src="/img/logo.png" alt="" style="background:#fff;border-radius:6px;padding:3px" /><span><b>Meridional Plastic</b></span></a>
      <p style="max-width:34ch;margin-top:16px">Envases y embalajes industriales, personalizados y a medida, desde ${esc(C.town)}.</p>
    </div>
    <div><h4>Catálogo</h4><ul>${categories.map((c) => `<li><a href="/categoria/${c.id}/">${esc(c.name)}</a></li>`).join('')}</ul></div>
    <div><h4>Soluciones</h4><ul>
      <li><a href="/soluciones/ecommerce/">Embalaje e-commerce</a></li>
      <li><a href="/soluciones/paletizado/">Paletizado y flejado</a></li>
      <li><a href="/soluciones/fragil/">Producto frágil</a></li>
      <li><a href="/nosotros/">Nosotros</a></li></ul></div>
    <div><h4>Contacto</h4><ul>
      <li>${esc(C.address)}<br />${esc(C.city)}</li>
      <li><a href="tel:+${C.phoneRaw}">${esc(C.phone)}</a></li>
      <li><a href="mailto:${C.email}">${esc(C.email)}</a></li></ul></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} ${esc(C.name)}</span><span>Todos los productos disponen de características técnicas.</span></div>
</div></footer>
<script src="/app.js" defer></script>
</body></html>`;

const org = {
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${SITE}/#organizacion`,
  name: C.name,
  url: SITE + '/',
  email: C.email,
  telephone: `+${C.phoneRaw}`,
  address: { '@type': 'PostalAddress', streetAddress: C.address, postalCode: '50171', addressLocality: C.town, addressRegion: C.province, addressCountry: 'ES' },
};
const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + p })),
});
const crumbHtml = (items) =>
  `<div class="crumbs">${items.map(([n, p], i) => (i < items.length - 1 ? `<a href="${p}">${esc(n)}</a>` : esc(n))).join(' › ')}</div>`;

const pcard = (p) => `<a class="pcard" href="/producto/${p.id}/" data-cat="${p.category}" data-tags="${esc(p.tags.join('|'))}" data-text="${esc(norm([p.name, p.family, p.summary, ...p.specs, ...(p.variants || []), ...p.tags].join(' ')))}">
  <div class="ph${p.image ? '' : ' empty'}">${p.image ? `<img src="${p.image}" alt="${esc(p.name)}" loading="lazy" />` : 'Foto próximamente'}</div>
  <div class="bd"><span class="fam">${esc(p.family)}</span><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p>${p.tags.length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}</div>
</a>`;

const closing = (t = '¿No encuentra lo que busca?') => `<section class="closing"><div class="wrap">
  <div><h2>${t}</h2><p>Fabricamos a medida. Cuéntenos qué embala y le preparamos un presupuesto sin compromiso.</p></div>
  <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="/contacto/">Pedir presupuesto</a><a class="btn line" href="tel:+${C.phoneRaw}">Llamar ${esc(C.phone)}</a></div>
</div></section>`;

const sideCats = (active) => `<h4>Categorías</h4><ul class="cats">${categories.map((c) => `<li><a href="/categoria/${c.id}/"${c.id === active ? ' aria-current="page"' : ''}>${esc(c.name)} <span>${count(c.id)}</span></a></li>`).join('')}</ul>`;

/* ------------------------------------------------------------------ Páginas */

const pages = [];
const add = (path, opts) => pages.push({ path, html: layout({ path, ...opts }) });

// Portada
const featured = ['precinto-impreso', 'film-manual', 'bobina-burbuja', 'fleje-pet', 'cajas-carton', 'pales-polietileno', 'flejadora-manual', 'envolvedora-ecoplat'].map(prod);
const heroPhotos = ['precinto-impreso', 'film-manual', 'bobina-burbuja', 'fleje-pet', 'cajas-carton'].map(prod).filter((p) => p?.image);
add('/', {
  title: 'Envases y embalajes industriales en Zaragoza | Meridional Plastic',
  description: 'Precinto, film estirable, burbuja, fleje, cartón, palés y maquinaria de embalaje. Personalizamos y fabricamos a medida. Pida presupuesto en Zaragoza.',
  jsonLd: { '@context': 'https://schema.org', '@graph': [org, { '@type': 'WebSite', url: SITE + '/', name: C.name }] },
  body: `
<section class="hero"><div class="wrap">
  <div>
    <span class="eyebrow">Catálogo · ${products.length} productos</span>
    <h1>Envases y embalajes industriales en ${esc(C.province)}</h1>
    <p>Todo lo que su almacén necesita para embalar, proteger y paletizar, con un solo proveedor. Productos personalizables y fabricación a medida.</p>
    <div class="cta"><a class="btn" href="/catalogo/">Ver el catálogo</a><a class="btn line" href="/contacto/">Pedir presupuesto</a></div>
  </div>
  <div class="photos">${heroPhotos.slice(0, 5).map((p) => `<div><img src="${p.image}" alt="${esc(p.name)}" /></div>`).join('')}</div>
</div></section>
<div class="usp"><div class="wrap">
  <div><b>✓</b> Ficha técnica en cada producto</div>
  <div><b>✓</b> Personalización total</div>
  <div><b>✓</b> Fabricación a medida</div>
  <div><b>✓</b> Presupuesto sin compromiso</div>
</div></div>

<section class="block"><div class="wrap">
  <div class="sec-head"><h2>Categorías</h2><a href="/catalogo/">Ver todo el catálogo →</a></div>
  <div class="tiles">${categories.map((c) => `<a class="tile" href="/categoria/${c.id}/">
    <div class="im">${c.image ? `<img src="${c.image}" alt="" loading="lazy" />` : ''}</div>
    <div class="tx"><h3>${esc(c.name)}</h3><span>${esc(c.tagline)}</span><em>${count(c.id)} productos →</em></div></a>`).join('')}</div>
</div></section>

<section class="block" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><h2>Productos destacados</h2><a href="/catalogo/">Ver los ${products.length} productos →</a></div>
  <div class="plist">${featured.map(pcard).join('')}</div>
</div></section>

<section class="block" style="padding-top:0"><div class="wrap">
  <div class="custom">
    <div class="tx"><span class="eyebrow">A medida</span><h2>Su marca en cada envío</h2>
      <p>Precinto impreso hasta en tres colores y medidas adaptadas a su producto. Todos nuestros productos pueden personalizarse.</p>
      <a class="btn" href="/producto/precinto-impreso/">Ver precinto impreso</a></div>
    <img src="/img/precinto-logo.jpg" alt="Precinto personalizado con logo" loading="lazy" />
  </div>
</div></section>

<section class="block" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><h2>Para quién trabajamos</h2><a href="/soluciones/">Ver soluciones →</a></div>
  <div class="audiences">${audiences.map((a) => `<article><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join('')}</div>
</div></section>
${closing()}`,
});

// Catálogo completo
add('/catalogo/', {
  title: 'Catálogo de envase y embalaje | Meridional Plastic',
  description: 'Catálogo completo: precinto, film, burbuja, foam, fleje, cartón, palés y maquinaria. Busque por producto, material o medida.',
  jsonLd: { '@context': 'https://schema.org', '@graph': [crumbs([['Inicio', '/'], ['Catálogo', '/catalogo/']])] },
  body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Catálogo', '/catalogo/']])}<h1>Catálogo</h1><p>${products.length} productos para embalar, proteger y paletizar.</p></div></div>
<div class="wrap shop">
  <aside class="side" aria-label="Filtros">
    <h4>Categoría</h4>
    <ul class="cats"><li><button data-cat="all" aria-pressed="true">Todas <span>${products.length}</span></button></li>${categories.map((c) => `<li><button data-cat="${c.id}" aria-pressed="false">${esc(c.name)} <span>${count(c.id)}</span></button></li>`).join('')}</ul>
    <h4>Tipo</h4>
    <ul>${TAGS.map((t) => `<li><label><input type="checkbox" value="${t}" />${t}</label></li>`).join('')}</ul>
  </aside>
  <div>
    <div class="toolbar"><input id="buscar" type="search" placeholder="Buscar: precinto, fleje PET, minifilm…" aria-label="Buscar en el catálogo" /><span class="muted" id="cuenta"></span></div>
    <div class="plist">${products.map(pcard).join('')}</div>
    <div class="empty-msg" id="vacio"><h3>Sin resultados</h3><p class="muted">Pruebe con otro término, o <a href="/contacto/">escríbanos</a> y se lo consultamos.</p></div>
  </div>
</div>${closing()}`,
});

// Categorías
categories.forEach((c) => {
  const g = guides[c.id];
  const list = products.filter((p) => p.category === c.id);
  const path = `/categoria/${c.id}/`;
  const first = list.find((p) => p.image);
  add(path, {
    title: g.title,
    description: g.metaDescription,
    image: first?.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'CollectionPage', name: g.h1, url: SITE + path, isPartOf: { '@id': `${SITE}/#organizacion` } },
        crumbs([['Inicio', '/'], ['Catálogo', '/catalogo/'], [c.name, path]]),
        { '@type': 'FAQPage', mainEntity: g.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      ],
    },
    body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Catálogo', '/catalogo/'], [c.name, path]])}<h1>${esc(g.h1)}</h1><p>${esc(g.intro)}</p></div></div>
<div class="wrap shop">
  <aside class="side">${sideCats(c.id)}<a class="btn sm" style="width:100%;margin-top:18px" href="/contacto/">Pedir presupuesto</a></aside>
  <div>
    <div class="toolbar"><h2>${esc(c.name)} <span class="muted" style="font-weight:500;font-size:1rem">· ${list.length} productos</span></h2></div>
    <div class="plist">${list.map(pcard).join('')}</div>
    ${g.guide ? `<div class="subblock"><h2>${esc(g.guide.heading)}</h2><table class="guide"><thead><tr><th>Si necesita…</th><th>Le recomendamos</th></tr></thead><tbody>${g.guide.rows.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>` : ''}
    <div class="subblock"><h2>Preguntas frecuentes</h2>${g.faq.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
  </div>
</div>${closing()}`,
  });
});

// Productos
products.forEach((p) => {
  const c = cat(p.category);
  const path = `/producto/${p.id}/`;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  add(path, {
    title: `${p.name} — ${c.name} | Meridional Plastic`,
    description: `${p.summary} Presupuesto sin compromiso en ${C.province}.`.slice(0, 158),
    image: p.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Product', name: p.name, description: p.summary, sku: p.id, category: c.name, url: SITE + path, ...(p.image ? { image: SITE + p.image } : {}), brand: { '@type': 'Brand', name: C.name }, manufacturer: org },
        crumbs([['Inicio', '/'], [c.name, `/categoria/${c.id}/`], [p.name, path]]),
      ],
    },
    body: `<div class="head"><div class="wrap" style="padding-bottom:16px">${crumbHtml([['Inicio', '/'], ['Catálogo', '/catalogo/'], [c.name, `/categoria/${c.id}/`], [p.name, path]])}</div></div>
<div class="wrap pdp">
  <div class="gallery${p.image ? '' : ' empty'}">${p.image ? `<img src="${p.image}" alt="${esc(p.name)}" />` : 'Foto próximamente'}</div>
  <div>
    <span class="eyebrow">${esc(p.family)}</span>
    <h1 style="margin-top:8px">${esc(p.name)}</h1>
    <div class="ref">Ref. ${esc(p.id)}${p.tags.length ? ' · ' + p.tags.map(esc).join(' · ') : ''}</div>
    <p class="sum">${esc(p.summary)}</p>
    <div class="buy">
      <div class="row"><button class="btn" data-add="${p.id}">＋ Añadir a mi presupuesto</button><a class="btn line" href="/contacto/">Ir al formulario</a></div>
      <p>Sin compromiso. Le respondemos con precio y condiciones.</p>
    </div>
    <table class="spec"><caption>Características</caption><tbody>${p.specs.map((s) => `<tr><td>${esc(s)}</td></tr>`).join('')}</tbody></table>
    ${p.variants?.length ? `<h3 style="margin-bottom:10px">Referencias disponibles</h3><ul class="refs">${p.variants.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>` : ''}
  </div>
</div>
${related.length ? `<section class="block" style="padding-top:8px"><div class="wrap"><div class="sec-head"><h2>Más de ${esc(c.name)}</h2><a href="/categoria/${c.id}/">Ver la categoría →</a></div><div class="plist">${related.map(pcard).join('')}</div></div></section>` : ''}
${closing()}`,
  });
});

// Soluciones
const solutions = [
  {
    slug: 'ecommerce', name: 'Embalaje para e-commerce', h1: 'Embalaje para e-commerce: que el pedido llegue entero',
    desc: 'Cajas de cartón, burbuja, precinto impreso y precintadoras para envíos de tienda online. Un solo proveedor en Zaragoza.',
    intro: 'Cada rotura es una devolución y un cliente menos. Con caja, protección y cierre bien elegidos, el pedido llega entero y con su marca.',
    kit: [['Caja', 'cajas-carton'], ['Protección', 'bolsa-burbuja'], ['Protección', 'bobina-burbuja'], ['Cierre', 'precinto-impreso'], ['Máquina', 'precintadora']],
    steps: ['Elija una caja de cartón de la medida del producto, sin holguras.', 'Proteja el contenido con bolsa o bobina de burbuja.', 'Cierre con precinto, mejor impreso con su logo, y aplíquelo con precintadora si envía volumen.'],
  },
  {
    slug: 'paletizado', name: 'Paletizado y flejado', h1: 'Paletizado seguro: film, fleje y palés',
    desc: 'Film estirable, fleje, flejadoras, envolvedoras y palés para mover y asegurar la carga. Presupuesto sin compromiso en Zaragoza.',
    intro: 'Una carga bien paletizada viaja sin desplazarse y se almacena sin riesgos. Combine palé, film y fleje según lo que mueva.',
    kit: [['Base', 'pales-polietileno'], ['Envoltura', 'film-manual'], ['Envoltura', 'film-automatico'], ['Atado', 'fleje-pp'], ['Atado', 'fleje-pet'], ['Máquina', 'envolvedora-ecoplat']],
    steps: ['Elija el palé y ponga la carga sobre él, centrada.', 'Envuelva con film estirable, a mano o con envolvedora.', 'Si la carga lo pide, asegure además con fleje y flejadora.'],
  },
  {
    slug: 'fragil', name: 'Producto frágil', h1: 'Cómo embalar productos frágiles sin roturas',
    desc: 'Burbuja, foam, cantoneras y precinto «muy frágil» para proteger mercancía delicada. Presupuesto sin compromiso en Zaragoza.',
    intro: 'Golpes, vibraciones y esquinas: las tres causas típicas de rotura en el transporte. Cada una tiene su material.',
    kit: [['Amortiguar', 'bobina-burbuja'], ['Amortiguar', 'foam-bobinas'], ['Esquinas', 'cantoneras'], ['Aviso', 'precinto-muy-fragil']],
    steps: ['Envuelva la pieza con burbuja o foam para amortiguar golpes.', 'Proteja aristas y esquinas con cantoneras o perfiles.', 'Cierre con precinto «MUY FRÁGIL» para que se manipule con cuidado.'],
  },
];
add('/soluciones/', {
  title: 'Soluciones de embalaje por necesidad | Meridional Plastic',
  description: 'Kits de embalaje para e-commerce, paletizado y producto frágil, con los productos recomendados de cada paso.',
  jsonLd: { '@context': 'https://schema.org', '@graph': [crumbs([['Inicio', '/'], ['Soluciones', '/soluciones/']])] },
  body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Soluciones', '/soluciones/']])}<h1>Soluciones</h1><p>No siempre se sabe qué producto pedir. Aquí partimos de la necesidad.</p></div></div>
<section class="block"><div class="wrap"><div class="audiences">${solutions.map((s) => `<a href="/soluciones/${s.slug}/" style="text-decoration:none"><article style="height:100%"><h3>${esc(s.name)}</h3><p>${esc(s.intro)}</p><p style="color:var(--brand-dark);font-weight:700;margin-top:12px">Ver kit →</p></article></a>`).join('')}</div></div></section>${closing()}`,
});
solutions.forEach((s) => {
  const path = `/soluciones/${s.slug}/`;
  add(path, {
    title: `${s.name} | Meridional Plastic`,
    description: s.desc,
    jsonLd: { '@context': 'https://schema.org', '@graph': [crumbs([['Inicio', '/'], ['Soluciones', '/soluciones/'], [s.name, path]])] },
    body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Soluciones', '/soluciones/'], [s.name, path]])}<h1>${esc(s.h1)}</h1><p>${esc(s.intro)}</p></div></div>
<section class="block"><div class="wrap prose">
<h2 style="margin-top:0">Paso a paso</h2><ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
<h2>Productos recomendados</h2><div class="kit">${s.kit.map(([k, id]) => `<a href="/producto/${id}/">${prod(id).image ? `<img src="${prod(id).image}" alt="" />` : '<span></span>'}<span><small>${k}</small>${esc(prod(id).name)}</span></a>`).join('')}</div>
<p>¿Dudas sobre cantidades o medidas? <a href="/contacto/">Cuéntenos su caso</a> y le preparamos un presupuesto sin compromiso.</p>
</div></section>${closing()}`,
  });
});

// Nosotros
add('/nosotros/', {
  title: 'Nosotros | Meridional Plastic, embalaje en Zaragoza',
  description: `${C.name}: proveedor de envases y embalajes industriales en ${C.town}, Zaragoza. Personalización y fabricación a medida.`,
  jsonLd: { '@context': 'https://schema.org', '@graph': [org, crumbs([['Inicio', '/'], ['Nosotros', '/nosotros/']])] },
  body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Nosotros', '/nosotros/']])}<h1>Su proveedor de embalaje en ${esc(C.province)}</h1></div></div>
<section class="block"><div class="wrap prose">
<p style="font-size:1.15rem">${esc(C.name)} distribuye material de envase y embalaje para industria y comercio desde ${esc(C.town)}.</p>
<h2>Qué nos diferencia</h2>
<ul><li><strong>Un solo proveedor</strong> para toda la línea: precinto, film, burbuja, foam, fleje, cartón, palés y maquinaria.</li>
<li><strong>Personalización total:</strong> todos nuestros productos pueden personalizarse.</li>
<li><strong>Fabricación a medida</strong> de envases y embalajes adaptados a sus necesidades.</li>
<li><strong>Ficha técnica</strong> en todos los productos.</li></ul>
</div></section>${closing()}`,
});

// Contacto
const names = Object.fromEntries(products.map((p) => [p.id, p.name]));
add('/contacto/', {
  title: 'Pedir presupuesto de embalaje | Meridional Plastic',
  description: `Solicite presupuesto sin compromiso de envases y embalajes. ${C.address}, ${C.town}, Zaragoza. Tel. ${C.phone}.`,
  jsonLd: { '@context': 'https://schema.org', '@graph': [org, crumbs([['Inicio', '/'], ['Contacto', '/contacto/']])] },
  body: `<div class="head"><div class="wrap">${crumbHtml([['Inicio', '/'], ['Contacto', '/contacto/']])}<h1>Pida su presupuesto</h1><p>Díganos producto, cantidad y código postal de entrega.</p></div></div>
<div class="wrap contact-grid">
<form class="quote" data-mail="${C.email}">
  <div class="qlist" id="qlist" hidden><strong>Productos en su presupuesto</strong><ul></ul></div>
  <label>Nombre<input name="nombre" required autocomplete="name" /></label>
  <label>Empresa<input name="empresa" autocomplete="organization" /></label>
  <label>Teléfono<input name="telefono" type="tel" autocomplete="tel" /></label>
  <label>Código postal de entrega<input name="cp" inputmode="numeric" /></label>
  <label>¿Qué necesita?<textarea name="mensaje" rows="5" required></textarea></label>
  <button class="btn" type="submit">Enviar solicitud</button>
  <span class="muted" style="font-size:.8rem">Se abrirá su programa de correo con la solicitud preparada.</span>
</form>
<div class="info-card">
  <div><small>Teléfono</small><a href="tel:+${C.phoneRaw}">${esc(C.phone)}</a></div>
  <div><small>Correo</small><a href="mailto:${C.email}">${esc(C.email)}</a></div>
  <div><small>Dirección</small>${esc(C.address)}<br />${esc(C.city)}</div>
  <div><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.address + ' ' + C.city)}" target="_blank" rel="noopener">Ver en el mapa ↗</a></div>
</div>
</div>
<script id="nombres" type="application/json">${JSON.stringify(names).replace(/</g, '\\u003c')}</script>`,
});

/* ------------------------------------------------------------------ Escritura */

await rm(out, { recursive: true, force: true });
await cp(join(here, 'public'), out, { recursive: true });
for (const { path, html } of pages) {
  const dir = join(out, path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Generadas ${pages.length} páginas en dist/`);
