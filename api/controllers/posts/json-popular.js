const PER_PAGE = 50;

module.exports = {
  description: 'JSON view of most popular posts within period',
  exits: {
    success: {
      responseType: 'json-ok',
    },
  },
  fn: async function (inputs, exits) {
    const pageLinks = sails.helpers.getPageLinks(this.req.query);
    const maxHoursBack = sails.helpers.posts.getDaysBack(this.req.query) * 24;
    const withSource = sails.helpers.posts.withSource(this.req.query);

    const posts = await sails.helpers.posts.getPopular({
      pageLinks,
      maxHoursBack,
      withSource,
      perPage: PER_PAGE,
    });

    return exits.success({data: posts, pageLinks});
  },

};
