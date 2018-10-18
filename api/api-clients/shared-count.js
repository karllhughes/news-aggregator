const fetch = require('node-fetch');

module.exports = {
  baseUrl: 'https://api.sharedcount.com/v1.0/',
  getCounts: function (url) {
    return fetch(`${this.baseUrl}?url=${url}&apikey=${sails.config.sharedCount.apiKey}`)
      .then(res => res.json())
      .then(res => ({
        facebook: res.Facebook.total_count || 0,
        pinterest: res.Pinterest || 0,
      }));
  },
};
