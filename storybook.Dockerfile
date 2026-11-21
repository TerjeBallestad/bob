# Bob's built Storybook as a static site (served at bob.godstemning.dev).
FROM node:22-slim AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build-storybook

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /src/storybook-static /usr/share/nginx/html
EXPOSE 8080
