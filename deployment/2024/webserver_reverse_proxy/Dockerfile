FROM nginx
LABEL MAINTAINER="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.3'

ENV HOME /root

# Install dependencies including PCRE and cron
RUN apt-get update && apt-get install -y \
    libmaxminddb-dev \
    wget \
    git \
    build-essential \
    libpcre3 \
    libpcre3-dev \
    zlib1g-dev \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Download GeoIP2 module
RUN git clone https://github.com/leev/ngx_http_geoip2_module.git

# Get Nginx source (matching the version of the base image)
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar zxvf nginx-${NGINX_VERSION}.tar.gz

# Compile Nginx with GeoIP2 module
RUN cd nginx-${NGINX_VERSION} \
    && ./configure --with-compat \
                   --add-dynamic-module=../ngx_http_geoip2_module \
                   --with-pcre \
    && make modules

# Copy the compiled module to Nginx modules directory
RUN cp nginx-${NGINX_VERSION}/objs/ngx_http_geoip2_module.so /usr/lib/nginx/modules/

# Clean up
RUN rm -rf nginx-${NGINX_VERSION} nginx-${NGINX_VERSION}.tar.gz ngx_http_geoip2_module

# Add Cloudflare IP update script
COPY update-cloudflare-ips.sh /usr/local/bin/update-cloudflare-ips.sh
RUN chmod +x /usr/local/bin/update-cloudflare-ips.sh

# Add cron job for updating Cloudflare IPs
RUN echo "0 2 * * 0 /usr/local/bin/update-cloudflare-ips.sh" | crontab -

# Download GeoIP database
RUN mkdir -p /etc/nginx/geoip && \
    wget -O /etc/nginx/geoip/GeoLite2-Country.mmdb https://github.com/P3TERX/GeoLite.mmdb/raw/download/GeoLite2-Country.mmdb

ADD nginx.conf /etc/nginx/nginx.conf

COPY ./self_signed/fullchain.pem /root/bundle.pem
COPY ./self_signed/privkey.pem /root/private.pem

# Add startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 443

CMD ["/start.sh"]