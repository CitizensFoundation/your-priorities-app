FROM node:22

LABEL maintainer="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.5'

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

# copy server package files and vendored passport-sso
COPY --chown=node:node ./server_api/package.json ./server_api/package-lock.json ./server_api/
COPY --chown=node:node ./server_api/src/passport-sso ./server_api/src/passport-sso

# copy webapps client package files
COPY --chown=node:node ./webApps/client/package.json ./webApps/client/package-lock.json ./webApps/client/

USER node

# install server dependencies
WORKDIR /home/node/app/server_api
RUN npm install

# install client dependencies
WORKDIR /home/node/app/webApps/client
RUN npm install

WORKDIR /home/node/app
COPY --chown=node:node ./server_api ./server_api
COPY --chown=node:node ./webApps ./webApps

# build client
WORKDIR /home/node/app/webApps/client
RUN npm run build

# build server
WORKDIR /home/node/app/server_api
RUN npm run build

USER root
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
USER node

WORKDIR /home/node/app

# copy entrypoint
COPY --chown=node:node deployment/2024/your-priorities-app/entrypoint.sh /home/node/app/entrypoint.sh
RUN chmod +x /home/node/app/entrypoint.sh

ENV PORT=9080
EXPOSE 9080

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
CMD [ "node", "server_api/dist/server.js" ]