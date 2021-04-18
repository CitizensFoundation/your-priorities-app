FROM node:14
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 8.11'

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json .
COPY server_api .

USER node

RUN yarn config set ignore-engines
RUN yarn install

COPY --chown=node:node . .

ENV PORT=8080

EXPOSE 8080

CMD [ "node --optimize_for_size --max_old_space_size=460 ", "server_api/api_app.js" ]
