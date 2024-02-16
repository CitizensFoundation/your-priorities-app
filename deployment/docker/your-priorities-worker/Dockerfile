FROM node:14
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 8.12'

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json .
COPY api .

USER node

RUN yarn config set ignore-engines
RUN yarn install

COPY --chown=node:node . .

CMD [ "node --optimize_for_size --max_old_space_size=960 ", "api/active-citizen/workers/main.js" ]
