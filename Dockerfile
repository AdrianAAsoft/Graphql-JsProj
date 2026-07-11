FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server ./server

EXPOSE 4000

CMD [ "node", "server/server.js" ]