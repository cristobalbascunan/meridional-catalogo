import { Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { COMPANY } from '../data/catalog';
import classes from './ContactCta.module.css';

/**
 * Cierre del catálogo: después de recorrer los productos hay que tener el
 * presupuesto a un clic, sin bajar hasta la letra pequeña del pie.
 */
export function ContactCta() {
  return (
    <Box component="section" id="contacto" className={classes.band}>
      <Container size="xl" py={48}>
        <Group justify="space-between" align="center" gap="xl" wrap="wrap">
          <Stack gap={6} maw={560}>
            <Title order={2} fz="1.75rem" c="white">
              ¿No encuentra lo que busca?
            </Title>
            <Text className={classes.lead}>
              Trabajamos también formatos y medidas a medida. Cuéntenos qué necesita
              embalar y le preparamos un presupuesto sin compromiso.
            </Text>
            <Group gap="xs" mt={4} className={classes.address}>
              <IconMapPin size={16} />
              <Text size="sm">
                {COMPANY.address} · {COMPANY.city}
              </Text>
            </Group>
          </Stack>

          <Group gap="sm">
            <Button
              size="md"
              radius="xl"
              variant="white"
              color="dark"
              component="a"
              href={`mailto:${COMPANY.email}`}
              leftSection={<IconMail size={18} />}
            >
              {COMPANY.email}
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              className={classes.ghost}
              component="a"
              href={`tel:+${COMPANY.phoneRaw}`}
              leftSection={<IconPhone size={18} />}
            >
              {COMPANY.phone}
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
