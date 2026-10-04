import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronRight,
  IconMail,
} from "@tabler/icons-react";
import { categoryById, type CategoryId } from "../data/catalog";
import { guides } from "../data/seoContent";
import { homePath, linkTo } from "../hooks/useRoute";
import { openQuoteForm } from "../hooks/useQuote";
import classes from "./CategoryPage.module.css";

interface Props {
  id: CategoryId;
  /** El catálogo (índice + panel), el mismo componente que en la portada. */
  children: ReactNode;
}

/**
 * Página de una familia: cabecera propia con su H1 y su entradilla, y debajo
 * el mismo catálogo que en la portada, con esa familia abierta.
 *
 * Que el catálogo sea el mismo componente es lo que permite pasar de una
 * familia a otra desde el índice sin recargar: cambia la URL, cambia esta
 * cabecera y el panel hace su transición. `scripts/prerender.mjs` escribe el
 * HTML equivalente de cada familia, con `FAQPage` y `BreadcrumbList`, para los
 * buscadores.
 */
export function CategoryPage({ id, children }: Props) {
  const category = categoryById(id);
  const guide = guides[id];

  // Al navegar dentro de la aplicación no se recarga el documento: el título de
  // la pestaña hay que cambiarlo a mano. El pregenerado ya pone el suyo.
  useEffect(() => {
    const previous = document.title;
    document.title = guide.title;
    return () => {
      document.title = previous;
    };
  }, [guide.title]);

  return (
    <>
      {/* Misma receta que el hero de la portada —foto desaturada bajo el azul—
          para que se lea como la misma web y no como una página suelta. */}
      <Box
        className={classes.head}
        style={{ "--cat-photo": `url(${category.image})` } as CSSProperties}
      >
        <div className={classes.veil} />
        <Container size="xl" className={classes.headInner}>
          <Stack gap="md" maw={780}>
            <Group gap={6} className={classes.crumbs}>
              <Anchor
                href={homePath}
                onClick={linkTo(homePath)}
                className={classes.crumbLink}
              >
                Catálogo
              </Anchor>
              <IconChevronRight size={14} />
              <Text span inherit>
                {category.name}
              </Text>
            </Group>

            <Title order={1} c="white">
              {guide.h1}
            </Title>

            <Text size="lg" className={classes.intro}>
              {guide.intro}
            </Text>

            <Group gap="sm" mt={4}>
              <Button
                size="md"
                radius="xl"
                variant="white"
                color="dark"
                leftSection={<IconMail size={16} />}
                onClick={() => openQuoteForm()}
              >
                Pedir presupuesto
              </Button>
              <Button
                size="md"
                radius="xl"
                variant="outline"
                className={classes.ghost}
                component="a"
                href={homePath}
                onClick={linkTo(homePath)}
                leftSection={<IconArrowLeft size={16} />}
              >
                Volver a la portada
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {children}
    </>
  );
}
