import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Affix,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Group,
  Pill,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
  VisuallyHidden,
  rem,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp, IconFilterOff, IconMoodEmpty } from '@tabler/icons-react';
import { useViewTransition } from './hooks/useViewTransition';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ContactCta } from './components/ContactCta';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import {
  TAGS,
  categories,
  categoryById,
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

/** Ficha enlazada en la URL, del tipo `#p/precinto-impreso`. */
const productFromHash = (): Product | null => {
  const m = /^#p\/(.+)$/.exec(window.location.hash);
  if (!m) return null;
  return products.find((p) => p.id === decodeURIComponent(m[1])) ?? null;
};

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

  /**
   * Al empezar a buscar hay que ver los resultados. El buscador principal está en
   * la portada y la rejilla queda por debajo del pliegue: sin esto se escribe y
   * aparentemente no pasa nada. Sólo se baja si el catálogo no está ya a la vista,
   * para no dar tirones a quien busca desde la cabecera con los resultados delante.
   */
  const handleQuery = (v: string) => {
    const wasEmpty = query.trim() === '';
    setQuery(v);
    if (!wasEmpty || v.trim() === '') return;
    requestAnimationFrame(() => {
      const el = document.getElementById('catalogo');
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.4) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const reset = () =>
    startTransition(() => {
      setQuery('');
      setActive('all');
      setTags([]);
    });

  /* ------------------------------------------------- Ficha enlazable por URL */

  // Abrir una ficha añade una entrada al historial: el botón «atrás» del móvil
  // la cierra, y el enlace `#p/<id>` se le puede pasar a un cliente tal cual.
  // `pushed` distingue esa entrada nuestra de la de quien llega directamente
  // desde un enlace compartido: a ese, un `history.back()` lo sacaría de la web.
  const pushed = useRef(false);

  const openDetail = useCallback((p: Product) => {
    setDetail(p);
    window.history.pushState(null, '', `#p/${p.id}`);
    pushed.current = true;
  }, []);

  const closeDetail = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setDetail(null);
  }, []);

  useEffect(() => {
    const sync = () => {
      const p = productFromHash();
      if (!p) pushed.current = false;
      setDetail(p);
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const grid = (list: Product[], showCategory = false) => (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md" verticalSpacing="md">
      {list.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          showCategory={showCategory}
          onOpen={openDetail}
        />
      ))}
    </SimpleGrid>
  );

  return (
    <>
      <a href="#catalogo" className={classes.skip}>
        Saltar al catálogo
      </a>

      <Header
        query={query}
        onQuery={handleQuery}
        active={active}
        onActive={changeCategory}
      />

      <Hero query={query} onQuery={handleQuery} onActive={changeCategory} />

      <Container size="xl" py="xl" id="catalogo" component="main" tabIndex={-1}>
        <Stack gap="xl">
          {/* Barra de filtros */}
          <Box className={classes.toolbar}>
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

            {/* Resumen de lo aplicado: se ve de un vistazo por qué la lista está
                recortada, y cada criterio se puede quitar por separado. */}
            {isFiltering && (
              <Group gap={6} mt="sm">
                <Text size="xs" c="dimmed" fw={600}>
                  Filtros activos:
                </Text>
                {active !== 'all' && (
                  <Pill withRemoveButton onRemove={() => changeCategory('all')}>
                    {categoryById(active).name}
                  </Pill>
                )}
                {query.trim() !== '' && (
                  <Pill withRemoveButton onRemove={() => setQuery('')}>
                    «{query.trim()}»
                  </Pill>
                )}
                {tags.map((t) => (
                  <Pill
                    key={t}
                    withRemoveButton
                    onRemove={() =>
                      startTransition(() => setTags((prev) => prev.filter((x) => x !== t)))
                    }
                  >
                    {t}
                  </Pill>
                ))}
              </Group>
            )}
          </Box>

          {/* Recuento anunciado a los lectores de pantalla al cambiar los filtros. */}
          <VisuallyHidden aria-live="polite">
            {isFiltering
              ? `${filtered.length} productos encontrados`
              : `${products.length} productos en el catálogo`}
          </VisuallyHidden>

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
                  <Stack key={c.id} gap="md" id={c.id} component="section">
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

      <ContactCta />

      <Footer onActive={changeCategory} />

      <ProductDrawer product={detail} opened={detail !== null} onClose={closeDetail} />

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
