#!/bin/bash

CLOUDFLARE_FILE="/etc/nginx/cloudflare_ips.conf"
LOG_FILE="/var/log/cloudflare_ip_updates.log"

log() {
    echo "$(date): $1" >> "$LOG_FILE"
}

log "Starting Cloudflare IP range update"

IPv4_RANGES=$(curl -s https://www.cloudflare.com/ips-v4)
IPv6_RANGES=$(curl -s https://www.cloudflare.com/ips-v6)

echo "# Cloudflare IP Ranges" > $CLOUDFLARE_FILE.new

for range in $IPv4_RANGES $IPv6_RANGES; do
    echo "set_real_ip_from $range;" >> $CLOUDFLARE_FILE.new
done

echo "real_ip_header CF-Connecting-IP;" >> $CLOUDFLARE_FILE.new

if cmp -s "$CLOUDFLARE_FILE" "$CLOUDFLARE_FILE.new"; then
    log "No changes to Cloudflare IP ranges"
    rm "$CLOUDFLARE_FILE.new"
else
    mv "$CLOUDFLARE_FILE.new" "$CLOUDFLARE_FILE"
    log "Cloudflare IP ranges updated"
    nginx -s reload
    log "Nginx reloaded successfully"
fi

log "Cloudflare IP range update completed"