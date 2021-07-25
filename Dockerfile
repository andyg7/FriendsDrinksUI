FROM node:10
RUN mkdir -p /app/config
WORKDIR /app
COPY ./server/package.json ./
RUN npm install
COPY ./server/src .
EXPOSE 8080
ENTRYPOINT [ "node", "app.js" ]
CMD ["config/config.properties"]