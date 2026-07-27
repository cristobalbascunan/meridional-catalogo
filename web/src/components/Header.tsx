import { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  Indicator,
  ScrollArea,
  TextInput,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoon, IconSearch, IconShoppingBag, IconSun } from '@tabler/icons-react';
import { asset, categories, type CategoryId } from '../data/catalog';
import classes from './Header.module.css';

interface Props {
  query: string;
  onQuery: (v: string) => void;
  active: CategoryId | 'all';
  onActive: (v: CategoryId | 'all') => void;
  quoteCount: number;
  onOpenQuote: () => void;
}

export function Header({ query, onQuery, active, onActive, quoteCount, onOpenQuote }: Props) {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [searchOpen, setSearchOpen] = useState(false);

  // Con una búsqueda activa el campo permanece visible aunque no se haya desplegado
  // a mano, para que se vea qué se está filtrando.
  const showSearchRow = searchOpen || query !== '';

  // El campo se monta una sola vez (se muestra y oculta por CSS), así que hay que
  // enfocarlo a mano al desplegarlo: `autoFocus` solo actuaría en el montaje.
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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

  return (
    <Box component="header" className={classes.header}>
      <Container size="xl" className={classes.top}>
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <a href="#inicio" className={classes.brand} aria-label="Meridional Plastic — inicio">
            <img
              src={asset('img/logo.png')}
              alt="Meridional Plastic"
              className={classes.logo}
            />
          </a>

          <TextInput
            className={classes.search}
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

          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              className={classes.searchToggle}
              variant={query ? 'filled' : 'default'}
              size="lg"
              radius="xl"
              aria-label="Buscar en el catálogo"
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

            <Indicator
              label={quoteCount}
              size={18}
              disabled={quoteCount === 0}
              color="ocean"
              offset={4}
            >
              <Button
                className={classes.quoteFull}
                leftSection={<IconShoppingBag size={18} />}
                onClick={onOpenQuote}
              >
                Mi solicitud
              </Button>
              <ActionIcon
                className={classes.quoteIcon}
                size="lg"
                radius="xl"
                aria-label="Mi solicitud"
                onClick={onOpenQuote}
              >
                <IconShoppingBag size={18} />
              </ActionIcon>
            </Indicator>
          </Group>
        </Group>

        <Box className={classes.searchRow} data-open={showSearchRow || undefined}>
          <TextInput
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
            ref={searchRef}
            aria-label="Buscar en el catálogo"
          />
        </Box>
      </Container>

      <Box className={classes.navWrap}>
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
