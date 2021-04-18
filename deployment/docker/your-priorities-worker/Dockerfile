FROM node:14
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 8.11'

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY ../../package*.json ./
COPY ../../server_api ./

USER node

ENV PORT=5000

EXPOSE 5000

RUN npm install

COPY --chown=node:node . .

CMD [ "node --optimize_for_size --max_old_space_size=960 ", "server_api/active-citizen/workers/main.js" ]
