import {
  Anchor,
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { COMPANY, asset, categories } from '../data/catalog';
import type { CategoryId } from '../data/catalog';
import classes from './Footer.module.css';

interface Props {
  onActive: (v: CategoryId | 'all') => void;
}

export function Footer({ onActive }: Props) {
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
              <Image
                src={asset('img/ce.jpg')}
                alt="Marcado CE"
                w={180}
                radius="sm"
                className={classes.ce}
              />
              <Text size="xs" c="dimmed">
                Todos los productos disponen de características técnicas y certificados CE.
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Title order={4} fz="md" mb="sm">
              Catálogo
            </Title>
            <Stack gap={6}>
              {categories.map((c) => (
                <Anchor
                  key={c.id}
                  size="sm"
                  c="dimmed"
                  onClick={() => {
                    onActive(c.id);
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Group justify="space-between" gap="xs">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} {COMPANY.name}
          </Text>
          <Text size="xs" c="dimmed">
            Catálogo de productos {COMPANY.catalogYear}
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
