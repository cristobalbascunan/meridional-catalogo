import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * Base absoluta. Antes se compilaba con rutas relativas (`./`) para que el sitio
 * funcionase igual colgando de la raíz de un dominio que de un subdirectorio,
 * pero cada ficha vive ahora en `/producto/<id>/`: desde ahí un `./assets/…`
 * apunta a `/producto/<id>/assets/…`, que no existe. Con una base absoluta las
 * rutas no dependen de la profundidad de la página.
 *
 * Para publicar en un subdirectorio —GitHub Pages sirve el sitio en
 * `/nombre-del-repo/`— basta con pasar esa ruta en BASE_PATH, con barra final.
 */
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
});
