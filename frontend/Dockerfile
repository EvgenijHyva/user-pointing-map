FROM node:16.17-alpine as builder

COPY . /app/frontend
WORKDIR /app/frontend

RUN npm i && npm run build


FROM node:16.17-alpine

RUN npm install -g serve

COPY  --from=builder /app/frontend/build app/build

CMD ["serve", "-s", "build"]