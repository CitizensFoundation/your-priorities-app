FROM node:14
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 8.14a'

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json .
COPY server_api .

RUN apt-get install imagemagick

USER node

RUN yarn config set ignore-engines
RUN yarn install

COPY --chown=node:node . .

RUN rm -r client_app/build/bundled/images/manifest_yp

COPY deployment/docker/manifest_images_yp/ ./client_app/build/bundled/images/manifest_yp/

RUN ls -l client_app/build/bundled/images/manifest_yp

COPY deployment/docker/manifest_images_yp/ ./client_app/images/manifest_yp/

RUN ls -l client_app/images/manifest_yp

COPY ./server_api/config/config.json.dev ./server_api/config/config.json

RUN tar -xzf ./development/docker/your-priorities-app/temp_bower_components.tar.gz -C ./client_app/

ENV PORT=4242

EXPOSE 4242

CMD [ "node --optimize_for_size --max_old_space_size=460 ", "server_api/api_app.js" ]
