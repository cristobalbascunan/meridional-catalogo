import {
  Badge,
  Box,
  Button,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Image,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCheck,
  IconCircleCheck,
  IconLink,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { COMPANY, categoryById, type Product } from '../data/catalog';
import classes from './ProductDrawer.module.css';

interface Props {
  product: Product | null;
  opened: boolean;
  onClose: () => void;
}

export function ProductDrawer({ product, opened, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const category = product ? categoryById(product.category) : null;

  const consulta = product
    ? `Hola, me gustaría recibir información y presupuesto sobre "${product.name}" del catálogo ${COMPANY.catalogYear}.`
    : '';

  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    product ? `Consulta sobre ${product.name}` : 'Consulta',
  )}&body=${encodeURIComponent(consulta)}`;

  // Enlace directo a esta ficha, para poder pasársela a un cliente o a un compañero.
  const permalink =
    product && typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#p/${product.id}`
      : '';

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? '92%' : 520}
      padding={0}
      withCloseButton
      title={
        <Text fw={700} size="sm" tt="uppercase" c="dimmed">
          {category?.name}
        </Text>
      }
      styles={{ header: { paddingInline: 'var(--mantine-spacing-lg)' } }}
    >
      {product && (
        <>
          <Stack gap="lg" pb="md">
            <Box className={classes.media} px="lg" py="md">
              <Image
                src={product.image}
                alt={product.name}
                fit="contain"
                h={product.imageSize === 'sm' ? 160 : 230}
              />
            </Box>

            <Stack gap="sm" px="lg">
              <div>
                <Text size="xs" fw={700} c="brand" tt="uppercase">
                  {product.family}
                </Text>
                <Title order={2} fz="1.6rem" mt={4}>
                  {product.name}
                </Title>
              </div>

              <Text c="dimmed">{product.summary}</Text>

              {product.tags.length > 0 && (
                <Group gap={6}>
                  {product.tags.map((t) => (
                    <Badge key={t} variant="light" color="brand">
                      {t}
                    </Badge>
                  ))}
                </Group>
              )}

              <Divider my="xs" />

              <Text fw={700}>Características</Text>
              <List
                spacing={8}
                icon={
                  <ThemeIcon color="brand" size={20} radius="xl">
                    <IconCircleCheck size={14} />
                  </ThemeIcon>
                }
              >
                {product.specs.map((s) => (
                  <List.Item key={s}>
                    <Text size="sm">{s}</Text>
                  </List.Item>
                ))}
              </List>

              {product.variants && product.variants.length > 0 && (
                <>
                  <Divider my="xs" />
                  <Text fw={700}>Referencias disponibles</Text>
                  <Group gap={8}>
                    {product.variants.map((v) => (
                      <Badge key={v} variant="outline" color="gray" size="lg">
                        {v}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}

              <Divider my="xs" />

              <Text size="xs" c="dimmed">
                Todos los productos disponen de características técnicas y certificados CE.
                Referencia: <Text span ff="monospace">{product.id}</Text>
              </Text>
            </Stack>
          </Stack>

          {/*
            Las acciones se quedan fijas al pie: en fichas con muchas
            características quedaban fuera de pantalla y había que bajar hasta el
            final para encontrar cómo pedir presupuesto.
          */}
          <Box className={classes.actions}>
            <Group grow wrap="nowrap" gap="xs">
              <Button
                size="md"
                component="a"
                href={mailto}
                leftSection={<IconMail size={18} />}
              >
                Pedir presupuesto
              </Button>
              <Button
                size="md"
                variant="default"
                component="a"
                href={`tel:+${COMPANY.phoneRaw}`}
                leftSection={<IconPhone size={18} />}
              >
                Llamar
              </Button>
            </Group>
            <CopyButton value={permalink} timeout={1800}>
              {({ copied, copy }) => (
                <Button
                  fullWidth
                  mt="xs"
                  size="compact-sm"
                  variant="subtle"
                  color="gray"
                  leftSection={copied ? <IconCheck size={14} /> : <IconLink size={14} />}
                  onClick={copy}
                >
                  {copied ? 'Enlace copiado' : 'Copiar enlace a esta ficha'}
                </Button>
              )}
            </CopyButton>
          </Box>
        </>
      )}
    </Drawer>
  );
}
