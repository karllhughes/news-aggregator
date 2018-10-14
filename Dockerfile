FROM node:9

WORKDIR /app

COPY . /app

RUN npm install --silent

CMD node node_modules/.bin/sails lift
