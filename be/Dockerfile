FROM node:carbon

ENV root /be

RUN mkdir $root
COPY . $root/
RUN cd $root && npm install

CMD "/usr/local/bin/node" "$root/server.js"
