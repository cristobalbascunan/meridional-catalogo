import { useCallback } from 'react';
import { flushSync } from 'react-dom';

type StartViewTransition = (callback: () => void) => { finished: Promise<void> };

/**
 * Envuelve un cambio de estado en una transición de vista nativa.
 *
 * La View Transitions API saca una foto del antes y del después, así que el
 * cambio de estado tiene que haberse pintado antes de que termine el callback:
 * de ahí el `flushSync`. Donde no esté soportada —o si el usuario ha pedido
 * menos movimiento— simplemente se aplica el cambio sin animar.
 */
export function useViewTransition() {
  return useCallback((update: () => void) => {
    const start = (document as Document & { startViewTransition?: StartViewTransition })
      .startViewTransition;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof start !== 'function' || reduced) {
      update();
      return;
    }

    start.call(document, () => flushSync(update));
  }, []);
}
