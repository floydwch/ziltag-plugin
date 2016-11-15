FROM mhart/alpine-node:7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

# RUN npm install -g https://github.com/DIREKTSPEED-LTD/npm
RUN cd $(npm root -g)/npm \
    && npm install fs-extra \
    && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

RUN npm i

EXPOSE 4000

CMD npm run serve
