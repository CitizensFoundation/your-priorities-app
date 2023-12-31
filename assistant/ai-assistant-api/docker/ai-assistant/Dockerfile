FROM node:18

LABEL maintainer="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.0'

# Create app directory and give permissions to node user
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy your package.json file to the WORKDIR
COPY --chown=node:node ./api/package.json ./

USER node

# Install npm dependencies
RUN npm install

# Copy the rest of your application code from api directory
COPY --chown=node:node ./api .

# Copy your apps directory to the WORKDIR
COPY --chown=node:node ./apps ./apps

ENV PORT=9080

EXPOSE 9080

CMD [ "node", "ts-out/api/server.js" ]
