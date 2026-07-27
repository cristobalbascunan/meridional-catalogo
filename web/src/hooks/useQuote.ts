import { useCallback, useEffect, useMemo, useState } from 'react';
import { products, type Product } from '../data/catalog';

const STORAGE_KEY = 'mp-quote-v1';

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Lista de productos que el usuario quiere consultar. Se guarda en localStorage
 * para que no se pierda al recargar y se sincroniza entre pestañas.
 */
export function useQuote() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* almacenamiento no disponible (modo privado): la lista sigue en memoria */
    }
  }, [ids]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const items = useMemo(
    () =>
      ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [ids],
  );

  return { ids, items, count: items.length, toggle, remove, clear, has };
}
