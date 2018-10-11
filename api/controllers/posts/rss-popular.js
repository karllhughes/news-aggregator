const PER_PAGE = 50;

module.exports = {
  description: 'RSS view of most popular posts within period',
  exits: {
    success: {
      responseType: 'rss-ok',
    },
  },
  fn: async function (inputs, exits) {
    const pageLinks = sails.helpers.getPageLinks(this.req.query);
    const maxHoursBack = sails.helpers.posts.getDaysBack(this.req.query) * 24;
    const withSource = sails.helpers.posts.withSource(this.req.query);
    const feedOptions = {
      title: 'ForEdus - Popular Posts',
      description: 'Most popular education news posts on the web',
      feed_url: 'https://www.foredus.com/rss/popular-posts',
      site_url: 'https://www.foredus.com',
      language: 'en',
      categories: ['Education'],
    };

    const posts = await sails.helpers.posts.getPopular({
      pageLinks,
      maxHoursBack,
      withSource,
      perPage: PER_PAGE,
    });

    return exits.success({posts, feedOptions});
  },

};
