FROM node:18-alpine

WORKDIR /app

# Instalar dependencias segun el lockfile disponible
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Warning: Lockfile not found, usando npm install" && npm install; \
  fi

# Copiar prisma y generar el cliente ANTES de arrancar (requerido por Nest)
COPY prisma ./prisma
RUN npx prisma generate || true

# El codigo fuente se copia en la imagen (sin volumenes: los cambios de
# codigo se aplican reconstruyendo con --build)
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

# Nota: No exponemos puertos aqui, docker-compose se encarga.
EXPOSE 4020

CMD ["npm", "run", "dev"]