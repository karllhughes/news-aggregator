#!/usr/bin/env bash

hyper config --accesskey=$HYPER_ACCESS --secretkey=$HYPER_SECRET
hyper pull karllhughes/news
exit $?

# Restart the app container and FIP
# hyper rm -f news-app
# hyper run -d --env-file=.env --restart=always --link=news-db:news-db --size s4 --name news-app -p 80:80 karllhughes/news node app.js --prod
# hyper fip attach $HYPER_FIP news-app
