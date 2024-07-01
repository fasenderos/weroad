###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

# Set working directory inside the image
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY --chown=node:node ./apps/backend/package.json ./apps/backend/package.json

# Install pnpm globally
RUN npm install -g pnpm

# Install app dependencies using the `pnpm install --frozen-lockfile`
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY --chown=node:node ./apps/backend ./apps/backend/

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build

WORKDIR /app

COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY --chown=node:node ./apps/backend/package.json ./apps/backend/package.json

# # # In order to build the backend we need access to the Nest CLI which is a dev dependency.
# # # In the previous development stage we ran `pnpm install --frozen-lockfile` which installed all dependencies,
# # # so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/apps/backend/node_modules ./apps/backend/node_modules

COPY --chown=node:node ./apps/backend ./apps/backend/

# Install pnpm globally
RUN npm install -g pnpm

# Run the build command which creates the production bundle
RUN pnpm --filter=@weroad/backend build

# This ensures that the node_modules directory is as optimized as possible
RUN pnpm install --frozen-lockfile --prod && pnpm prune --prod

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --chown=node:node --from=build /app/apps/backend/dist ./apps/backend/dist

# Expose the port the app runs on
EXPOSE 3001

# Start the server using the production build
CMD [ "node", "apps/backend/dist/src/main.js" ]