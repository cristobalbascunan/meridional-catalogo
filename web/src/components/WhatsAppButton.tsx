import { Button, type ButtonProps } from '@mantine/core';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { COMPANY } from '../data/catalog';

interface Props extends ButtonProps {
  /** Mensaje con el que se abre la conversación. */
  text?: string;
  label?: string;
}

/**
 * Enlace a WhatsApp Business.
 *
 * En el B2B industrial español es, muchas veces, el canal por el que de verdad
 * se piden los presupuestos — por delante del correo.
 *
 * No se dibuja nada mientras `COMPANY.whatsapp` esté vacío: el número de la
 * empresa es un fijo y wa.me sólo funciona con una línea móvil. En cuanto el
 * cliente facilite una, el botón aparece en la cabecera, en la ficha y en el
 * formulario sin tocar nada más.
 */
export function WhatsAppButton({ text, label = 'WhatsApp', ...props }: Props) {
  if (!COMPANY.whatsapp) return null;

  const href = `https://wa.me/${COMPANY.whatsapp}${
    text ? `?text=${encodeURIComponent(text)}` : ''
  }`;

  return (
    <Button
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      leftSection={<IconBrandWhatsapp size={18} />}
      {...props}
    >
      {label}
    </Button>
  );
}
