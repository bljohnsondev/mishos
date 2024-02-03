FROM node:18 as build

WORKDIR /app

COPY ./package.json /app/package.json

RUN yarn install
COPY . .
COPY ./.env.prod ./.env
RUN yarn build

FROM nginx
COPY ./nginx/default.conf.template /etc/nginx/templates/
COPY --from=build /app/dist /usr/share/nginx/html
