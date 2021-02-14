FROM node:10
RUN mkdir -p /app/config
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./src .
EXPOSE 8080
ENTRYPOINT [ "node", "app.js" ]
