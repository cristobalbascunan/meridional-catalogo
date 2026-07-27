import { useState } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBrandWhatsapp, IconMail, IconShoppingBag, IconTrash } from '@tabler/icons-react';
import { COMPANY, type Product } from '../data/catalog';

interface Props {
  opened: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function QuoteDrawer({ opened, items, onClose, onRemove, onClear }: Props) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');

  const lines = items.map((p) => `• ${p.name}`).join('\n');
  const body = [
    'Hola,',
    '',
    'Me gustaría recibir información y precio de los siguientes productos:',
    '',
    lines,
    '',
    note ? `Observaciones: ${note}` : '',
    '',
    name || company ? `${name}${name && company ? ' — ' : ''}${company}` : '',
  ]
    .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
    .join('\n');

  const subject = `Solicitud de información — Catálogo ${COMPANY.catalogYear}`;
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  const whatsapp = `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(body)}`;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? '92%' : 480}
      title={
        <Group gap="xs">
          <IconShoppingBag size={20} />
          <Text fw={700}>Mi solicitud</Text>
        </Group>
      }
    >
      <Stack gap="md" pb="xl">
        {items.length === 0 ? (
          <Alert color="gray" variant="light">
            Todavía no has añadido productos. Pulsa el botón <strong>+</strong> en cualquier
            producto del catálogo para incluirlo en tu solicitud de información.
          </Alert>
        ) : (
          <>
            <Stack gap="xs">
              {items.map((p) => (
                <Paper key={p.id} withBorder p="xs" radius="md">
                  <Group wrap="nowrap" gap="sm">
                    <Image
                      src={p.image}
                      alt={p.name}
                      w={52}
                      h={52}
                      fit="contain"
                      bg="white"
                      radius="sm"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={600} lineClamp={2}>
                        {p.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {p.family}
                      </Text>
                    </div>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label={`Quitar ${p.name}`}
                      onClick={() => onRemove(p.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </Text>
              <Button variant="subtle" color="gray" size="compact-sm" onClick={onClear}>
                Vaciar lista
              </Button>
            </Group>

            <Divider />

            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              label="Empresa"
              placeholder="Nombre de tu empresa"
              value={company}
              onChange={(e) => setCompany(e.currentTarget.value)}
            />
            <Textarea
              label="Observaciones"
              placeholder="Cantidades, medidas, plazos…"
              autosize
              minRows={3}
              value={note}
              onChange={(e) => setNote(e.currentTarget.value)}
            />

            <Stack gap="xs">
              <Button
                size="md"
                fullWidth
                component="a"
                href={mailto}
                leftSection={<IconMail size={18} />}
              >
                Enviar por email
              </Button>
              <Button
                size="md"
                fullWidth
                variant="default"
                component="a"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                leftSection={<IconBrandWhatsapp size={18} />}
              >
                Enviar por WhatsApp
              </Button>
            </Stack>

            <Text size="xs" c="dimmed" ta="center">
              Se abrirá tu cliente de correo o WhatsApp con el mensaje ya preparado.
            </Text>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
