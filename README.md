# news-aggregator-2

a [Sails v1](https://sailsjs.com) application


## Local Development (With Docker)

- Start the containers: `npm run app:up`
- Stop the containers: `npm run app:down`


### Command-line scripts

- `npm run collect:sources` Collect and sync sources from Feedbin with the application database.
- `npm run collect:posts` Collect the latest posts from Feedbin and save to the application database


## Deploying to Hyper.sh

Deploy the database and attach an IP: 

```bash
hyper run -d -v news-db:/data/db --env-file=.env -p 35019:27017 --size s4 --name news-db mongo:3.2-jessie

hyper fip attach 123.456.78.90 news-db
```

Build and push the Docker image:

```bash
docker build -t karllhughes/news . && docker push karllhughes/news && hyper pull karllhughes/news
```

Run the collectors:

```bash
hyper run --rm --env-file=.env --link=news-db --size m1 karllhughes/news node node_modules/.bin/sails run collect-sources

hyper run --rm --env-file=.env --link=news-db --size m1 karllhughes/news node node_modules/.bin/sails run collect-posts
```

Run a web instance (optional):

```bash
hyper run -d --env-file=.env --link=news-db:news-db --size s2 --name news-app -p 80:80 karllhughes/news node app.js --prod

hyper fip attach <IP> news-app
```


## License

> Apache 2.0
