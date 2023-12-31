FROM nginx
LABEL MAINTAINER="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.2'

ENV HOME /root
#CMD ["/sbin/my_init"]

ADD nginx.conf /etc/nginx/nginx.conf

ADD self_signed/bundle.pem /root/bundle.pem
ADD self_signed/private.pem /root/private.pem

EXPOSE 443