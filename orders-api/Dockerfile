# Stage 1: Construcción (builder)
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de manifiesto del proyecto (package.json, etc.)
COPY package.json package-lock.json ./

# Instala las dependencias de producción
RUN npm install

# Copia los archivos de la aplicación
COPY src ./src

# Stage 2: Producción (runner)
FROM node:20-alpine

# Crea un usuario no-root para seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias y archivos desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY .env ./.env

# Expone el puerto que la aplicación escuchará
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "src/app.js"]