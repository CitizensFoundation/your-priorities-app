FROM node:22
LABEL maintainer="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 9.1'

RUN mkdir -p /home/node/app/server_api && chown -R node:node /home/node/app

WORKDIR /home/node/app/server_api

COPY --chown=node:node ./server_api/package.json ./server_api/package-lock.json ./

USER node

RUN npm install

COPY --chown=node:node ./server_api .
COPY --chown=node:node ./webApps /home/node/app/webApps

RUN npm run build

WORKDIR /home/node/app

CMD [ "node", "--optimize_for_size", "--max_old_space_size=960", "server_api/dist/services/workers/main.cjs" ]