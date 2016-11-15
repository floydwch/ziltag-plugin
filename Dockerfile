FROM mhart/alpine-node:7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# RUN npm install -g https://github.com/DIREKTSPEED-LTD/npm
RUN cd $(npm root -g)/npm \
    && npm install fs-extra \
    && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

COPY ./package.json /usr/src/app/package.json
RUN npm i

COPY . /usr/src/app

EXPOSE 4000

CMD npm run serve
