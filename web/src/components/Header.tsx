import { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  ScrollArea,
  TextInput,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useHotkeys, useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { IconMoon, IconPhone, IconSearch, IconSun } from '@tabler/icons-react';
import { COMPANY, asset, categories, type CategoryId } from '../data/catalog';
import classes from './Header.module.css';

interface Props {
  query: string;
  onQuery: (v: string) => void;
  active: CategoryId | 'all';
  onActive: (v: CategoryId | 'all') => void;
}

export function Header({ query, onQuery, active, onActive }: Props) {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [searchOpen, setSearchOpen] = useState(false);
  const [scroll] = useWindowScroll();

  // Con una búsqueda activa el campo permanece visible aunque no se haya desplegado
  // a mano, para que se vea qué se está filtrando.
  const showSearchRow = searchOpen || query !== '';

  // El campo ancho sólo existe a partir de 62em; por debajo se usa el desplegable.
  const wideSearch = useMediaQuery('(min-width: 62em)', true);

  const deskRef = useRef<HTMLInputElement>(null);
  // El campo del desplegable se monta una sola vez (se muestra y oculta por CSS),
  // así que hay que enfocarlo a mano al abrirlo: `autoFocus` sólo actúa al montar.
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /** Atajos de teclado habituales en un buscador: «/» y Ctrl/Cmd+K. */
  const focusSearch = () => {
    if (wideSearch) deskRef.current?.focus();
    else setSearchOpen(true);
  };
  useHotkeys([
    ['/', focusSearch],
    ['mod+K', focusSearch],
  ]);

  const toggleSearch = () => {
    if (showSearchRow) {
      setSearchOpen(false);
      onQuery('');
    } else {
      setSearchOpen(true);
    }
  };

  const chips: { id: CategoryId | 'all'; label: string }[] = [
    { id: 'all', label: 'Todo el catálogo' },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];

  /** El campo de búsqueda es el mismo arriba y en el desplegable. */
  const searchInput = (ref: React.RefObject<HTMLInputElement | null>, className?: string) => (
    <TextInput
      className={className}
      ref={ref}
      placeholder="Buscar producto, material o uso…"
      value={query}
      onChange={(e) => onQuery(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      rightSection={
        query ? (
          <CloseButton size="sm" onClick={() => onQuery('')} aria-label="Limpiar búsqueda" />
        ) : null
      }
      radius="xl"
      aria-label="Buscar en el catálogo"
    />
  );

  return (
    <Box component="header" className={classes.header} data-scrolled={scroll.y > 8 || undefined}>
      <Container size="xl" className={classes.top}>
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <a href="#inicio" className={classes.brand} aria-label="Meridional Plastic — inicio">
            <img
              src={asset('img/logo.png')}
              alt="Meridional Plastic"
              className={classes.logo}
              width={140}
              height={34}
            />
          </a>

          {searchInput(deskRef, classes.search)}

          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              className={classes.searchToggle}
              variant={query ? 'filled' : 'default'}
              size="lg"
              radius="xl"
              aria-label={showSearchRow ? 'Cerrar el buscador' : 'Abrir el buscador'}
              aria-expanded={showSearchRow}
              onClick={toggleSearch}
            >
              <IconSearch size={18} />
            </ActionIcon>

            <Tooltip label={scheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
              <ActionIcon
                variant="default"
                size="lg"
                radius="xl"
                aria-label="Cambiar tema"
                onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}
              >
                {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            <Button
              className={classes.phoneFull}
              component="a"
              href={`tel:+${COMPANY.phoneRaw}`}
              leftSection={<IconPhone size={18} />}
            >
              {COMPANY.phone}
            </Button>
            <ActionIcon
              className={classes.phoneIcon}
              component="a"
              href={`tel:+${COMPANY.phoneRaw}`}
              variant="filled"
              size="lg"
              radius="xl"
              aria-label={`Llamar al ${COMPANY.phone}`}
            >
              <IconPhone size={18} />
            </ActionIcon>
          </Group>
        </Group>

        <Box className={classes.searchRow} data-open={showSearchRow || undefined}>
          {searchInput(searchRef)}
        </Box>
      </Container>

      <Box component="nav" className={classes.navWrap} aria-label="Categorías del catálogo">
        <Container size="xl" px={0}>
          <ScrollArea type="never" offsetScrollbars={false}>
            <Group gap={8} wrap="nowrap" className={classes.chips}>
              {chips.map((c) => (
                <Badge
                  key={c.id}
                  component="button"
                  type="button"
                  size="lg"
                  radius="xl"
                  variant={active === c.id ? 'filled' : 'default'}
                  className={classes.chip}
                  onClick={() => onActive(c.id)}
                  aria-pressed={active === c.id}
                >
                  {c.label}
                </Badge>
              ))}
            </Group>
          </ScrollArea>
        </Container>
      </Box>
    </Box>
  );
}
