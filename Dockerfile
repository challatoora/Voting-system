# Stage 1: Dependencies

FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install


# Stage 2: Production Image


FROM node:18-alpine AS production

WORKDIR /app


# Copy installed dependencies
COPY --from=dependencies /app/node_modules ./node_modules


# Copy application files
COPY server.js .
COPY Frontend ./Frontend

# Security: create non-root user
RUN addgroup -S nodegroup && \
    adduser -S nodeuser -G nodegroup

RUN chown -R nodeuser:nodegroup /app

USER nodeuser

EXPOSE 3000


CMD ["node", "server.js"]