# News App

News and blog data aggregator. Uses Feedbin, SharedCount, and open source natural language processing tools to collect data about news articles and blog posts.


## Local Development (With Docker)

- Start the containers: `npm run app:up`
- Stop the containers: `npm run app:down`


### Command-line scripts

- `npm run app:sync-sources-with-feedin` Sync sources from Feedbin with the application database.
- `npm run app:add-source-metadata` Gets extra metadata about sources (eg: image, favicon, description).
- `npm run app:get-new-posts-from-feedbint` Get the latest posts from Feedbin and save to the application database.
- `npm run app:add-post-text` Get the full text, image, tags, and links using [Node Unfluff](https://github.com/ageitgey/node-unfluff). Also adds some text length metadata.
- `npm run app:add-post-keywords` Use the text of the post to extract keywords. Uses [Node Natural](https://github.com/NaturalNode/natural) for NLP tasks.
- `npm run app:add-post-social` Get social share counts from [SharedCount](https://www.sharedcount.com/).


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
hyper run --rm --env-file=.env --link=news-db --size s4 karllhughes/news node node_modules/.bin/sails run <COLLECTOR_NAME>
```

Set up Hyper.sh cron jobs to automatically run the collectors:

```bash
# Run source collector every 4 hours
hyper cron create --hour=*/4 --minute=0 --env-file=.env --link=news-db --size s4 --name news-sources-cron karllhughes/news node node_modules/.bin/sails run sync-sources-with-feedin

# Run source meta collector every 4 hours
hyper cron create --hour=*/4 --minute=6 --env-file=.env --link=news-db --size s4 --name news-source-meta-cron karllhughes/news node node_modules/.bin/sails run add-source-metadata

# Run post collector every 1 hour
hyper cron create --hour=* --minute=2 --env-file=.env --link=news-db --size s4 --name news-posts-cron karllhughes/news node node_modules/.bin/sails run get-new-posts-from-feedbin

# Run post unfluffer every 1 hour
hyper cron create --hour=* --minute=4 --env-file=.env --link=news-db --size s4 --name news-posts-unfluff-cron karllhughes/news node node_modules/.bin/sails run add-post-text

# Run post keyword extraction every 1 hour
hyper cron create --hour=* --minute=8 --env-file=.env --link=news-db --size s4 --name news-posts-unfluff-cron karllhughes/news node node_modules/.bin/sails run add-post-text

# Run share counters every 1 hour
hyper cron create --hour=* --minute=10 --env-file=.env --link=news-db --size s4 --name news-posts-social-24-cron karllhughes/news node node_modules/.bin/sails run add-post-social --hoursBack=24
hyper cron create --hour=* --minute=10 --env-file=.env --link=news-db --size s4 --name news-posts-social-168-cron karllhughes/news node node_modules/.bin/sails run add-post-social --hoursBack=168
```

Run a web instance (optional):

```bash
hyper run -d --env-file=.env --restart=always --link=news-db:news-db --size s4 --name news-app -p 80:80 karllhughes/news node app.js --prod

hyper fip attach <IP> news-app
```


## Tech Stack

- [Sails 1.0](https://sailsjs.com)
- [Docker](https://www.docker.com/)
- [Node 9](https://nodejs.org/en/blog/release/v9.9.0/)
- [Hyper.sh](https://hyper.sh/)


## License

> Copyright 2018, Portable CTO, LLC
> 
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
> 
>     http://www.apache.org/licenses/LICENSE-2.0
> 
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
