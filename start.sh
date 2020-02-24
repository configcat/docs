#!/bin/sh
envsubst '$$SERVER_NAME $$REDIRECT_TO' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'