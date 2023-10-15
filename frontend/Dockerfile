FROM node:16.17-alpine

RUN npm install -g serve

COPY . /app/frontend
WORKDIR /app/frontend

RUN npm i && npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]