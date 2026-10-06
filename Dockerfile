# syntax=docker/dockerfile:1.7

# One root Dockerfile, two deployable targets:
#   server1 -> Renaissance API
#   client  -> Renaissance Vite frontend served by nginx


# =========================================================
# SERVER1 DEPENDENCY STAGE
# =========================================================
FROM node:20-bookworm-slim AS server1-dependencies

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

WORKDIR /app

# MNNIT network requires proxy access.
# Use HTTPS for Debian repositories so APT does not attempt
# direct HTTP connections to deb.debian.org:80.
RUN echo 'Acquire::http::Proxy "'${HTTP_PROXY}'";' > /etc/apt/apt.conf.d/01proxy \
    && echo 'Acquire::https::Proxy "'${HTTPS_PROXY}'";' >> /etc/apt/apt.conf.d/01proxy \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        make \
        g++ \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/apt/apt.conf.d/01proxy

COPY RENAISSANCE-ECELL-2026/server1/package.json ./
COPY RENAISSANCE-ECELL-2026/server1/package-lock.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force


# =========================================================
# SERVER1 RUNTIME
# =========================================================
FROM node:20-bookworm-slim AS server1

ENV NODE_ENV=production
ENV PORT=5001

WORKDIR /app

COPY --from=server1-dependencies --chown=node:node \
    /app/node_modules ./node_modules

COPY --chown=node:node \
    RENAISSANCE-ECELL-2026/server1/package.json ./

COPY --chown=node:node \
    RENAISSANCE-ECELL-2026/server1/package-lock.json ./

COPY --chown=node:node \
    RENAISSANCE-ECELL-2026/server1/src ./src

COPY --chown=node:node \
    RENAISSANCE-ECELL-2026/server1/scripts ./scripts

USER node

EXPOSE 5001

HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=20s \
    --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||5001)+'/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]

STOPSIGNAL SIGTERM

CMD ["node", "src/server.js"]


# =========================================================
# CLIENT BUILD STAGE
# =========================================================
FROM node:20-alpine AS client-build

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

ARG VITE_SERVER1_API_URL=http://localhost:5001/api/v1
ENV VITE_SERVER1_API_URL=${VITE_SERVER1_API_URL}

WORKDIR /app

COPY RENAISSANCE-ECELL-2026/client/package.json ./
COPY RENAISSANCE-ECELL-2026/client/package-lock.json ./

RUN npm ci

COPY RENAISSANCE-ECELL-2026/client/ ./

RUN npm run build


# =========================================================
# CLIENT RUNTIME
# =========================================================
FROM nginx:1.27-alpine AS client

COPY docker/client-nginx.conf \
    /etc/nginx/conf.d/default.conf

COPY --from=client-build \
    /app/dist \
    /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK \
    --interval=30s \
    --timeout=3s \
    --start-period=10s \
    --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]