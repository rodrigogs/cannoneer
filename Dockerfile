FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm install --global pm2

COPY . .

EXPOSE 3000

CMD [ "pm2-runtime", "ecosystem.config.js" ]
