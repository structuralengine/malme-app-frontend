#######################
# malme fontend angular
#######################
<<<<<<< Updated upstream
FROM node:21-alpine
RUN apk update && \
    apk upgrade && \
    apk add git && \
    npm install -g @angular/cli
EXPOSE 4200
=======
# FROM node:18.13-alpine as base
# WORKDIR /app

# RUN npm i -g @angular/cli@17.0.0
# COPY ./package*.json ./
# RUN  rm -rf node_modules && npm i

# FROM base as build
# COPY . .
# # COPY --chown=node:node ./src/environments/environment.stg.ts ./src/environments/environment.ts 
# RUN ng build -c stg --output-path=./dist-build-by-docker

# # NginX
# FROM nginx:alpine as prod
# COPY --from=build /app/dist-build-by-docker /usr/share/nginx/html
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# NginX   [ng build -c stg]を実行後docker composeを実行
FROM nginx:alpine as prod
COPY ./dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

>>>>>>> Stashed changes
