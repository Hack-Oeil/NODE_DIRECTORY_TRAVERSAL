FROM node:20-slim

WORKDIR /home/www
COPY ./www/ /home/www

RUN npm install

EXPOSE 80
CMD ["node", "my_http_server_real.js"]
