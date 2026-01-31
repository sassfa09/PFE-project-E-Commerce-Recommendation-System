FROM node:18-alpine

WORKDIR /app

COPY backend-api/package*.json ./

RUN npm install


COPY backend-api/ .

EXPOSE 5000

CMD ["npm", "run", "dev"]