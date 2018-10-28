module.exports = {

  description: 'Display the dashboard "Welcome" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/index',
      description: 'Display the welcome page for authenticated users.'
    },
  },

  fn: async function (inputs, exits) {
    let data = {};
    const query = this.req.query;
    const countHoursBack = (query.days_back * 24) || 48;

    try {
      data = {
        posts: await Post.getCounts(countHoursBack),
        // sources: await getSourceCounts(),
        // social: await getSocialCounts(),
      };
    } catch (e) {
      sails.log.error(e);
    }

    console.log(data);
    return exits.success({data, query});
  }
};
