const moment = require('moment');
const PER_PAGE = 20;

function getPostCounts() {
  return Post.getDatastore().manager.collection('post').find({
    publishedAt: {$gt: moment.utc().subtract(168, 'h').toISOString()}
  }).count();
}

async function getSourceCounts() {
  return (await Post.getDatastore().manager.collection('post').distinct('feedbinFeedId', {
    publishedAt: {$gt: moment.utc().subtract(168, 'h').toISOString()}
  })).length;
}

async function getSocialCounts() {
  return (await Post.getDatastore().manager.collection('post').aggregate(
    {$match: {publishedAt: {$gt: moment.utc().subtract(168, 'h').toISOString()}}},
    {$group: {_id: null, sum: {$sum: '$social.total'}}},
    {$project: {_id: 0, sum: 1}}
  ).toArray())[0].sum;
}

module.exports = {
  description: 'HTML view of most popular posts within period',
  exits: {
    success: {
      viewTemplatePath: 'pages/posts/index',
    },
  },
  fn: async function (inputs, exits) {
    let counts;
    const pageLinks = sails.helpers.getPageLinks(this.req.query);
    const maxHoursBack = sails.helpers.posts.getDaysBack(this.req.query) * 24;

    const posts = await sails.helpers.posts.getPopular({
      pageLinks,
      maxHoursBack,
      withSource: true,
      perPage: PER_PAGE,
    });

    try {
      counts = {
        posts: await getPostCounts(),
        sources: await getSourceCounts(),
        social: await getSocialCounts(),
      };
    } catch (e) {
      sails.log.error(e);
    }

    return exits.success({posts, moment, pageLinks, counts});
  },
};
