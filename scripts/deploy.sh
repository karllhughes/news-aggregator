#!/usr/bin/env bash

echo "Pulling latest image"
hyper pull karllhughes/news

echo "Stopping production container"
hyper rm -f news-app

echo "Restarting production container"
hyper run -d --env-file=.env --restart=always --link=news-db:news-db --size s4 --name news-app -p 80:80 karllhughes/news node app.js --prod

echo "Attaching production IP"
hyper fip attach $HYPER_FIP news-app

echo "All done!"