FROM node:carbon
ARG version=dev

RUN mkdir /be
COPY . /be
WORKDIR /be
RUN echo {\"version\": \"$version\"} > version.json
RUN npm install --unsafe-perm

VOLUME ["/be/preview"]
CMD npm start
