FROM nginx:alpine AS base
RUN rm -rf /usr/share/nginx/html/*
COPY ./start.sh start.sh
COPY ./nginx/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

FROM node:13.8 AS builder
COPY ./website/package.json /app/website/package.json
WORKDIR /app/website
RUN npm install
COPY ./website /app/website
RUN npm run build
FROM sonarsource/sonar-scanner-cli AS sonarqube_scan
WORKDIR /app
ARG SONAR_TOKEN
COPY --from=builder /app/website/build /app
RUN sonar-scanner \
    -Dsonar.host.url="https://sonarcloud.io" \
    -Dsonar.login="$SONAR_TOKEN" \
    -Dsonar.projectKey="configcat_docs" \
    -Dsonar.projectName="docs" \
    -Dsonar.organization="configcat"

FROM base as final
COPY --from=builder /app/website/build /usr/share/nginx/temphtml
CMD ["sh", "start.sh"]
