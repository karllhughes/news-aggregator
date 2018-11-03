const moment = require('moment');

function getPagination(query, baseLink, perPage) {
  const currentPage = query.page ? Number(query.page) : 1;
  const nextPage = query.page ? Number(query.page) + 1 : 2;
  const previousPage = query.page ? Number(query.page) - 1 : undefined;

  return {
    baseLink,
    currentPage,
    nextPage,
    perPage,
    previousPage,
  };
}

async function getData(pagination) {
  let data = await Post.getCollection()
    .find({})
    .sort({publishedAt: -1})
    .skip((pagination.currentPage - 1) * pagination.perPage)
    .limit(pagination.perPage)
    .toArray();

  // Join sources
  data = await Source.joinToPosts(data);

  // Format dates
  data.map(post => post.publishedAt = moment(post.publishedAt).format('l LT'));

  return data;
}

module.exports = {

  description: 'Display the Posts list page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/posts/index',
    },
  },

  fn: async function (inputs, exits) {
    const perPage = 20;

    // Parse inputs
    const query = this.req.query;

    // Create pagination object
    const pagination = getPagination(query, '/posts?', perPage);

    // Make the query
    let data = await getData(pagination);

    // Return results
    const response = {
      data,
      pagination,
      query,
    };

    return exits.success(response);
  }
};
