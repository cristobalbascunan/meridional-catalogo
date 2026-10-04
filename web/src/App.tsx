import { useCallback, useRef, useState } from "react";
import {
  Affix,
  Box,
  Button,
  Container,
  Group,
  Transition,
  rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp, IconMail } from "@tabler/icons-react";
import {
  homePath,
  navigate,
  productPath,
  useRoute,
} from "./hooks/useRoute";
import { openQuoteForm, useQuote } from "./hooks/useQuote";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryPage } from "./components/CategoryPage";
import { CatalogBrowser } from "./components/CatalogBrowser";
import { Footer } from "./components/Footer";
import { ContactCta } from "./components/ContactCta";
import { ProductDrawer } from "./components/ProductDrawer";
import { QuoteModal } from "./components/QuoteModal";
import { products, type CategoryId, type Product } from "./data/catalog";
import classes from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [scroll, scrollTo] = useWindowScroll();

  const route = useRoute();
  const quoteItems = useQuote();
  const detail =
    route.name === "product"
      ? (products.find((p) => p.id === route.id) ?? null)
      : null;

  /*
   * Qué página queda detrás del panel de la ficha. Abrir un producto desde una
   * familia no debe llevarse por delante esa página: al cerrar el panel hay que
   * volver a la rejilla de donde se salió, no a la portada. Se recuerda la
   * última familia visitada y se vuelve a null en cuanto se pisa la portada.
   */
  const lastCategory = useRef<CategoryId | null>(null);
  if (route.name === "category") lastCategory.current = route.id;
  if (route.name === "home") lastCategory.current = null;
  const shownCategory =
    route.name === "category"
      ? route.id
      : route.name === "product"
        ? lastCategory.current
        : null;

  /**
   * Al empezar a buscar hay que ver los resultados. El buscador principal está en
   * la portada y el catálogo queda por debajo del pliegue: sin esto se escribe y
   * aparentemente no pasa nada. Sólo se baja si el catálogo no está ya a la vista,
   * para no dar tirones a quien busca desde la cabecera con los resultados delante.
   */
  const handleQuery = (v: string) => {
    const wasEmpty = query.trim() === "";
    setQuery(v);
    if (!wasEmpty || v.trim() === "") return;
    requestAnimationFrame(() => {
      const el = document.getElementById("catalogo");
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.4) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

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

  const browser = (
    <Container size="xl">
      {/* La clave reinicia el filtro al pasar de una página de familia a otra
          (enlaces del pie): cada una abre con sólo su familia marcada. */}
      <CatalogBrowser
        key={shownCategory ?? "todo"}
        only={shownCategory ?? undefined}
        query={query}
        onQuery={setQuery}
        onOpen={openDetail}
      />
    </Container>
  );

  return (
    <>
      <a href="#catalogo" className={classes.skip}>
        Saltar al catálogo
      </a>

      <Header query={query} onQuery={handleQuery} />

      <Box component="main">
        {shownCategory ? (
          <CategoryPage id={shownCategory}>{browser}</CategoryPage>
        ) : (
          <>
            <Hero query={query} onQuery={handleQuery} />
            {browser}
          </>
        )}
      </Box>

      <ContactCta />

      <Footer />

      <ProductDrawer
        product={detail}
        opened={detail !== null}
        onClose={closeDetail}
      />

      <QuoteModal />

      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Group gap="xs">
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

          {/*
            Con productos apuntados, el botón de enviar la solicitud acompaña
            durante todo el recorrido del catálogo: si hay que bajar hasta el
            final para encontrar cómo pedir presupuesto, no se pide.
          */}
          <Transition
            transition="slide-up"
            mounted={quoteItems.length > 0 && detail === null}
          >
            {(styles) => (
              <Button
                style={styles}
                radius="xl"
                size="md"
                leftSection={<IconMail size={18} />}
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
