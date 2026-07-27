# Meridional Plastic · Catálogo web

Web del catálogo de productos para envase y embalaje de **Meridional Plastic, S.L.**,
construida a partir de los PDF del catálogo que hay en la raíz del repositorio.

- El sitio está en [`web/`](web/) — ahí está la [documentación completa](web/README.md):
  cómo arrancarlo, cómo añadir productos y cómo desplegarlo.
- `CATÁLOGO 2024.pdf` y `Meridional Plastic_Pliegos.pdf` son el material de origen del
  que salen los textos y las fotografías de producto.

## Verlo rápido

```bash
# Con Docker (no hace falta tener Node instalado)
docker compose up -d --build      # http://localhost:8080

# O con Node
cd web && npm install && npm run dev
```

## Publicación

Cada push a `main` compila el sitio y lo publica en GitHub Pages mediante el flujo de
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
