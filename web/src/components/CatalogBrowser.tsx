import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
  VisuallyHidden,
} from "@mantine/core";
import { IconFilterOff, IconMoodEmpty, IconX } from "@tabler/icons-react";
import {
  TAGS,
  categories,
  categoryById,
  products,
  type CategoryId,
  type Product,
  type Tag,
} from "../data/catalog";
import { guides } from "../data/seoContent";
import { openQuoteForm } from "../hooks/useQuote";
import { ProductCard } from "./ProductCard";
import classes from "./CatalogBrowser.module.css";

/** Normaliza para buscar sin distinguir mayúsculas ni acentos. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Texto sobre el que busca el buscador: nombre, familia, resumen, specs, variantes y etiquetas. */
const haystack = (p: Product) =>
  norm(
    [
      p.name,
      p.family,
      p.summary,
      ...p.specs,
      ...(p.variants ?? []),
      ...p.tags,
    ].join(" "),
  );

const plural = (n: number) => `${n} ${n === 1 ? "producto" : "productos"}`;

const GRID_COLS = { base: 1, xs: 2, sm: 3, md: 2, lg: 3 };

interface Props {
  /**
   * Familia con la que se abre el catálogo. Sin ella —la portada— se ve todo;
   * en `/categoria/<id>` arranca en esa familia.
   */
  only?: CategoryId;
  query: string;
  onQuery: (v: string) => void;
  onOpen: (p: Product) => void;
}

type Selection = CategoryId | "all";

/**
 * El catálogo: lista de familias a la izquierda y productos a la derecha.
 *
 * «Todos los productos» viene marcado y enseña los cuarenta en una sola
 * rejilla, cada uno con su familia en la etiqueta. Elegir una familia deja sólo
 * esa, con su «cómo elegir» y sus preguntas frecuentes. No hay casillas ni
 * secciones apiladas: es un filtro de una sola elección.
 *
 * El tipo de uso (manual, automático, a medida) vive en una barra pegada sobre
 * los productos y se mantiene al cambiar de familia.
 */
export function CatalogBrowser({ only, query, onQuery, onOpen }: Props) {
  const [family, setFamily] = useState<Selection>(only ?? "all");
  const [tags, setTags] = useState<Tag[]>([]);

  const terms = useMemo(() => {
    const q = norm(query.trim());
    return q ? q.split(/\s+/) : [];
  }, [query]);
  const searching = terms.length > 0;

  /** Lo que deja pasar el buscador, antes de familia y tipo. */
  const searched = useMemo(
    () =>
      searching
        ? products.filter((p) => terms.every((t) => haystack(p).includes(t)))
        : products,
    [terms, searching],
  );

  // Dentro del grupo la gente espera «o»: marcar manual y automático enseña ambos.
  const passesTags = (p: Product) =>
    tags.length === 0 || tags.some((t) => p.tags.includes(t));
  const afterTags = searched.filter(passesTags);
  const visible =
    family === "all" ? afterTags : afterTags.filter((p) => p.category === family);

  // Recuento de cada familia con búsqueda y tipo aplicados; de cada tipo, con
  // búsqueda y familia aplicadas: siempre lo que saldría al pulsar.
  const familyCount = (id: CategoryId) =>
    afterTags.filter((p) => p.category === id).length;
  const inFamily = searched.filter(
    (p) => family === "all" || p.category === family,
  );
  const tagCount = (t: Tag) => inFamily.filter((p) => p.tags.includes(t)).length;

  /* En el móvil las familias son una fila que se desliza: la activa se centra
     sola. La primera vez sin animar, o al entrar en /categoria/fleje se vería
     el principio de la fila y la familia elegida quedaría fuera de pantalla. */
  const railRef = useRef<HTMLUListElement>(null);
  const railReady = useRef(false);
  useEffect(() => {
    const rail = railRef.current;
    const item = rail?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!rail || !item || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: item.offsetLeft - rail.clientWidth / 2 + item.clientWidth / 2,
      behavior: railReady.current ? "smooth" : "instant",
    });
    railReady.current = true;
  }, [family]);

  /*
   * Al filtrar, la lista se acorta de golpe. Si se estaba mirando por la mitad
   * de ella, la página pasa a ser más baja que la posición de scroll y el
   * navegador te deja al final: en el pie. Se vuelve al principio del catálogo
   * —antes de pintar, para que no se vea el salto— sólo cuando ya se había
   * bajado más allá de él; quien filtra desde arriba no se mueve.
   */
  const layoutRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  const filterKey = `${family}|${tags.join(",")}|${terms.join(" ")}`;
  useLayoutEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const el = layoutRef.current;
    if (!el) return;
    const header =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--mp-header-h"),
      ) || 80;
    const top = el.getBoundingClientRect().top;
    if (top < header) {
      window.scrollTo({ top: top + window.scrollY - header - 12, behavior: "instant" });
    }
  }, [filterKey]);

  const current = family === "all" ? null : categoryById(family);
  const narrowed = family !== "all" || tags.length > 0;
  const reset = () => {
    setFamily("all");
    setTags([]);
  };

  return (
    // `tabIndex` para que el enlace «Saltar al catálogo» deje el foco aquí.
    <Box id="catalogo" ref={layoutRef} tabIndex={-1} className={classes.layout}>
      {/* ---------------------------------------------------------- Familias */}
      <Box component="nav" aria-label="Familias" className={classes.side}>
        <Text className={classes.sideTitle}>Familias</Text>

        <ul className={classes.rail} ref={railRef}>
          <li>
            <button
              type="button"
              className={classes.item}
              aria-current={family === "all" ? "true" : undefined}
              onClick={() => setFamily("all")}
            >
              <span className={classes.name}>Todos los productos</span>
              <span className={classes.count}>{afterTags.length}</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={classes.item}
                aria-current={family === c.id ? "true" : undefined}
                data-empty={(familyCount(c.id) === 0 && family !== c.id) || undefined}
                onClick={() => setFamily(c.id)}
              >
                <span className={classes.name}>{c.name}</span>
                <span className={classes.count}>{familyCount(c.id)}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Tipo de uso: casillas bajo las familias, siempre a la vista con el
            lateral pegado. Se mantienen al cambiar de familia. */}
        <Box className={classes.filters} role="group" aria-labelledby="mp-filtros-titulo">
          <Group justify="space-between" className={classes.filtersHead}>
            <Text id="mp-filtros-titulo" className={classes.sideTitle}>
              Tipo de uso
            </Text>
            {tags.length > 0 && (
              <UnstyledButton onClick={() => setTags([])} className={classes.clear}>
                Quitar
              </UnstyledButton>
            )}
          </Group>
          <ul className={classes.tagList}>
            {TAGS.map((t) => (
              <li key={t}>
                <label
                  className={classes.tag}
                  data-dim={(tagCount(t) === 0 && !tags.includes(t)) || undefined}
                >
                  <input
                    type="checkbox"
                    checked={tags.includes(t)}
                    onChange={() =>
                      setTags((cur) =>
                        cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
                      )
                    }
                    className={classes.check}
                  />
                  <span className={classes.name}>{t}</span>
                  <span className={classes.count}>{tagCount(t)}</span>
                </label>
              </li>
            ))}
          </ul>
        </Box>
      </Box>

      {/* -------------------------------------------------------------- Panel */}
      <Box className={classes.panel}>
        <VisuallyHidden aria-live="polite">{plural(visible.length)}</VisuallyHidden>

        <Stack gap="lg">
          <Box>
            <Group gap="xs" align="center">
              <Title order={2} className={classes.headTitle}>
                {searching
                  ? `«${query.trim()}»`
                  : current
                    ? current.name
                    : "Todos los productos"}
              </Title>
              <Badge variant="light" color="gray" size="lg">
                {plural(visible.length)}
              </Badge>
            </Group>
            {current && !searching && (
              <Text c="dimmed" mt={6} maw={720}>
                {current.description}
              </Text>
            )}
          </Box>

          {(searching || narrowed) && (
          <Box className={classes.toolbar}>
            {searching && (
              <Button
                variant="subtle"
                radius="xl"
                size="compact-sm"
                leftSection={<IconX size={14} />}
                onClick={() => onQuery("")}
              >
                Quitar búsqueda
              </Button>
            )}
            {narrowed && (
              <Button
                variant="subtle"
                radius="xl"
                size="compact-sm"
                leftSection={<IconFilterOff size={14} />}
                onClick={reset}
              >
                Ver todo
              </Button>
            )}
          </Box>
          )}

          {visible.length === 0 ? (
            <Stack align="center" gap="sm" py="xl" c="dimmed">
              <IconMoodEmpty size={40} stroke={1.5} />
              <Text fw={600} ta="center">
                Ningún producto con esos criterios
              </Text>
              <Text size="sm" ta="center" maw={420}>
                Quite algún filtro o cambie la búsqueda. Si busca algo concreto,
                escríbanos y se lo consultamos.
              </Text>
              <Group gap="xs" mt="xs">
                <Button variant="light" radius="xl" onClick={reset}>
                  Ver todo el catálogo
                </Button>
                <Button variant="default" radius="xl" onClick={() => openQuoteForm()}>
                  Consultarnos
                </Button>
              </Group>
            </Stack>
          ) : family === "all" ? (
            // Todos los productos: agrupados por familia, con el encabezado
            // atenuado para que sirva de referencia sin competir con las fotos.
            <Stack gap="xl">
              {categories
                .map((c) => ({
                  c,
                  list: visible.filter((p) => p.category === c.id),
                }))
                .filter((g) => g.list.length > 0)
                .map(({ c, list }) => (
                  <section key={c.id} aria-labelledby={`g-${c.id}`}>
                    <Box className={classes.subhead}>
                      <Text
                        id={`g-${c.id}`}
                        component="h3"
                        className={classes.subtitle}
                      >
                        {c.name}
                      </Text>
                      <span className={classes.subcount}>{list.length}</span>
                    </Box>
                    <SimpleGrid cols={GRID_COLS} spacing="md" verticalSpacing="md">
                      {list.map((p) => (
                        <ProductCard key={p.id} product={p} onOpen={onOpen} />
                      ))}
                    </SimpleGrid>
                  </section>
                ))}
            </Stack>
          ) : (
            <SimpleGrid cols={GRID_COLS} spacing="md" verticalSpacing="md">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={onOpen} />
              ))}
            </SimpleGrid>
          )}

          {family !== "all" && !searching && tags.length === 0 && (
            <Guide id={family} />
          )}
        </Stack>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------ Cómo elegir + preguntas */

function Guide({ id }: { id: CategoryId }) {
  const guide = guides[id];
  return (
    <>
      {guide.guide && (
        <Stack gap="sm">
          <Title order={3} fz="1.25rem">
            {guide.guide.heading}
          </Title>
          <Table.ScrollContainer minWidth={420}>
            <Table
              withTableBorder
              verticalSpacing="sm"
              className={classes.table}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Si necesita…</Table.Th>
                  <Table.Th>Le recomendamos</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {guide.guide.rows.map(([need, pick]) => (
                  <Table.Tr key={need}>
                    <Table.Td fw={600}>{need}</Table.Td>
                    <Table.Td>{pick}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      )}

      <Stack gap="sm">
        <Title order={3} fz="1.25rem">
          Preguntas frecuentes
        </Title>
        <Accordion variant="separated" radius="md">
          {guide.faq.map((f) => (
            <Accordion.Item key={f.q} value={f.q}>
              <Accordion.Control>
                <Text fw={600} size="sm">
                  {f.q}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text c="dimmed" size="sm">
                  {f.a}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>
    </>
  );
}
