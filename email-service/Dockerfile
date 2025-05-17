FROM node:16-alpine

WORKDIR /dist

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]