import { Badge, Box, Card, Group, Image, Stack, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { categoryById, type Product } from '../data/catalog';
import classes from './ProductCard.module.css';

interface Props {
  product: Product;
  /** En la vista agrupada la categoría ya la da el encabezado de sección. */
  showCategory?: boolean;
  onOpen: (p: Product) => void;
}

export function ProductCard({ product, showCategory, onOpen }: Props) {
  const category = categoryById(product.category);

  return (
    <Card
      withBorder
      padding="md"
      className={classes.card}
      onClick={() => onOpen(product)}
      role="button"
      tabIndex={0}
      aria-label={`Ver ficha de ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(product);
        }
      }}
    >
      <Card.Section className={classes.media}>
        <Image
          src={product.image}
          alt={product.name}
          fit="contain"
          h={170}
          loading="lazy"
          decoding="async"
          className={classes.image}
          data-size={product.imageSize}
          onLoad={(e) => e.currentTarget.setAttribute('data-loaded', '')}
          // Si la imagen ya estaba en caché, `onLoad` puede no llegar a dispararse.
          ref={(el) => {
            if (el?.complete) el.setAttribute('data-loaded', '');
          }}
        />
      </Card.Section>

      <Stack gap={6} mt="md" style={{ flex: 1 }}>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lh={1.2}>
          {product.family}
        </Text>
        {/* Encabezado real: da estructura a la página para lectores de pantalla
            y para los buscadores, además de estilo. */}
        <Text component="h3" fw={700} fz="md" lh={1.25} m={0}>
          {product.name}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={3}>
          {product.summary}
        </Text>
        <Box style={{ flex: 1 }} />
        <Group gap={6} mt={4} wrap="nowrap" justify="space-between" align="flex-end">
          <Group gap={6}>
            {showCategory && (
              <Badge size="sm" variant="light" color="gray">
                {category.name}
              </Badge>
            )}
            {product.tags.slice(0, 2).map((t) => (
              <Badge key={t} size="sm" variant="light" color="brand">
                {t}
              </Badge>
            ))}
          </Group>
          {/* Pista de que la tarjeta se abre. Decorativa: el nombre accesible ya
              lo da el aria-label de la tarjeta. */}
          <Box className={classes.go} aria-hidden>
            <IconArrowRight size={16} />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
