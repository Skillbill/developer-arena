FROM node:carbon

RUN mkdir -p /tmp/app
ADD . /tmp/app
WORKDIR /tmp/app
RUN npm install
RUN npm run build

RUN mv dist /app
RUN rm -rf /tmp/app

WORKDIR /app
RUN npm -g install http-server
CMD [ "http-server" ]
