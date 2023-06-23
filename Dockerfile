FROM node:17-alpine3.15

WORKDIR /usr/app
COPY package.json .
RUN npm install
RUN npm install -g nodemon
COPY . .