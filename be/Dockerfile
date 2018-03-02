FROM node:carbon

RUN mkdir /sda-contest
COPY . /sda-contest/
RUN cd /sda-contest && npm install

CMD ["/usr/local/bin/node", "/sda-contest/server.js"]
