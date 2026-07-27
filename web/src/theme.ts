import { createTheme, type MantineColorsTuple } from '@mantine/core';

/** Rojo corporativo tomado del logotipo de Meridional Plastic. */
const brandRed: MantineColorsTuple = [
  '#ffe9e9',
  '#ffd1d1',
  '#f9a2a2',
  '#f47070',
  '#ef4646',
  '#ed2c2c',
  '#ed1d1e',
  '#d31012',
  '#bd070d',
  '#a50007',
];

/** Azul corporativo tomado del logotipo de Meridional Plastic. */
const brandBlue: MantineColorsTuple = [
  '#e6f3ff',
  '#cee2ff',
  '#9cc2ff',
  '#66a1ff',
  '#3b86fe',
  '#2075fe',
  '#0d6dff',
  '#005ce4',
  '#0051cd',
  '#0045b6',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 5 },
  colors: { brand: brandRed, ocean: brandBlue },
  defaultRadius: 'md',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontWeight: '800',
    sizes: {
      h1: { fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: '1.1' },
      h2: { fontSize: 'clamp(1.5rem, 3.2vw, 2.125rem)', lineHeight: '1.15' },
      h3: { fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)', lineHeight: '1.25' },
    },
  },
  components: {
    Button: { defaultProps: { radius: 'xl' } },
    Badge: { defaultProps: { radius: 'sm' } },
  },
});
