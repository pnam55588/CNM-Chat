FROM node:18-alpine

WORKDIR /backend/backend

# COPY package*.json ./

COPY . .
RUN npm install

# RUN npm install


CMD [ "node", "app.js" ]