const Feedbin = require('feedbin-nodejs');
const moment = require('moment');

/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  collect: async function () {
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

    const convertEntryToPost = (entry) => {
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

    const newPosts = feedbinPosts.map(convertEntryToPost);

    await Promise.all(newPosts.map(post => Post.findOrCreate({feedbinId: post.feedbinId}, post)));

    return {found: newPosts.length};
  }

};

