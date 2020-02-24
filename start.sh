#!/bin/sh
envsubst '$$REDIRECT_TO' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
rm -rf /usr/share/nginx/html/*
mv /usr/share/nginx/update /usr/share/nginx/html
nginx -g 'daemon off;'