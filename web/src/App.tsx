import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Affix,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  Group,
  Indicator,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
  VisuallyHidden,
  rem,
} from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import {
  IconAdjustmentsHorizontal,
  IconArrowUp,
  IconMoodEmpty,
  IconSend,
} from '@tabler/icons-react';
import { useViewTransition } from './hooks/useViewTransition';
import { homePath, navigate, productPath, useRoute } from './hooks/useRoute';
import { openQuoteForm, useQuote } from './hooks/useQuote';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ContactCta } from './components/ContactCta';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import { QuoteModal } from './components/QuoteModal';
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
    .replace(/[̀-ͯ]/g, '');

/** Texto sobre el que busca el buscador: nombre, familia, resumen, specs, variantes y etiquetas. */
const haystack = (p: Product) =>
  norm(
    [p.name, p.family, p.summary, ...p.specs, ...(p.variants ?? []), ...p.tags].join(' '),
  );

export default function App() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [scroll, scrollTo] = useWindowScroll();
  const [filtersOpen, filtersCtl] = useDisclosure(false);

  const route = useRoute();
  const quoteItems = useQuote();
  const detail = route.name === 'product' ? products.find((p) => p.id === route.id) ?? null : null;

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

  // Recuento por categoría dentro de la búsqueda activa: el chip enseña cuántos
  // productos daría y se desactiva si no daría ninguno.
  const categoryCounts = useMemo(() => {
    const q = norm(query.trim());
    const terms = q ? q.split(/\s+/) : [];
    const match = (p: Product) =>
      terms.length === 0 || terms.every((t) => haystack(p).includes(t));
    const counts = {} as Record<CategoryId | 'all', number>;
    counts.all = products.filter(match).length;
    for (const c of categories) {
      counts[c.id] = products.filter((p) => p.category === c.id && match(p)).length;
    }
    return counts;
  }, [query]);

  const tagCounts = useMemo(() => {
    const counts = {} as Record<Tag, number>;
    for (const t of TAGS) counts[t] = base.filter((p) => p.tags.includes(t)).length;
    return counts;
  }, [base]);

  const isFiltering = active !== 'all' || tags.length > 0 || query.trim() !== '';
  /** Criterios activos, para el contador del botón de filtros del móvil. */
  const activeCount = (active !== 'all' ? 1 : 0) + tags.length + (query.trim() !== '' ? 1 : 0);

  // Cambiar de categoría sí se anima; escribir en el buscador no, porque una
  // transición por cada pulsación se vería a trompicones.
  const changeCategory = (v: CategoryId | 'all') => startTransition(() => setActive(v));
  const changeTags = (v: Tag[]) => startTransition(() => setTags(v));

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

  /* ------------------------------------------------ Ficha con dirección propia */

  // Abrir una ficha añade una entrada al historial: el botón «atrás» del móvil
  // la cierra, y la dirección `/producto/<id>` se le puede pasar a un cliente
  // tal cual. `pushed` distingue esa entrada nuestra de la de quien llega
  // directamente desde un enlace compartido: a ese, un `history.back()` lo
  // sacaría de la web.
  const pushed = useRef(false);

  const openDetail = useCallback((p: Product) => {
    navigate(productPath(p));
    pushed.current = true;
  }, []);

  const closeDetail = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    navigate(homePath, { replace: true });
  }, []);

  const filterProps = {
    active,
    tags,
    query,
    categoryCounts,
    tagCounts,
    isFiltering,
    onCategory: changeCategory,
    onTags: changeTags,
    onQuery: setQuery,
    onReset: reset,
  };

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

      <Header query={query} onQuery={handleQuery} />

      <Hero query={query} onQuery={handleQuery} />

      <Container size="xl" py="xl" id="catalogo" component="main" tabIndex={-1}>
        <Stack gap="xl">
          {/* Barra de filtros completa: sólo a partir de tableta. */}
          <Box className={classes.toolbar}>
            <Filters {...filterProps} />
          </Box>

          {/*
            En el móvil la barra entera ocupaba dos tercios de la pantalla, así
            que se dejaba quieta y había que volver arriba para cambiar de
            categoría — justo donde más falta hace. Ahora se queda pegada una
            sola línea y los filtros se abren en un panel.
          */}
          <Box className={classes.mobileBar}>
            <Indicator label={activeCount} size={18} disabled={activeCount === 0} offset={6}>
              <Button
                variant="default"
                radius="xl"
                leftSection={<IconAdjustmentsHorizontal size={18} />}
                onClick={filtersCtl.open}
              >
                Filtros
              </Button>
            </Indicator>
            <Text size="sm" c="dimmed">
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </Text>
          </Box>

          <Drawer
            opened={filtersOpen}
            onClose={filtersCtl.close}
            position="bottom"
            size="auto"
            radius="lg"
            title={
              <Text fw={700}>
                Filtrar catálogo{' '}
                <Text span c="dimmed" fw={400}>
                  ({filtered.length})
                </Text>
              </Text>
            }
          >
            <Box pb="md">
              <Filters {...filterProps} stacked />
              <Button fullWidth mt="md" size="md" onClick={filtersCtl.close}>
                Ver {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
              </Button>
            </Box>
          </Drawer>

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
                    Pruebe con otro término o quite algún filtro. Si busca algo concreto,
                    escríbanos y se lo consultamos.
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

      <QuoteModal />

      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Group gap="xs">
          <Transition
            transition="slide-up"
            mounted={scroll.y > 600 && detail === null && !filtersOpen}
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

          {/*
            Con productos apuntados, el botón de enviar la solicitud acompaña
            durante todo el recorrido del catálogo: si hay que bajar hasta el
            final para encontrar cómo pedir presupuesto, no se pide.
          */}
          <Transition
            transition="slide-up"
            mounted={quoteItems.length > 0 && detail === null && !filtersOpen}
          >
            {(styles) => (
              <Button
                style={styles}
                radius="xl"
                size="md"
                leftSection={<IconSend size={18} />}
                onClick={() => openQuoteForm()}
              >
                Pedir presupuesto ({quoteItems.length})
              </Button>
            )}
          </Transition>
        </Group>
      </Affix>
    </>
  );
}
