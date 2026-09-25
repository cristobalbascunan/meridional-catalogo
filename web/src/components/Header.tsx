import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  Indicator,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useHotkeys, useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { IconPhone, IconSearch, IconSend } from "@tabler/icons-react";
import { COMPANY, asset } from "../data/catalog";
import { openQuoteForm, useQuote } from "../hooks/useQuote";
import classes from "./Header.module.css";

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

/**
 * A partir de este desplazamiento el buscador de la portada ya no se ve y la
 * cabecera saca el suyo. Mientras los dos están en pantalla sólo mandaba uno,
 * y tener dos campos idénticos a la vez confundía más que ayudaba.
 */
const SEARCH_FROM = 300;

export function Header({ query, onQuery }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scroll] = useWindowScroll();
  const items = useQuote();

  const scrolledPastHero = scroll.y > SEARCH_FROM;

  // Con una búsqueda activa el campo permanece visible aunque no se haya desplegado
  // a mano, para que se vea qué se está filtrando.
  const showSearchRow = searchOpen || query !== "";

  // El campo ancho sólo existe a partir de 62em; por debajo se usa el desplegable.
  const wideSearch = useMediaQuery("(min-width: 62em)", true);

  const deskRef = useRef<HTMLInputElement>(null);
  // El campo del desplegable se monta una sola vez (se muestra y oculta por CSS),
  // así que hay que enfocarlo a mano al abrirlo: `autoFocus` sólo actúa al montar.
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /** Atajos de teclado habituales en un buscador: «/» y Ctrl/Cmd+K. */
  const focusSearch = () => {
    if (wideSearch && scrolledPastHero) deskRef.current?.focus();
    else setSearchOpen(true);
  };
  useHotkeys([
    ["/", focusSearch],
    ["mod+K", focusSearch],
  ]);

  const toggleSearch = () => {
    if (showSearchRow) {
      setSearchOpen(false);
      onQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  /** El campo de búsqueda es el mismo arriba y en el desplegable. */
  const searchInput = (
    ref: React.RefObject<HTMLInputElement | null>,
    className?: string,
  ) => (
    <TextInput
      className={className}
      ref={ref}
      placeholder="Buscar producto, material o medida…"
      value={query}
      onChange={(e) => onQuery(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      rightSection={
        query ? (
          <CloseButton
            size="sm"
            onClick={() => onQuery("")}
            aria-label="Limpiar búsqueda"
          />
        ) : null
      }
      radius="xl"
      aria-label="Buscar en el catálogo"
    />
  );

  return (
    <Box
      component="header"
      className={classes.header}
      data-scrolled={scroll.y > 8 || undefined}
    >
      <Container size="xl" className={classes.top}>
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <a
            href="#inicio"
            className={classes.brand}
            aria-label="Meridional Plastic — inicio"
          >
            <img
              src={asset("img/logo.png")}
              alt="Meridional Plastic"
              className={classes.logo}
              width={280}
              height={60}
            />
          </a>

          {/* El campo ancho aparece cuando el de la portada deja de verse. */}
          <Box
            className={classes.search}
            data-visible={(scrolledPastHero || query !== "") || undefined}
            aria-hidden={!scrolledPastHero && query === ""}
          >
            {searchInput(deskRef)}
          </Box>

          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              className={classes.searchToggle}
              variant={query ? "filled" : "default"}
              size="lg"
              radius="xl"
              aria-label={
                showSearchRow ? "Cerrar el buscador" : "Abrir el buscador"
              }
              aria-expanded={showSearchRow}
              onClick={toggleSearch}
            >
              <IconSearch size={18} />
            </ActionIcon>

            {/* Teléfono: en pantallas grandes con el número, en pequeñas sólo el icono. */}
            <Tooltip label={`Llamar al ${COMPANY.phone}`}>
              <ActionIcon
                className={classes.phoneIcon}
                component="a"
                href={`tel:+${COMPANY.phoneRaw}`}
                variant="default"
                size="lg"
                radius="xl"
                aria-label={`Llamar al ${COMPANY.phone}`}
              >
                <IconPhone size={18} />
              </ActionIcon>
            </Tooltip>
            <Button
              className={classes.phoneFull}
              component="a"
              href={`tel:+${COMPANY.phoneRaw}`}
              variant="default"
              leftSection={<IconPhone size={18} />}
            >
              {COMPANY.phone}
            </Button>

            {/*
              La acción principal de toda la web vive ahora en la cabecera, en
              lugar del conmutador de tema que ocupaba este sitio: a un comprador
              industrial le sirve de más un botón de presupuesto que el modo
              oscuro, que sigue funcionando solo según la preferencia del sistema.
            */}
            <Indicator
              label={items.length}
              size={18}
              disabled={items.length === 0}
              color="accent"
              offset={4}
            >
              <Button
                onClick={() => openQuoteForm()}
                leftSection={<IconSend size={18} />}
                className={classes.quoteFull}
              >
                {items.length > 0 ? "Mi solicitud" : "Presupuesto"}
              </Button>
              <ActionIcon
                onClick={() => openQuoteForm()}
                variant="filled"
                size="lg"
                radius="xl"
                className={classes.quoteIcon}
                aria-label="Solicitar presupuesto"
              >
                <IconSend size={18} />
              </ActionIcon>
            </Indicator>
          </Group>
        </Group>

        <Box
          className={classes.searchRow}
          data-open={showSearchRow || undefined}
        >
          {searchInput(searchRef)}
        </Box>
      </Container>
    </Box>
  );
}
