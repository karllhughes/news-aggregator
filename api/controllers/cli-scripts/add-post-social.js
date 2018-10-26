const moment = require('moment');
const sharedCountClient = require('../../api-clients/shared-count');
const redditClient = require('../../api-clients/reddit');
const twitterClient = require('../../api-clients/twitter');

module.exports = async (hoursBack) => {
  const posts = await Post.find({
    where: {
      and: [
        {publishedAt: {'>': moment().subtract(hoursBack, 'h').toISOString()}},
        {publishedAt: {'<': moment().subtract(hoursBack - 1, 'h').toISOString()}},
      ],
    },
    sort: 'publishedAt DESC',
    limit: 25,
  }).meta({enableExperimentalDeepTargets: true});

  // Get social counts for each
  const updatedPosts = posts.map(async (post) => {
    const updatedPost = { socialUpdatedAt: new Date() };

    // Facebook + Pinterest
    try {
      updatedPost.social = await sharedCountClient.getCounts(post.url);
    } catch (e) {
      sails.error(e);
    }

    // Reddit
    try {
      updatedPost.social.reddit = await redditClient.getCounts(post.url);
    } catch (e) {
      sails.error(e);
    }

    // Twitter
    try {
      updatedPost.social.twitter = await twitterClient.getCounts(post.url);
    } catch (e) {
      sails.log.error(e);
    }

    // Save the results
    try {
      updatedPost.social.total = Object.values(updatedPost.social).reduce((a, b) => a + b, 0);
      return Post.update({id: post.id}, updatedPost);
    } catch (e) {
      sails.log.error(e);
    }
  });

  return await Promise.all(updatedPosts);
};
