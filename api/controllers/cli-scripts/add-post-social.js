const moment = require('moment');
const sharedCountClient = require('../../api-clients/shared-count');

module.exports = async (hoursBack) => {
  const posts = await Post.find({
    where: {
      and: [
        {socialUpdatedAt: null},
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

    try {
      updatedPost.social = await sharedCountClient.getCounts(post.url);
    } catch (e) {
      sails.error(e);
    }

    // Save the results
    try {
      return await Post.update({id: post.id}, updatedPost);
    } catch (e) {
      sails.error(e);
    }
  });

  return await Promise.all(updatedPosts);
};
