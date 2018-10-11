const moment = require('moment');
const PER_PAGE = 20;

module.exports = {
  description: 'HTML view of most popular posts within period',
  exits: {
    success: {
      viewTemplatePath: 'pages/posts/index',
    },
  },
  fn: async function (inputs, exits) {
    const pageLinks = sails.helpers.getPageLinks(this.req.query);
    const maxHoursBack = sails.helpers.posts.getDaysBack(this.req.query) * 24;

    const posts = await sails.helpers.posts.getPopular({
      pageLinks,
      maxHoursBack,
      withSource: true,
      perPage: PER_PAGE,
    });

    return exits.success({posts, moment, pageLinks});
  },
};
