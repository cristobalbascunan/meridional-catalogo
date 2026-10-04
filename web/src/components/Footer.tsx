import {
  Anchor,
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconBrandGoogleMaps, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { COMPANY, asset, categories } from '../data/catalog';
import { categoryPath, linkTo } from '../hooks/useRoute';
import { CeMark } from './CeMark';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <Box component="footer" className={classes.footer}>
      <Container size="xl" py="xl">
        <Grid gap="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 5 }}>
            <Stack gap="md">
              <img
                src={asset('img/logo.png')}
                alt="Meridional Plastic"
                className={classes.logo}
              />
              <Text size="sm" c="dimmed" maw={340}>
                {COMPANY.claim}. Distribución de material de envase y embalaje para industria y
                comercio.
              </Text>
              {/* El sello oficial, igual que en la portada, en vez de la foto
                  con las letras encima: se reconoce antes y no pesa nada. */}
              <Group gap="sm" wrap="nowrap" className={classes.ce}>
                <CeMark height={30} />
                <Text size="xs" c="dimmed" maw={260}>
                  Todos los productos disponen de marcado CE y ficha técnica.
                </Text>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Title order={4} fz="md" mb="sm">
              Catálogo
            </Title>
            {/* Enlaces de verdad a cada familia: antes sólo cambiaban el filtro
                de la portada, así que el pie no aportaba ni una dirección nueva
                que un buscador pudiera seguir. */}
            <Stack gap={6}>
              {categories.map((c) => (
                <Anchor
                  key={c.id}
                  size="sm"
                  c="dimmed"
                  href={categoryPath(c.id)}
                  onClick={linkTo(categoryPath(c.id))}
                  className={classes.link}
                >
                  {c.name}
                </Anchor>
              ))}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={4} fz="md" mb="sm">
              Contacto
            </Title>
            <Stack gap="sm">
              <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="brand" size="md" radius="xl">
                  <IconMapPin size={16} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  {COMPANY.address}
                  <br />
                  {COMPANY.city}
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="brand" size="md" radius="xl">
                  <IconMail size={16} />
                </ThemeIcon>
                <Anchor href={`mailto:${COMPANY.email}`} size="sm">
                  {COMPANY.email}
                </Anchor>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="brand" size="md" radius="xl">
                  <IconPhone size={16} />
                </ThemeIcon>
                <Anchor href={`tel:+${COMPANY.phoneRaw}`} size="sm">
                  {COMPANY.phone}
                </Anchor>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="brand" size="md" radius="xl">
                  <IconBrandGoogleMaps size={16} />
                </ThemeIcon>
                <Anchor href={COMPANY.googleMaps} target="_blank" rel="noopener" size="sm">
                  Encuéntrenos en Google
                </Anchor>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Group justify="space-between" gap="xs">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} {COMPANY.name}
          </Text>
          <Text size="xs" c="dimmed">
            Catálogo general de productos
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
