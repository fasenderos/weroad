###################
# STAGE 1: BUILD
###################

FROM node:20-alpine AS build

# Set working directory inside the image
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY --chown=node:node ./apps/frontend/package.json ./apps/frontend/package.json

# Install pnpm globally
RUN npm install -g pnpm

# Install app dependencies using the `pnpm install --frozen-lockfile`
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY --chown=node:node ./apps/frontend ./apps/frontend/

# Custom server URL
ARG SERVER_URL
ENV SERVER_URL=$SERVER_URL

# Build the Nuxt.js application
RUN pnpm --filter=@weroad/frontend build

# Use the node user from the image (instead of the root user)
USER node

###################
# STAGE 2: PRODUCTION
###################

FROM node:20-alpine AS production

# Set working directory inside the image
WORKDIR /app

# Copy compiled static files from the build stage (Stage 1)
COPY --chown=node:node --from=build /app/apps/frontend/.output/  ./

# Port and host for the nitro
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Use the node user from the image (instead of the root user)
USER node

# Default command to start Nuxt
CMD [ "node", "/app/server/index.mjs" ]