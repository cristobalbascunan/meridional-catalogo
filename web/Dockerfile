# --- 1. Compilación -----------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Se copian primero los manifiestos para que la capa de dependencias se
# reaproveche mientras no cambien.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite sólo expone al navegador las variables presentes en el entorno durante
# `npm run build` (las inserta en el HTML/JS ya compilado; no se pueden cambiar
# después arrancando el contenedor con otro valor). Los valores por defecto son
# los correctos para el dominio de producción; para desplegar en un subdirectorio
# o cambiar el endpoint del formulario basta con pasar el `--build-arg`
# correspondiente al construir la imagen, sin tocar el código.
ARG BASE_PATH=/
ARG VITE_SITE_URL=https://www.meridionalplastic.com
ARG VITE_FORM_ENDPOINT=
ENV BASE_PATH=$BASE_PATH
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_FORM_ENDPOINT=$VITE_FORM_ENDPOINT

RUN npm run build

# --- 2. Servidor --------------------------------------------------------------
FROM nginx:alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1 y no localhost: dentro del contenedor localhost resuelve primero a ::1
# y nginx sólo escucha en IPv4, así que la comprobación fallaría siempre.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
