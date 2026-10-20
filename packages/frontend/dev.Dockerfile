FROM node:18-alpine

WORKDIR /app

# Instalar dependencias segun el lockfile disponible
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Warning: Lockfile not found, usando npm install" && npm install; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY components.json .
COPY styles ./styles
COPY lib ./lib
COPY types ./types

ENV NEXT_TELEMETRY_DISABLED=1

# Nota: No exponemos puertos aqui, docker-compose se encarga (puerto 3000).
CMD ["npx", "next", "dev", "-p", "3000"]