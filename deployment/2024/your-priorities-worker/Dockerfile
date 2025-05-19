FROM node:20
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 9.0'

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./server_api/package.json ./
COPY --chown=node:node ./server_api/package-lock.json ./
COPY --chown=node:node ./server_api .

USER node

RUN npm ci

COPY --chown=node:node . .

CMD [ "node --optimize_for_size --max_old_space_size=960 ", "node_modules/@yrpri/api/services/workers/main.cjs" ]
