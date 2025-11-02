# Multi-stage Dockerfile
# Stage 1: Build React client
FROM node:18 AS builder
WORKDIR /app

# Install client deps and build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Stage 2: Install server, copy server + client build, create DB
FROM node:18-bullseye-slim
WORKDIR /app

# Install build tools required by some native modules (sqlite3)
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

# Install server dependencies (production only)
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server source
COPY server/ ./server/

# Copy built client into server/public so the server can serve static files
COPY --from=builder /app/client/build ./server/public

# Create and seed the SQLite DB at build time so image contains the data
RUN node server/setupDatabase.js

EXPOSE 5000
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/server.js"]
