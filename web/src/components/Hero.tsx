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
import { IconArrowDown, IconSearch } from '@tabler/icons-react';
import { COMPANY, categories, products, type CategoryId } from '../data/catalog';
import classes from './Hero.module.css';

interface Props {
  query: string;
  onQuery: (v: string) => void;
  onActive: (v: CategoryId | 'all') => void;
}

export function Hero({ query, onQuery, onActive }: Props) {
  return (
    <Box component="section" id="inicio" className={classes.hero}>
      <div className={classes.overlay} />
      <Container size="xl" className={classes.inner}>
        <Stack gap="lg" maw={720}>
          <Badge size="lg" radius="xl" className={classes.year}>
            Catálogo {COMPANY.catalogYear}
          </Badge>

          <Title order={1} c="white">
            Productos para envase y embalaje
          </Title>

          <Text size="lg" className={classes.lead}>
            {products.length} referencias en film estirable, precintos, fleje, cartón y palets.
            Consulta la ficha de cada producto y prepara tu solicitud en un minuto.
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

          <Group gap={8}>
            {categories.map((c) => (
              <Button
                key={c.id}
                size="compact-md"
                radius="xl"
                variant="white"
                color="dark"
                onClick={() => {
                  onActive(c.id);
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {c.name}
              </Button>
            ))}
          </Group>

          <Button
            variant="subtle"
            color="gray.0"
            size="compact-md"
            className={classes.jump}
            rightSection={<IconArrowDown size={16} />}
            onClick={() =>
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Ver todo el catálogo
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
