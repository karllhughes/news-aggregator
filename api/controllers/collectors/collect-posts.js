const Feedbin = require('feedbin-nodejs');
const moment = require('moment');

const _convertEntryToPost = (entry) => {
  return {
    title: entry.title,
    url: entry.url,
    author: entry.author,
    summary: entry.summary,
    publishedAt: entry.published,
    feedbinCreatedAt: entry.created_at,
    feedbinFeedId: entry.feed_id,
    feedbinId: entry.id,
  }
};

module.exports = async () => {
  let since = moment().subtract(24, 'hours').toISOString();

  // Get most post most recently created at
  const latestPost = await Post.find({sort: 'feedbinCreatedAt DESC', limit: 1});
  if (latestPost && latestPost.length > 0) {
    since = latestPost[0].feedbinCreatedAt;
  }

  // Get paginated list of posts published since from the feedbin API
  const feedbin = new Feedbin(sails.config.feedbin.username, sails.config.feedbin.password);
  const options = {
    since,
    page: 1,
    per_page: 100,
  };
  const feedbinPosts = await feedbin.entries.getAll({params: options});

  const newPosts = feedbinPosts.map(_convertEntryToPost)
    .map(async (post) => {
      try {
        return await Post.findOrCreate({feedbinId: post.feedbinId}, post);
      } catch (e) {
        console.error(e);
      }
    });

  await Promise.all(newPosts);

  return {found: newPosts.length};
};
