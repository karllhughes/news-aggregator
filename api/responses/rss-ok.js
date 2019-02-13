const RSS = require('rss');

function getPopularity(post) {
  return post.social ? (post.social.total || 0) : 0;
}

module.exports = function rssOk(data) {
  this.res.set('Content-Type', 'text/xml');
  const feed = new RSS(data.feedOptions);

  data.posts.map(post => {
    feed.item({
      title:  post.title,
      description: post.summary,
      url: post.url,
      categories: post.metaTags || [],
      author: post.author || null,
      date: post.publishedAt,
      custom_elements: [
        { popularity: getPopularity(post) },
      ],
      enclosure: { url: post.imageUrl ? post.imageUrl : '' },
    })
  });

  return this.res.status(200).send(feed.xml());
};
