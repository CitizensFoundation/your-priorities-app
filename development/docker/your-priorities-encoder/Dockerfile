FROM node:14
MAINTAINER Robert Vidar Bjarnason <robert@citizens.is>

RUN echo 'version 1.0'

RUN git clone https://github.com/CitizensFoundation/your-priorities-encoder.git

WORKDIR "your-priorities-encoder"

RUN yarn config set ignore-engines
RUN yarn install

RUN cp config/config.json.dist config/config.json

CMD [ "node", "out-tsc/worker.js" ]
