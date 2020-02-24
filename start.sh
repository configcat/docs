#!/bin/sh
envsubst '$$SERVER_NAME $$REDIRECT_TO' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'