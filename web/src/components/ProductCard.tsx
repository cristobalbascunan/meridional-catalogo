import { ActionIcon, Badge, Box, Card, Group, Image, Stack, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconPlus } from '@tabler/icons-react';
import { categoryById, type Product } from '../data/catalog';
import classes from './ProductCard.module.css';

interface Props {
  product: Product;
  selected: boolean;
  /** En la vista agrupada la categoría ya la da el encabezado de sección. */
  showCategory?: boolean;
  onOpen: (p: Product) => void;
  onToggle: (id: string) => void;
}

export function ProductCard({ product, selected, showCategory, onOpen, onToggle }: Props) {
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
          className={classes.image}
        />
        <Tooltip
          label={selected ? 'Quitar de la solicitud' : 'Añadir a la solicitud'}
          position="left"
          withArrow
        >
          <ActionIcon
            className={classes.add}
            variant={selected ? 'filled' : 'default'}
            color={selected ? 'brand' : undefined}
            size="lg"
            radius="xl"
            aria-label={selected ? 'Quitar de la solicitud' : 'Añadir a la solicitud'}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(product.id);
            }}
          >
            {selected ? <IconCheck size={18} /> : <IconPlus size={18} />}
          </ActionIcon>
        </Tooltip>
      </Card.Section>

      <Stack gap={6} mt="md" style={{ flex: 1 }}>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lh={1.2}>
          {product.family}
        </Text>
        <Text fw={700} lh={1.25}>
          {product.name}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={3}>
          {product.summary}
        </Text>
        <Box style={{ flex: 1 }} />
        <Group gap={6} mt={4}>
          {showCategory && (
            <Badge size="sm" variant="light" color="gray">
              {category.name}
            </Badge>
          )}
          {product.tags.slice(0, 2).map((t) => (
            <Badge key={t} size="sm" variant="light" color="ocean">
              {t}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
