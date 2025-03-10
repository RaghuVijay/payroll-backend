FROM node:23-alpine

WORKDIR /services

COPY package.json package-lock.json .env.production ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3004
CMD ["npm", "run", "start:prod"]
