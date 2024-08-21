#!/bin/bash

# Run the Cloudflare IP update script initially
/usr/local/bin/update-cloudflare-ips.sh

# Start cron
cron

# Start Nginx
nginx -g 'daemon off;'