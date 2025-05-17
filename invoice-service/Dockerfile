FROM node:23-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /dist

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]