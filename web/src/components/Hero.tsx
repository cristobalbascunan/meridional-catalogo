import {
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconArrowDown, IconMail, IconSearch } from '@tabler/icons-react';
import { COMPANY, categories, products, type CategoryId } from '../data/catalog';
import classes from './Hero.module.css';

interface Props {
  query: string;
  onQuery: (v: string) => void;
  onActive: (v: CategoryId | 'all') => void;
}

const goToCatalog = () =>
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

export function Hero({ query, onQuery, onActive }: Props) {
  const stats = [
    { value: products.length, label: 'referencias' },
    { value: categories.length, label: 'familias de producto' },
    { value: 'CE', label: 'certificado en todos los productos' },
  ];

  return (
    <Box component="section" id="inicio" className={classes.hero}>
      <div className={classes.overlay} />
      <Container size="xl" className={classes.inner}>
        <Stack gap="lg" maw={760}>
          <Badge size="lg" radius="xl" className={classes.year}>
            Catálogo {COMPANY.catalogYear}
          </Badge>

          <Title order={1} c="white">
            Productos para envase y embalaje
          </Title>

          <Text size="lg" className={classes.lead}>
            {products.length} referencias en precinto, film estirable, burbuja, foam, fleje,
            cartón, palés y maquinaria. Consulta la ficha técnica de cada producto y pídenos
            presupuesto sin compromiso.
          </Text>

          <TextInput
            size="md"
            radius="xl"
            className={classes.search}
            placeholder="Buscar producto, material o uso…"
            value={query}
            onChange={(e) => onQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={18} />}
            rightSection={
              query ? (
                <CloseButton onClick={() => onQuery('')} aria-label="Limpiar búsqueda" />
              ) : null
            }
            aria-label="Buscar en el catálogo"
          />

          <Group gap="sm">
            <Button
              size="md"
              radius="xl"
              variant="white"
              color="dark"
              rightSection={<IconArrowDown size={16} />}
              onClick={goToCatalog}
            >
              Ver el catálogo
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              className={classes.ghost}
              leftSection={<IconMail size={16} />}
              component="a"
              href="#contacto"
            >
              Pedir presupuesto
            </Button>
          </Group>

          {/* Accesos directos a cada familia, en un tono discreto para que no
              compitan con los dos botones principales. */}
          <Group gap={8} wrap="nowrap" className={classes.quick}>
            {categories.map((c) => (
              <Button
                key={c.id}
                size="compact-sm"
                radius="xl"
                variant="default"
                className={classes.quickBtn}
                onClick={() => {
                  onActive(c.id);
                  goToCatalog();
                }}
              >
                {c.name}
              </Button>
            ))}
          </Group>

          <Group gap="clamp(1.5rem, 5vw, 3.5rem)" className={classes.stats}>
            {stats.map((s) => (
              <Box key={s.label} className={classes.stat}>
                <Text className={classes.statValue}>{s.value}</Text>
                <Text className={classes.statLabel}>{s.label}</Text>
              </Box>
            ))}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
