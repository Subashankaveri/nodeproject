FROM node:20 AS stage1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=stage1 /app .
EXPOSE 3000
ENTRYPOINT ["/nodejs/bin/node", "src/app.js"]
