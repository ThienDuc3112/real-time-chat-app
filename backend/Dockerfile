FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY /src ./src
RUN npm run build
COPY .env .
RUN npm run migrate

EXPOSE 6969

CMD [ "node", "."]