#!/usr/bin/env bash

# Build the latest
docker build -t karllhughes/news .

# Push it to Hyper
docker push karllhughes/news
hyper pull karllhughes/news

# Restart the app container and FIP
hyper rm -f news-app
hyper run -d --env-file=.env --restart=always --link=news-db:news-db --size s4 --name news-app -p 80:80 karllhughes/news node app.js --prod
hyper fip attach 209.177.92.80 news-app
