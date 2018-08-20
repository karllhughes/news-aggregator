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
hyper run -d -v news-db:/data/db --env-file=.env -p 35019:27017 --size s2 --name news-db mongo:3.2-jessie
hyper fip attach 123.456.78.90 news-db
```

Run the collectors:

```bash
hyper run --rm --env-file=.env --link=news-db --size s2 karllhughes/news node node_modules/.bin/sails run collect-sources

hyper run --rm --env-file=.env --link=news-db --size s2 karllhughes/news node node_modules/.bin/sails run collect-posts
```


## License

> Apache 2.0
