FROM nginx:alpine
# This copies your config file INTO the image
COPY nginx.conf /etc/nginx/nginx.conf