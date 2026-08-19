import {
  Badge,
  Box,
  Button,
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
import { IconBrandWhatsapp, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { COMPANY, categoryById, type Product } from '../data/catalog';

interface Props {
  product: Product | null;
  opened: boolean;
  onClose: () => void;
}

export function ProductDrawer({ product, opened, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const category = product ? categoryById(product.category) : null;

  const consulta = product
    ? `Hola, me gustaría recibir información sobre "${product.name}" del catálogo ${COMPANY.catalogYear}.`
    : '';

  const whatsapp = `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(consulta)}`;
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    product ? `Consulta sobre ${product.name}` : 'Consulta',
  )}&body=${encodeURIComponent(consulta)}`;

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
        <Stack gap="lg" pb="xl">
          <Box bg="white" px="lg" py="md">
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
                  <Badge key={t} variant="light" color="ocean">
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

            <Group grow wrap="nowrap">
              <Button
                size="md"
                component="a"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                leftSection={<IconBrandWhatsapp size={18} />}
              >
                WhatsApp
              </Button>
              <Button
                size="md"
                variant="default"
                component="a"
                href={mailto}
                leftSection={<IconMail size={18} />}
              >
                Email
              </Button>
            </Group>

            <Text size="xs" c="dimmed" ta="center">
              Todos los productos disponen de características técnicas y certificados CE.
            </Text>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
}
