#!/usr/bin/env bash

set -e
hyper config --accesskey=$HYPER_ACCESS --secretkey=$HYPER_SECRET --default-region=us-west-1
echo "Pulling latest image"
hyper pull karllhughes/news:latest

echo "Stopping production container"
hyper rm -f news-app

echo "Restarting production container"
hyper run -d --restart=always --link=news-db:news-db --size s4 --name news-app -p 80:80 \
  -e MONGO_CONNECTION_URL=$MONGO_CONNECTION_URL \
  -e NODE_ENV=$NODE_ENV \
  -e FEEDBIN_USERNAME=$FEEDBIN_USERNAME \
  -e FEEDBIN_PASSWORD=$FEEDBIN_PASSWORD \
  -e SHARED_COUNT_API_KEY=$SHARED_COUNT_API_KEY \
  -e TWITTER_CONSUMER_KEY=$TWITTER_CONSUMER_KEY \
  -e TWITTER_CONSUMER_SECRET=$TWITTER_CONSUMER_SECRET \
  karllhughes/news node app.js --prod

echo "Attaching production IP"
hyper fip attach $HYPER_FIP news-app

echo "All done!"