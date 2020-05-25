FROM node:10

RUN mkdir /app
WORKDIR /app

COPY package.json ./
RUN npm install

COPY src/ .

EXPOSE 8080
CMD [ "sh", "-c", "node", "server.js" ]
