import { ActionIcon, Badge, Box, Card, Group, Image, Text, Tooltip } from '@mantine/core';
import { IconArrowRight, IconCheck, IconPlus } from '@tabler/icons-react';
import { categoryById, type Product } from '../data/catalog';
import { productPath } from '../hooks/useRoute';
import { quote, useQuote } from '../hooks/useQuote';
import { PhotoFallback } from './PhotoFallback';
import classes from './ProductCard.module.css';

interface Props {
  product: Product;
  /** En la vista agrupada la categoría ya la da el encabezado de sección. */
  showCategory?: boolean;
  onOpen: (p: Product) => void;
}

export function ProductCard({ product, showCategory, onOpen }: Props) {
  const category = categoryById(product.category);
  const inQuote = useQuote().includes(product.id);

  return (
    <Card withBorder padding="md" className={classes.card}>
      {/*
        La tarjeta entera es un enlace de verdad a `/producto/<id>`, no un div
        con `role="button"`: así se puede abrir en otra pestaña con el botón
        central o con Ctrl, se ve la dirección al pasar por encima, y el
        buscador encuentra las 39 fichas. La navegación se intercepta para
        seguir abriendo el panel lateral sin recargar, pero el `href` es real
        por si el JavaScript no llega a cargar.
      */}
      <a
        href={productPath(product)}
        className={classes.link}
        onClick={(e) => {
          // Ctrl/Cmd/medio/shift: que el navegador haga lo suyo (nueva pestaña, ventana…).
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          onOpen(product);
        }}
      >
        <Box className={classes.media} h={170}>
          {product.image ? (
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
          ) : (
            <PhotoFallback product={product} h={170} />
          )}
        </Box>

        <div className={classes.body}>
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
        </div>
      </a>

      <Box style={{ flex: 1 }} />

      <Group gap={6} mt="sm" wrap="nowrap" justify="space-between" align="flex-end">
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

        <Group gap={4} wrap="nowrap">
          {/*
            Añadir a la solicitud sin tener que abrir la ficha: recorriendo una
            categoría se apuntan tres o cuatro referencias de una pasada, que es
            como se pide de verdad el material de embalaje.
          */}
          <Tooltip label={inQuote ? 'Quitar de mi solicitud' : 'Añadir a mi solicitud'} withArrow>
            <ActionIcon
              variant={inQuote ? 'filled' : 'light'}
              color={inQuote ? 'teal' : 'brand'}
              radius="xl"
              size="lg"
              aria-label={
                inQuote
                  ? `Quitar ${product.name} de mi solicitud`
                  : `Añadir ${product.name} a mi solicitud`
              }
              aria-pressed={inQuote}
              onClick={() => quote.toggle(product.id)}
            >
              {inQuote ? <IconCheck size={17} /> : <IconPlus size={17} />}
            </ActionIcon>
          </Tooltip>
          {/* Pista de que la tarjeta se abre. Decorativa: el enlace ya tiene nombre. */}
          <Box className={classes.go} aria-hidden>
            <IconArrowRight size={16} />
          </Box>
        </Group>
      </Group>
    </Card>
  );
}
