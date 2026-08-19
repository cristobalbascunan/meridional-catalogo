import { useMemo, useState } from 'react';
import {
  Affix,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
  rem,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp, IconFilterOff, IconMoodEmpty } from '@tabler/icons-react';
import { useViewTransition } from './hooks/useViewTransition';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import {
  TAGS,
  categories,
  products,
  type CategoryId,
  type Product,
  type Tag,
} from './data/catalog';
import classes from './App.module.css';

/** Normaliza para buscar sin distinguir mayúsculas ni acentos. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/** Texto sobre el que busca el buscador: nombre, familia, resumen, specs, variantes y etiquetas. */
const haystack = (p: Product) =>
  norm(
    [p.name, p.family, p.summary, ...p.specs, ...(p.variants ?? []), ...p.tags].join(' '),
  );

export default function App() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [detail, setDetail] = useState<Product | null>(null);
  const [scroll, scrollTo] = useWindowScroll();

  const startTransition = useViewTransition();

  // Productos que pasan categoría y búsqueda, todavía sin aplicar las etiquetas.
  // Sirve además para contar cuántos resultados daría cada etiqueta.
  const base = useMemo(() => {
    const q = norm(query.trim());
    const terms = q ? q.split(/\s+/) : [];
    return products.filter((p) => {
      if (active !== 'all' && p.category !== active) return false;
      if (terms.length > 0) {
        const h = haystack(p);
        if (!terms.every((t) => h.includes(t))) return false;
      }
      return true;
    });
  }, [query, active]);

  // Dentro de un mismo grupo de filtros la gente espera "o", no "y": marcar
  // «Uso manual» y «Uso automático» debe mostrar ambos, no sólo los productos
  // que sean las dos cosas a la vez.
  const filtered = useMemo(
    () => (tags.length === 0 ? base : base.filter((p) => tags.some((t) => p.tags.includes(t)))),
    [base, tags],
  );

  const tagCounts = useMemo(() => {
    const counts = {} as Record<Tag, number>;
    for (const t of TAGS) counts[t] = base.filter((p) => p.tags.includes(t)).length;
    return counts;
  }, [base]);

  const isFiltering = active !== 'all' || tags.length > 0 || query.trim() !== '';

  // Cambiar de categoría sí se anima; escribir en el buscador no, porque una
  // transición por cada pulsación se vería a trompicones.
  const changeCategory = (v: CategoryId | 'all') => startTransition(() => setActive(v));

  const reset = () =>
    startTransition(() => {
      setQuery('');
      setActive('all');
      setTags([]);
    });

  const grid = (list: Product[], showCategory = false) => (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md" verticalSpacing="md">
      {list.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          showCategory={showCategory}
          onOpen={setDetail}
        />
      ))}
    </SimpleGrid>
  );

  return (
    <>
      <Header
        query={query}
        onQuery={setQuery}
        active={active}
        onActive={changeCategory}
      />

      <Hero query={query} onQuery={setQuery} onActive={changeCategory} />

      <Container size="xl" py="xl" id="catalogo">
        <Stack gap="xl">
          {/* Filtros rápidos por característica */}
          <Group justify="space-between" align="flex-end" gap="md">
            <Box>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>
                Filtrar por característica
              </Text>
              <Chip.Group
                multiple
                value={tags}
                onChange={(v) => startTransition(() => setTags(v as Tag[]))}
              >
                <Group gap={8} className={classes.filterRow} wrap="nowrap">
                  {TAGS.map((t) => (
                    <Chip
                      key={t}
                      value={t}
                      variant="outline"
                      radius="xl"
                      size="sm"
                      disabled={tagCounts[t] === 0 && !tags.includes(t)}
                    >
                      {t}{' '}
                      <Text span c="dimmed" fz="xs">
                        {tagCounts[t]}
                      </Text>
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </Box>

            {isFiltering && (
              <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                leftSection={<IconFilterOff size={16} />}
                onClick={reset}
              >
                Quitar filtros
              </Button>
            )}
          </Group>

          {/* `catalogo` es el nombre de transición: al cambiar de categoría o de
              filtro sólo se funde esta zona, no la cabecera ni el hero. */}
          {isFiltering ? (
            /* Vista filtrada: una única rejilla con el recuento de resultados */
            <Stack gap="md" className={classes.results}>
              <Group gap="xs">
                <Title order={2} fz="1.5rem">
                  Resultados
                </Title>
                <Badge variant="light" color="gray" size="lg">
                  {filtered.length}
                </Badge>
              </Group>

              {filtered.length === 0 ? (
                <Stack align="center" gap="sm" py="xl" c="dimmed">
                  <IconMoodEmpty size={40} stroke={1.5} />
                  <Text fw={600}>No hemos encontrado productos con esos criterios</Text>
                  <Text size="sm" ta="center" maw={420}>
                    Prueba con otro término o quita algún filtro. Si buscas algo concreto,
                    escríbenos y lo consultamos.
                  </Text>
                  <Button variant="light" onClick={reset} mt="xs">
                    Ver todo el catálogo
                  </Button>
                </Stack>
              ) : (
                grid(filtered, active === 'all')
              )}
            </Stack>
          ) : (
            /* Vista completa: agrupada por categoría */
            <Stack gap="xl" className={classes.results}>
              {categories.map((c) => {
                const list = products.filter((p) => p.category === c.id);
                return (
                  <Stack key={c.id} gap="md" id={c.id}>
                    <Box>
                      <Group gap="xs" align="center">
                        <Title order={2} fz="1.6rem">
                          {c.name}
                        </Title>
                        <Badge variant="light" color="gray" size="lg">
                          {list.length}
                        </Badge>
                      </Group>
                      <Text c="dimmed" mt={4} maw={720}>
                        {c.description}
                      </Text>
                    </Box>
                    {grid(list)}
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Container>

      <Footer onActive={changeCategory} />

      <ProductDrawer
        product={detail}
        opened={detail !== null}
        onClose={() => setDetail(null)}
      />

      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition
          transition="slide-up"
          mounted={scroll.y > 600 && detail === null}
        >
          {(styles) => (
            <Button
              style={styles}
              variant="default"
              radius="xl"
              leftSection={<IconArrowUp size={16} />}
              onClick={() => scrollTo({ y: 0 })}
            >
              Arriba
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
}
