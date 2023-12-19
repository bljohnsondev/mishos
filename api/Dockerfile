FROM node:18

WORKDIR /app

COPY ./package.json /app/package.json
RUN yarn install

COPY . .

RUN yarn build

CMD [ "node", "dist/main.js" ]

