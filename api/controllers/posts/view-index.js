const moment = require('moment');
const querystring = require('querystring');

const PER_PAGE = 25;

const _joinSourcesToPosts = async (posts) => {
  const feedIds = posts.map(post => post.feedbinFeedId);

  const sources = await Source.find({ where: { feedbinFeedId: { 'in': feedIds } } });

  return posts.map(post => {
    post.source = sources.find(source => source.feedbinFeedId === post.feedbinFeedId);

    return post;
  });
};

const _getPageLinks = (query) => {
  const currentPage = query.page ? Number(query.page) : 1;
  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  const nextQuery = {
    ...query,
    page: nextPage,
  };

  const previousQuery = {
    ...query,
    page: previousPage,
  };

  const pageLinks = {
    currentPage,
    next: '/posts?' + querystring.stringify(nextQuery),
  };

  if (currentPage > 1) {
    pageLinks.previous = '/posts?page=' + querystring.stringify(previousQuery);
  }

  return pageLinks;
};

module.exports = {

  friendlyName: 'View posts page',

  description: 'Display the dashboard "Posts" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/posts/index',
      description: 'Display the posts page for authenticated users.'
    },

  },

  fn: async function (inputs, exits) {
    const pageLinks = _getPageLinks(this.req.query);
    let findOptions = {};

    if (this.req.query && this.req.query.order_by === 'popular') {
      findOptions = {
        where: {
          and: [
            {social: {'!=': null}},
            {publishedAt: {'>': moment().subtract(48, 'h').toISOString()}},
            {publishedAt: {'<': moment().subtract(24, 'h').toISOString()}},
          ]
        },
        sort: 'social.24.facebook.total_count DESC'
      };
    } else {
      findOptions = {
        sort: 'publishedAt DESC'
      };
    }

    let posts = await Post
      .find(findOptions)
      .meta({enableExperimentalDeepTargets: true})
      .paginate(pageLinks.currentPage, PER_PAGE);

    posts = await _joinSourcesToPosts(posts);

    return exits.success({posts, moment, pageLinks});

  },

};
