import { useSyncExternalStore, type MouseEvent } from 'react';
import { categories, products, type CategoryId, type Product } from '../data/catalog';

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
 * Lo mismo vale para las familias: `/categoria/<id>` es una página de verdad,
 * con su propio texto, su tabla de «cómo elegir» y sus preguntas frecuentes. En
 * la portada las nueve competían por el mismo título y ninguna podía posicionar
 * su búsqueda («film estirable Zaragoza», «tipos de fleje»…).
 *
 * No se trae un router completo por tres rutas: catálogo, familia y ficha.
 */

/** Base de despliegue, siempre con barra final (`/`, `/catalogo/`…). */
const BASE = import.meta.env.BASE_URL.replace(/\/*$/, '/');

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: CategoryId }
  | { name: 'product'; id: string };

/** Ruta pública de una ficha, lista para un `href`. */
export const productPath = (p: Pick<Product, 'id'>) => `${BASE}producto/${p.id}`;

/** Ruta pública de una familia. */
export const categoryPath = (id: CategoryId) => `${BASE}categoria/${id}`;

export const homePath = BASE;

/**
 * Manejador para un enlace interno: navega sin recargar, pero deja pasar el
 * clic con Ctrl/Cmd/medio para que siga abriéndose en otra pestaña. Los `href`
 * son reales, así que sin JavaScript el enlace funciona igual.
 */
export const linkTo = (path: string) => (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  navigate(path);
  window.scrollTo({ top: 0 });
};

/** URL absoluta, para los enlaces que se copian o se comparten. */
export const absolute = (path: string) =>
  typeof window === 'undefined' ? path : new URL(path, window.location.origin).href;

const parse = (pathname: string): Route => {
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');

  const c = /^categoria\/([^/]+)\/?$/.exec(rel);
  if (c) {
    const id = decodeURIComponent(c[1]);
    // Una familia inventada cae en la portada, no en una página en blanco.
    if (categories.some((x) => x.id === id)) return { name: 'category', id: id as CategoryId };
    return { name: 'home' };
  }

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
