FROM nginx:alpine AS base
RUN rm -rf /usr/share/nginx/html/*
COPY ./start.sh start.sh

FROM node:latest AS builder
COPY ./website /app/website
WORKDIR /app/website
RUN npm install
COPY ./docs /app/docs
COPY ./website /app/static
RUN npm run build

FROM base as final
COPY --from=builder /app/website/build/configcat /usr/share/nginx/html
CMD ["sh", "start.sh"]