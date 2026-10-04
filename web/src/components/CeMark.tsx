interface Props {
  /** Alto en px o cualquier medida CSS; el ancho sale solo de la proporción. */
  height?: number | string;
  className?: string;
}

/**
 * Marcado CE oficial, en vectorial.
 *
 * Se dibuja en SVG en vez de usar la imagen porque aparece sobre fondos
 * distintos —blanco sobre el azul del hero, oscuro en una ficha— y un PNG negro
 * no se puede recolorear: aquí el color lo hereda del texto (`currentColor`).
 *
 * La geometría sigue la construcción reglamentaria (Reglamento 765/2008,
 * anexo II): cada letra es un anillo entre dos circunferencias de radios en
 * proporción 5:7, cortado por una vertical; la E añade su barra central, algo
 * más corta que el anillo. Las cifras salen de medir el marcado de referencia
 * sobre un lienzo de 2000 × 1429.
 */
export function CeMark({ height = '1em', className }: Props) {
  return (
    <svg
      viewBox="0 0 2000 1429"
      height={height}
      fill="currentColor"
      className={className}
      role="img"
      aria-label="Marcado CE"
      style={{ width: 'auto', flex: 'none', display: 'inline-block' }}
    >
      {/* C: anillo de radios 714 y 500 centrado en (714, 714), cortado en x = 785 */}
      <path d="M785 3.5A714 714 0 1 0 785 1424.5V1208.9A500 500 0 1 1 785 219.1Z" />
      {/* E: el mismo anillo centrado en (1928, 714), cortado en el borde derecho */}
      <path d="M2000 3.6A714 714 0 1 0 2000 1424.4V1208.8A500 500 0 1 1 2000 219.2Z" />
      {/* Barra central de la E, que arranca dentro del anillo para no dejar costura */}
      <path d="M1420 607H1857V822H1420Z" />
    </svg>
  );
}
