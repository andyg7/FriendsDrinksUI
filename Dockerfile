# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./react-client/package.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1
COPY ./react-client/ ./
RUN npm run build

# production environment
FROM node:10
RUN mkdir -p /app
COPY --from=build /app/build /app/public/
RUN mkdir -p /app/config
WORKDIR /app
COPY ./server/package.json ./
RUN npm install
COPY ./server/src .
EXPOSE 8080
ENTRYPOINT [ "node", "app.js" ]
CMD ["config/config.properties"]