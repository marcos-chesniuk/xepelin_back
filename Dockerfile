FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN touch foo.ts

USER node

RUN npm install

COPY --chown=node:node ./dist/ .

EXPOSE 3000

CMD [ "node", "app.js" ]
