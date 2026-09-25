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
import { IconArrowDown, IconSearch, IconSend } from '@tabler/icons-react';
import { COMPANY, HIGHLIGHTS } from '../data/catalog';
import { openQuoteForm } from '../hooks/useQuote';
import classes from './Hero.module.css';

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

const goToCatalog = () =>
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

export function Hero({ query, onQuery }: Props) {
  return (
    <Box component="section" id="inicio" className={classes.hero}>
      <div className={classes.overlay} />
      <Container size="xl" className={classes.inner}>
        <Stack gap="lg" maw={760}>
          {/* La provincia va arriba del todo: «envase y embalaje en Zaragoza» es
              lo que se busca, y quien entra necesita saber en dos segundos si
              le cae cerca. */}
          <Badge size="lg" radius="xl" className={classes.year}>
            Distribuidor en {COMPANY.province}
          </Badge>

          <Title order={1} c="white">
            Productos para envase y embalaje
          </Title>

          <Text size="lg" className={classes.lead}>
            Precinto, film estirable, burbuja, foam, fleje, cartón, palés y maquinaria.
            Consulte la ficha técnica de cada producto y pídanos presupuesto sin
            compromiso.
          </Text>

          <TextInput
            size="md"
            radius="xl"
            className={classes.search}
            placeholder="Buscar producto, material o medida…"
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
              leftSection={<IconSend size={16} />}
              onClick={() => openQuoteForm()}
            >
              Pedir presupuesto
            </Button>
          </Group>

          {/*
            Motivos de compra, no recuentos. Antes aquí ponía «9 familias de
            producto» y «CE», que no son razones para elegir a nadie: el catálogo
            ya se ve entero unos centímetros más abajo. Los accesos por familia
            que había en esta misma zona se han quitado porque repetían, uno por
            uno, los filtros del catálogo.
          */}
          <Group gap="clamp(1.5rem, 5vw, 3.5rem)" className={classes.stats}>
            {HIGHLIGHTS.map((s) => (
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
