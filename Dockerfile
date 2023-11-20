FROM node:18.18.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["npm", "start","dev"]
