import { useMemo, useState } from 'react';
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconMail,
  IconPhone,
  IconSend,
  IconTrash,
} from '@tabler/icons-react';
import { COMPANY, products } from '../data/catalog';
import { closeQuoteForm, quote, useQuote, useQuoteFormOpen } from '../hooks/useQuote';
import { WhatsAppButton } from './WhatsAppButton';
import classes from './QuoteModal.module.css';

/**
 * Formulario de solicitud de presupuesto.
 *
 * Hasta ahora todas las llamadas a la acción eran `mailto:`, que en un
 * ordenador sin cliente de correo configurado no hace absolutamente nada: se
 * pulsa «Pedir presupuesto» y no ocurre nada. Siendo el presupuesto el único
 * objetivo de la web, era la fuga más grave que tenía.
 *
 * El envío va contra el endpoint que se indique en `VITE_FORM_ENDPOINT`
 * (Formspree, Netlify Forms, Basin… cualquiera que acepte un POST). Mientras no
 * haya ninguno configurado se cae con elegancia al correo de siempre, ya
 * redactado, en vez de fingir que se ha enviado.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? '';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Values {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY: Values = { name: '', company: '', email: '', phone: '', message: '' };

/** Validación mínima: lo justo para no enviar una solicitud sin forma de responder. */
const validate = (v: Values) => {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Indíquenos su nombre';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Revise el correo electrónico';
  // El teléfono es opcional, pero si se escribe algo debe poder marcarse.
  if (v.phone.trim() !== '' && v.phone.replace(/[\s.+-]/g, '').length < 9) {
    e.phone = 'Revise el teléfono';
  }
  return e;
};

export function QuoteModal() {
  const opened = useQuoteFormOpen();
  const ids = useQuote();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  // Campo trampa: los robots lo rellenan, las personas no lo ven.
  const [trap, setTrap] = useState('');

  const selected = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined),
    [ids],
  );

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [k]: e.currentTarget.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  /** Texto plano con la solicitud, que vale igual para el correo y para el endpoint. */
  const body = () => {
    const lines = [
      `Nombre: ${values.name}`,
      values.company.trim() && `Empresa: ${values.company}`,
      `Correo: ${values.email}`,
      values.phone.trim() && `Teléfono: ${values.phone}`,
      '',
      selected.length > 0
        ? `Productos de interés:\n${selected.map((p) => `· ${p.name} (${p.id})`).join('\n')}`
        : 'Sin productos seleccionados del catálogo.',
      '',
      values.message.trim() && `Consulta:\n${values.message}`,
    ];
    return lines.filter(Boolean).join('\n');
  };

  const mailtoHref = () =>
    `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      selected.length === 1
        ? `Solicitud de presupuesto: ${selected[0].name}`
        : `Solicitud de presupuesto (${selected.length || 'consulta'})`,
    )}&body=${encodeURIComponent(body())}`;

  const close = () => {
    closeQuoteForm();
    // El resultado se limpia al cerrar, para que la próxima vez no se abra con
    // el aviso de «enviado» de la solicitud anterior.
    if (status === 'sent' || status === 'error') {
      setStatus('idle');
      setValues(EMPTY);
      setConsent(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trap !== '') return; // Robot.

    const eNext = validate(values);
    setErrors(eNext);
    setConsentError(!consent);
    if (Object.keys(eNext).length > 0 || !consent) return;

    if (!ENDPOINT) {
      // Sin endpoint configurado no se simula un envío: se abre el correo ya escrito.
      window.location.href = mailtoHref();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: values.name,
          empresa: values.company,
          email: values.email,
          telefono: values.phone,
          consulta: values.message,
          productos: selected.map((p) => p.name),
          referencias: selected.map((p) => p.id),
          resumen: body(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      quote.clear();
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      radius="lg"
      title={
        <Title order={2} fz="1.25rem">
          Solicitar presupuesto
        </Title>
      }
    >
      {status === 'sent' ? (
        <Stack align="center" gap="sm" py="lg" ta="center">
          <ThemeIcon color="teal" size={56} radius="xl" variant="light">
            <IconCircleCheck size={32} />
          </ThemeIcon>
          <Title order={3} fz="1.15rem">
            Solicitud enviada
          </Title>
          <Text c="dimmed" maw={420}>
            Gracias. Hemos recibido su consulta y le responderemos con un presupuesto lo
            antes posible. Si necesita algo urgente, puede llamarnos al{' '}
            <Anchor href={`tel:+${COMPANY.phoneRaw}`}>{COMPANY.phone}</Anchor>.
          </Text>
          <Button mt="sm" onClick={close}>
            Seguir viendo el catálogo
          </Button>
        </Stack>
      ) : (
        <form onSubmit={submit} noValidate>
          <Stack gap="md">
            {/* Lo que se va a pedir, editable hasta el último momento. */}
            <Box>
              <Group justify="space-between" align="center" mb={8}>
                <Text size="sm" fw={700}>
                  Productos de su solicitud{' '}
                  <Text span c="dimmed" fw={400}>
                    ({selected.length})
                  </Text>
                </Text>
                {selected.length > 0 && (
                  <Button
                    variant="subtle"
                    color="gray"
                    size="compact-xs"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => quote.clear()}
                  >
                    Vaciar
                  </Button>
                )}
              </Group>
              {selected.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No ha añadido ningún producto. Puede enviarnos igualmente su consulta y la
                  resolvemos, o añadir productos desde el catálogo con «Añadir a mi solicitud».
                </Text>
              ) : (
                <Group gap={6}>
                  {selected.map((p) => (
                    <Badge
                      key={p.id}
                      variant="light"
                      size="lg"
                      rightSection={
                        <Box
                          component="button"
                          type="button"
                          className={classes.remove}
                          aria-label={`Quitar ${p.name} de la solicitud`}
                          onClick={() => quote.remove(p.id)}
                        >
                          ×
                        </Box>
                      }
                    >
                      {p.name}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>

            <Group grow align="flex-start">
              <TextInput
                label="Nombre y apellidos"
                placeholder="Su nombre"
                required
                value={values.name}
                onChange={set('name')}
                error={errors.name}
                autoComplete="name"
              />
              <TextInput
                label="Empresa"
                placeholder="Nombre de su empresa"
                value={values.company}
                onChange={set('company')}
                autoComplete="organization"
              />
            </Group>

            <Group grow align="flex-start">
              <TextInput
                label="Correo electrónico"
                placeholder="nombre@empresa.com"
                required
                type="email"
                inputMode="email"
                value={values.email}
                onChange={set('email')}
                error={errors.email}
                autoComplete="email"
              />
              <TextInput
                label="Teléfono"
                placeholder="600 000 000"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={set('phone')}
                error={errors.phone}
                autoComplete="tel"
              />
            </Group>

            <Textarea
              label="¿Qué necesita embalar?"
              placeholder="Cantidades aproximadas, medidas, si necesita impresión con su logotipo…"
              description="Cuanto más concreto, más ajustado le podremos preparar el presupuesto."
              minRows={3}
              autosize
              maxRows={8}
              value={values.message}
              onChange={set('message')}
            />

            {/* Trampa para robots: fuera de la vista y fuera del recorrido del tabulador. */}
            <Box className={classes.trap} aria-hidden>
              <label htmlFor="mp-fax">No rellenar</label>
              <input
                id="mp-fax"
                name="fax"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.currentTarget.value)}
              />
            </Box>

            <Checkbox
              checked={consent}
              onChange={(e) => {
                setConsent(e.currentTarget.checked);
                setConsentError(false);
              }}
              error={consentError ? 'Necesitamos su consentimiento para poder responderle' : undefined}
              label={
                <Text size="sm">
                  Acepto que {COMPANY.name} trate mis datos para responder a esta solicitud de
                  presupuesto. No se utilizarán para ninguna otra finalidad ni se cederán a
                  terceros.
                </Text>
              }
            />

            {status === 'error' && (
              <Alert
                color="red"
                variant="light"
                icon={<IconAlertTriangle size={18} />}
                title="No hemos podido enviar la solicitud"
              >
                <Text size="sm">
                  Ha fallado el envío. Puede intentarlo de nuevo, escribirnos a{' '}
                  <Anchor href={mailtoHref()}>{COMPANY.email}</Anchor> o llamarnos al{' '}
                  <Anchor href={`tel:+${COMPANY.phoneRaw}`}>{COMPANY.phone}</Anchor>.
                </Text>
              </Alert>
            )}

            {!ENDPOINT && (
              <Text size="xs" c="dimmed">
                Al enviar se abrirá su programa de correo con la solicitud ya redactada.
              </Text>
            )}

            <Group justify="space-between" gap="sm" wrap="wrap">
              <Group gap="xs">
                <Button
                  variant="default"
                  component="a"
                  href={`tel:+${COMPANY.phoneRaw}`}
                  leftSection={<IconPhone size={16} />}
                >
                  {COMPANY.phone}
                </Button>
                <WhatsAppButton variant="default" text={body()} />
              </Group>
              <Button
                type="submit"
                size="md"
                loading={status === 'sending'}
                leftSection={ENDPOINT ? <IconSend size={18} /> : <IconMail size={18} />}
              >
                Enviar solicitud
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
