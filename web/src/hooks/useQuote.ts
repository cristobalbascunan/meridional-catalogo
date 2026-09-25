import { useSyncExternalStore } from 'react';

/**
 * Lista de solicitud de presupuesto.
 *
 * No es un carrito: no hay precios, ni unidades, ni pago. Es la forma en la que
 * de verdad se pide material de embalaje — se recorre el catálogo, se apuntan
 * cuatro o cinco referencias y se piden todas de una vez — en lugar de escribir
 * un correo por producto.
 *
 * Se guarda en `localStorage` porque entre que se mira el catálogo y se pide el
 * presupuesto se pasa por una llamada, una reunión o el día siguiente.
 */

const KEY = 'mp.solicitud';

/** Ids de producto, en el orden en que se fueron añadiendo. */
let items: string[] = [];
const listeners = new Set<() => void>();

/** El almacenamiento puede fallar (modo privado, cookies bloqueadas): nunca debe tumbar la web. */
const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

const write = (next: string[]) => {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* Sin persistencia la lista sigue funcionando durante la visita. */
  }
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') {
  items = read();
  // Dos pestañas abiertas con el catálogo: lo que se añade en una aparece en la otra.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    items = read();
    listeners.forEach((l) => l());
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const EMPTY: string[] = [];

export const quote = {
  add: (id: string) => {
    if (items.includes(id)) return;
    write([...items, id]);
  },
  remove: (id: string) => write(items.filter((x) => x !== id)),
  toggle: (id: string) =>
    items.includes(id) ? quote.remove(id) : quote.add(id),
  clear: () => write([]),
  has: (id: string) => items.includes(id),
};

/** Ids en la lista. Estable entre renders mientras no cambie. */
export const useQuote = () =>
  useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY,
  );

/* ------------------------------------------- Apertura del formulario de envío */

/*
 * El formulario se abre desde la cabecera, la portada, la ficha y el cierre del
 * catálogo. Un estado suelto aquí evita pasar el mismo `onOpen` por cuatro
 * niveles de componentes que no lo usan para nada más.
 */
let formOpen = false;
const formListeners = new Set<() => void>();

const setFormOpen = (v: boolean) => {
  if (formOpen === v) return;
  formOpen = v;
  formListeners.forEach((l) => l());
};

/** Abre el formulario, opcionalmente añadiendo antes un producto a la lista. */
export const openQuoteForm = (id?: string) => {
  if (id) quote.add(id);
  setFormOpen(true);
};

export const closeQuoteForm = () => setFormOpen(false);

export const useQuoteFormOpen = () =>
  useSyncExternalStore(
    (l) => {
      formListeners.add(l);
      return () => formListeners.delete(l);
    },
    () => formOpen,
    () => false,
  );
