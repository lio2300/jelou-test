FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD ["npx", "serverless", "offline", "--host", "0.0.0.0"]