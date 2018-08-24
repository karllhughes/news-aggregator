FROM node:9

# Install npm dependencies before adding code
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install --silent

WORKDIR /app

COPY . /app

RUN mkdir -p /app/node_modules && cp -rf /tmp/node_modules/* /app/node_modules

CMD node node_modules/.bin/sails lift
