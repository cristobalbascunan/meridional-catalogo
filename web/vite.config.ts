import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Por defecto se compila con rutas relativas, así funciona igual servido desde la
// raíz de un dominio que desde un subdirectorio. GitHub Pages publica el sitio en
// `/nombre-del-repo/`, y el flujo de despliegue pasa esa ruta en BASE_PATH.
const base = process.env.BASE_PATH || './';

export default defineConfig({
  plugins: [react()],
  base,
});
