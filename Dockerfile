FROM node:22-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

USER node

COPY . .

RUN npm install --frozen-lockfile

RUN npm run build

EXPOSE 3000

CMD npm run start
