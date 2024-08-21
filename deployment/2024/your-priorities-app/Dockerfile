FROM node:20

LABEL maintainer="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.3'

# Create app directory and give permissions to node user
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./server_api/package.json ./

USER node

RUN npm install

COPY --chown=node:node ./server_api .
COPY --chown=node:node ./webApps .
COPY --chown=node:node ./webApps /home/node/webApps

ENV PORT=9080

EXPOSE 9080

CMD [ "node", "server_api/ts-out/server.js" ]
