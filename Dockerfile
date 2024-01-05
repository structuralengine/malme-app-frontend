#######################
# malme fontend angular
#######################
FROM nginx:alpine as prod
COPY ./dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/malmeCert.key /etc/nginx/malmeCert.key
COPY ./nginx/malmeCert.pem /etc/nginx/malmeCert.pem
