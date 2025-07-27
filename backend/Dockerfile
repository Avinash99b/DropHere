FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY dist .

EXPOSE 3000

CMD ["node", "index.js"]