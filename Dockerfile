FROM node:alpine

# build essentials for redis
RUN apk add musl-dev gcc make g++ zlib-dev linux-headers

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .

CMD [ "npm", "start" ]