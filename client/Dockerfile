FROM node:20.12.2-alpine AS build-stage

USER root
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]