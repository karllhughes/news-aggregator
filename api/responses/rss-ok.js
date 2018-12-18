const RSS = require('rss');

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
        { 'popularity': (post.social.total || 0) },
      ],
    })
  });

  return this.res.status(200).send(feed.xml());
};
