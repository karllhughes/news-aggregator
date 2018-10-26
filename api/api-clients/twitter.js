const fetch = require('node-fetch');
let bearerToken;

function getBearerToken() {
  const secret = new Buffer(sails.config.twitter.consumerKey + ':' + sails.config.twitter.consumerSecret).toString('base64');
  return fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + secret,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials',
  }).then(res => res.json()).then(res => res.access_token);
}

function getTotalTweets(response) {
  let totalTweets = 0;

  if (response.statuses) {
    // Counts retweets and favorites
    response.statuses.forEach(status => {
      totalTweets += status.retweet_count;
      totalTweets += status.favorite_count;
    });
  }

  return totalTweets;
}

module.exports = {
  baseUrl: 'https://api.twitter.com/1.1/search/tweets.json',
  getCounts: async function (url) {
    if (!bearerToken) {
      bearerToken = await getBearerToken();
    }

    return fetch(`${this.baseUrl}?q=${url}&count=100&include_entities=false`, {
      headers: {
        'Authorization': 'Bearer ' + bearerToken,
      },
    }).then(res => res.json()).then(res => getTotalTweets(res));
  },
};
