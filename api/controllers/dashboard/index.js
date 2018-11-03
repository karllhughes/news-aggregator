module.exports = {

  description: 'Display the dashboard "Welcome" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/index',
      description: 'Display the welcome page for authenticated users.'
    },
  },

  fn: async function (inputs, exits) {
    let data = {
      posts: {},
      sources: {},
      social: {},
    };
    const query = this.req.query;
    const countHoursBack = (query.days_back * 24) || 48;

    try {
      data = {
        posts: await Post.getCounts(countHoursBack),
        sources: await Source.getCounts(countHoursBack),
        social: await Post.getSocialCounts(countHoursBack),
      };
    } catch (e) {
      sails.log.error(e);
    }

    return exits.success({data, query});
  }
};
