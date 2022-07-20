FROM node:16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh \

WORKDIR /app

COPY package.json .

RUN npm install --only=prod

RUN npm update @growishpay/service-utilities

COPY . .

RUN npm build

EXPOSE 8088
EXPOSE 8089

CMD node server