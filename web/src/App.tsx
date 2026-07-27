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
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import { QuoteDrawer } from './components/QuoteDrawer';
import { useQuote } from './hooks/useQuote';
import {
  TAGS,
  categories,
  products,
  type CategoryId,
  type Product,
  type Tag,
} from './data/catalog';

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
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  const quote = useQuote();

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    const terms = q ? q.split(/\s+/) : [];
    return products.filter((p) => {
      if (active !== 'all' && p.category !== active) return false;
      if (tags.length > 0 && !tags.every((t) => p.tags.includes(t))) return false;
      if (terms.length > 0) {
        const h = haystack(p);
        if (!terms.every((t) => h.includes(t))) return false;
      }
      return true;
    });
  }, [query, active, tags]);

  const isFiltering = active !== 'all' || tags.length > 0 || query.trim() !== '';

  const reset = () => {
    setQuery('');
    setActive('all');
    setTags([]);
  };

  const grid = (list: Product[], showCategory = false) => (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md" verticalSpacing="md">
      {list.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          selected={quote.has(p.id)}
          showCategory={showCategory}
          onOpen={setDetail}
          onToggle={quote.toggle}
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
        onActive={setActive}
        quoteCount={quote.count}
        onOpenQuote={() => setQuoteOpen(true)}
      />

      <Hero query={query} onQuery={setQuery} onActive={setActive} />

      <Container size="xl" py="xl" id="catalogo">
        <Stack gap="xl">
          {/* Filtros rápidos por característica */}
          <Group justify="space-between" align="flex-end" gap="md">
            <Box>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>
                Filtrar por característica
              </Text>
              <Chip.Group multiple value={tags} onChange={(v) => setTags(v as Tag[])}>
                <Group gap={8}>
                  {TAGS.map((t) => (
                    <Chip key={t} value={t} variant="outline" radius="xl" size="sm">
                      {t}
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

          {isFiltering ? (
            /* Vista filtrada: una única rejilla con el recuento de resultados */
            <Stack gap="md">
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
            categories.map((c) => {
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
            })
          )}
        </Stack>
      </Container>

      <Footer onActive={setActive} />

      <ProductDrawer
        product={detail}
        opened={detail !== null}
        selected={detail ? quote.has(detail.id) : false}
        onClose={() => setDetail(null)}
        onToggle={quote.toggle}
      />

      <QuoteDrawer
        opened={quoteOpen}
        items={quote.items}
        onClose={() => setQuoteOpen(false)}
        onRemove={quote.remove}
        onClear={quote.clear}
      />

      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition
          transition="slide-up"
          mounted={scroll.y > 600 && detail === null && !quoteOpen}
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
