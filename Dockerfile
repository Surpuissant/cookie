# Stage 1: Build & Test
# Using a base image with Node.js 20
FROM node:20-slim AS builder

# Install build essentials for better-sqlite3 (native modules)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install ALL dependencies (including devDependencies for testing)
RUN npm ci

# Copy the rest of the application code
COPY . .

# RUN TESTS: The build will fail here if tests do not pass
# This fulfills the user requirement: "fait en sorte qu'il fasse passer les tests avant de se lancer"
RUN npm test

# Stage 2: Production Runtime
# Using the same base image to keep it consistent and small
FROM node:20-slim AS runtime

WORKDIR /app

# Copy only the necessary files for production
# We copy node_modules from the builder stage where it was already compiled and tested
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views
COPY --from=builder /app/package.json ./package.json

# Create the data directory for the SQLite database and set permissions
RUN mkdir -p data && chown node:node data

# Use the non-root 'node' user for better security
USER node

# Set environment to production and expose the port
ENV NODE_ENV=production
ENV SESSION_SECRET=change-me-in-runtime
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
