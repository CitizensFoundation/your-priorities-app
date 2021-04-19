FROM nginx

RUN mkdir -p /etc/ssl/certs/
RUN openssl dhparam -out /etc/ssl/certs/dhparam-2048.pem 2048

ARG DOMAIN_NAME
ENV DOMAIN_NAME $DOMAIN_NAME
RUN mkdir -p /etc/letsencrypt/live/$DOMAIN_NAME/
COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/fullchain.pem /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem
COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/privkey.pem /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem
RUN ls -l /etc/letsencrypt/live/$DOMAIN_NAME/
