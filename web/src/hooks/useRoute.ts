import { useSyncExternalStore } from 'react';
import { products, type Product } from '../data/catalog';

/**
 * Enrutado mínimo del catálogo.
 *
 * Cada ficha vive en su propia dirección, `/producto/<id>`, en lugar del
 * `#p/<id>` que se usaba antes: un fragmento no llega al servidor, así que
 * ningún buscador puede indexar las 39 fichas ni se les puede poner una etiqueta
 * `canonical` o una imagen de Open Graph propia. Con una ruta de verdad el
 * script de pregenerado (`scripts/prerender.mjs`) puede escribir un HTML por
 * producto.
 *
 * No se trae un router completo por dos rutas: el catálogo y la ficha.
 */

/** Base de despliegue, siempre con barra final (`/`, `/catalogo/`…). */
const BASE = import.meta.env.BASE_URL.replace(/\/*$/, '/');

export type Route = { name: 'home' } | { name: 'product'; id: string };

/** Ruta pública de una ficha, lista para un `href`. */
export const productPath = (p: Pick<Product, 'id'>) => `${BASE}producto/${p.id}`;

export const homePath = BASE;

/** URL absoluta, para los enlaces que se copian o se comparten. */
export const absolute = (path: string) =>
  typeof window === 'undefined' ? path : new URL(path, window.location.origin).href;

const parse = (pathname: string): Route => {
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  const m = /^producto\/([^/]+)\/?$/.exec(rel);
  if (!m) return { name: 'home' };
  return { name: 'product', id: decodeURIComponent(m[1]) };
};

/*
 * Direcciones antiguas: cualquier enlace `#p/<id>` que el cliente ya haya
 * repartido por correo sigue abriendo la ficha, ahora en su ruta nueva y sin
 * dejar el fragmento en la barra de direcciones.
 */
const migrateLegacyHash = () => {
  const m = /^#p\/(.+)$/.exec(window.location.hash);
  if (!m) return;
  const id = decodeURIComponent(m[1]);
  if (!products.some((p) => p.id === id)) return;
  window.history.replaceState(null, '', productPath({ id }));
};

if (typeof window !== 'undefined') migrateLegacyHash();

let current: Route =
  typeof window === 'undefined' ? { name: 'home' } : parse(window.location.pathname);

const listeners = new Set<() => void>();

const sync = () => {
  const next = parse(window.location.pathname);
  if (next.name === current.name && (next as { id?: string }).id === (current as { id?: string }).id) {
    return;
  }
  current = next;
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') window.addEventListener('popstate', sync);

/**
 * Navega sin recargar. `replace` evita dejar entrada en el historial, que es lo
 * que interesa al cerrar una ficha abierta desde un enlace compartido: un
 * `history.back()` sacaría de la web.
 */
export const navigate = (path: string, { replace = false } = {}) => {
  if (path === window.location.pathname) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', path);
  current = parse(path);
  listeners.forEach((l) => l());
};

const HOME: Route = { name: 'home' };

export const useRoute = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => HOME,
  );
