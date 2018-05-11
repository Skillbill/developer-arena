FROM node:carbon

RUN mkdir /be
COPY . /be
WORKDIR /be
RUN npm install --unsafe-perm

VOLUME ["/be/preview"]
CMD npm start
