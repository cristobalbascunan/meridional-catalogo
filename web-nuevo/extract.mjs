// Extrae los datos del catálogo actual (solo contenido) a data.json.
import { createServer } from '../web/node_modules/vite/dist/node/index.js';
import { writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const server = await createServer({
  root: join(here, '../web'),
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});
const cat = await server.ssrLoadModule('/src/data/catalog.ts');
const seo = await server.ssrLoadModule('/src/data/seoContent.ts');
await server.close();
await writeFile(
  join(here, 'data.json'),
  JSON.stringify({ company: cat.COMPANY, categories: cat.categories, products: cat.products, guides: seo.guides, audiences: seo.audiences }, null, 2),
);
await cp(join(here, '../web/public/img'), join(here, 'public/img'), { recursive: true });
console.log('ok', cat.products.length, 'productos');
