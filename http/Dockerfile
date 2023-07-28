FROM node:14-slim

WORKDIR /home/www
COPY ./www /home/


RUN cd ../ && npm install adm-zip && node /home/ho-wrapper.js
RUN cd /home/www && npm install
RUN rm '/home/ho-wrapper.js' && rm '/home/ho-sandbox-node.docx' && rm '/home/[Content_Types].xml' && rm -rf '/home/_rels' && rm -rf '/home/word'

EXPOSE 80
