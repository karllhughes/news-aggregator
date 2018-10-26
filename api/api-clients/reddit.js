const fetch = require('node-fetch');

function getTotalUpvotes(response) {
  let upvoteCount = 0;

  if (response.data && response.data.children) {
    // Loop through each submission
    response.data.children.forEach(child => {
      if (child && child.data) {
        upvoteCount += child.data.ups;
      }
    })
  }

  return upvoteCount;
}

module.exports = {
  baseUrl: 'http://www.reddit.com/search.json',
  getCounts: function (url) {
    return fetch(`${this.baseUrl}?q=${url}&sort=top&limit=100`)
      .then(res => res.json())
      .then(res => getTotalUpvotes(res));
  },
};
