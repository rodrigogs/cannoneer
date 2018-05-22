FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install --global pm2

COPY . .

CMD [ "pm2-runtime", "ecosystem.config.js" ]
