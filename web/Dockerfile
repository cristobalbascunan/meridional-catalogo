# --- 1. Compilación -----------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Se copian primero los manifiestos para que la capa de dependencias se
# reaproveche mientras no cambien.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
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
