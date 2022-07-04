FROM nginx:alpine AS base
RUN rm -rf /usr/share/nginx/html/*
COPY ./start.sh start.sh
COPY ./nginx/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

# If you update node version, please also update the node version in the .nvmrc file.
FROM node:16.15 AS builder
COPY ./website/package.json /app/website/package.json
COPY ./website/package-lock.json /app/website/package-lock.json
WORKDIR /app/website
RUN npm install
COPY ./website /app/website
RUN npm run build

FROM sonarsource/sonar-scanner-cli:4 AS sonarqube_scan
WORKDIR /app
ARG SONAR_TOKEN
COPY --from=builder /app/website/build /app

RUN if [ -z "$SONAR_TOKEN" ] \ 
  ; then \
    echo Sonar scan skipped \ 
  ; else \ 
    sonar-scanner \
        -Dsonar.host.url="https://sonarcloud.io" \
        -Dsonar.login="$SONAR_TOKEN" \
        -Dsonar.projectKey="configcat_docs" \
        -Dsonar.projectName="docs" \
        -Dsonar.organization="configcat" \
  ; fi

FROM base as final
COPY --from=builder /app/website/build /usr/share/nginx/temphtml
CMD ["sh", "start.sh"]
