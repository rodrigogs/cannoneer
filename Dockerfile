FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm install --global pm2

COPY . .

CMD [ "pm2-runtime", "ecosystem.config.js" ]
