FROM node:22-alpine3.19 as base

WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN npm install -g pnpm
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml /temp/dev/
RUN cd /temp/dev && pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
RUN cd /temp/prod && pnpm install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist/ ./dist/
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER node
ENTRYPOINT [ "pnpm", "run", "start" ]
