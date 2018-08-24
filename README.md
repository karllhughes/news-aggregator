# News App

News and blog data aggregator. Uses Feedbin, SharedCount, and open source natural language processing tools to collect data about news articles and blog posts.


## Local Development (With Docker)

- Start the containers: `npm run app:up`
- Stop the containers: `npm run app:down`


### Command-line scripts

- `npm run sources:collect` Collect and sync sources from Feedbin with the application database.
- `npm run sources:collect-metadata` Gets extra metadata about sources (eg: image, favicon, description).
- `npm run posts:collect` Collect the latest posts from Feedbin and save to the application database.
- `npm run posts:unfluff` Get the full text, image, tags, and links using [Node Unfluff](https://github.com/ageitgey/node-unfluff).
- `npm run posts:social` Get social share counts from [SharedCount](https://www.sharedcount.com/).


## Deploying to Hyper.sh

Deploy the database and attach an IP: 

```bash
hyper run -d -v news-db:/data/db --env-file=.env -p 35019:27017 --size s4 --name news-db mongo:4.0

hyper fip attach 123.456.78.90 news-db
```

Build and push the Docker image:

```bash
npm run app:build && npm run app:deploy
```

Run the collector(s):

```bash
hyper run --rm --env-file=.env --link=news-db --size m1 karllhughes/news node node_modules/.bin/sails run <COLLECTOR_NAME>
```

Set up Hyper.sh cron jobs to automatically run the collectors:

```bash
# Run source collector every 4 hours
hyper cron create --hour=*/4 --minute=0 --env-file=.env --link=news-db --size m1 --name news-sources-cron karllhughes/news node node_modules/.bin/sails run collect-sources

# Run source meta collector every 4 hours
hyper cron create --hour=*/4 --minute=6 --env-file=.env --link=news-db --size m1 --name news-source-meta-cron karllhughes/news node node_modules/.bin/sails run collect-metadata-for-sources

# Run post collector every 1 hour
hyper cron create --hour=* --minute=2 --env-file=.env --link=news-db --size m1 --name news-posts-cron karllhughes/news node node_modules/.bin/sails run collect-posts

# Run post unfluffer every 1 hour
hyper cron create --hour=* --minute=4 --env-file=.env --link=news-db --size m1 --name news-posts-unfluff-cron karllhughes/news node node_modules/.bin/sails run unfluff-posts

# Run share counters every 1 hour
hyper cron create --hour=* --minute=8 --env-file=.env --link=news-db --size s4 --name news-posts-social-24-cron karllhughes/news node node_modules/.bin/sails run shared-count-posts --hoursBack=24
hyper cron create --hour=* --minute=8 --env-file=.env --link=news-db --size s4 --name news-posts-social-168-cron karllhughes/news node node_modules/.bin/sails run shared-count-posts --hoursBack=168
```

Run a web instance (optional):

```bash
hyper run -d --env-file=.env --link=news-db:news-db --size s4 --name news-app -p 80:80 karllhughes/news node app.js --prod

hyper fip attach <IP> news-app
```


## Tech Stack

- [Sails 1.0](https://sailsjs.com)
- [Docker](#)
- [Node 9](#)
- [Hyper.sh](#)

## License

> Apache 2.0
