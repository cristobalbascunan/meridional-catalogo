import { Box, Text } from '@mantine/core';
import { IconPackage } from '@tabler/icons-react';
import { categoryById, type Product } from '../data/catalog';
import classes from './PhotoFallback.module.css';

interface Props {
  product: Product;
  h: number;
  compact?: boolean;
}

/**
 * Hueco de los productos que todavía no tienen fotografía.
 *
 * Antes ponía «Foto pendiente», que es una nota interna: al cliente que entra
 * en la web le dice que el sitio está a medio hacer. Ahora es una tarjeta con
 * los colores de la casa y el nombre de la familia, que se lee como una
 * decisión y no como un descuido, y sigue distinguiéndose de una foto real de
 * un vistazo para quien tenga que completarlas.
 */
export function PhotoFallback({ product, h, compact }: Props) {
  const category = categoryById(product.category);

  return (
    <Box className={classes.box} h={h} data-compact={compact || undefined} role="img" aria-label={product.name}>
      <IconPackage size={compact ? 26 : 34} stroke={1.25} className={classes.icon} />
      <Text className={classes.family} aria-hidden>
        {category.name}
      </Text>
    </Box>
  );
}
