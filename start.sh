#!/bin/sh
envsubst '$$REDIRECT_TO' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
rm -rf /usr/share/nginx/html/*
mv /usr/share/nginx/temphtml/* /usr/share/nginx/html
rm -rf /usr/share/nginx/html/update
nginx -g 'daemon off;'