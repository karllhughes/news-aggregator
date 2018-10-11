const querystring = require('querystring');

module.exports = {
  sync: true,
  inputs: {
    query: {
      description: 'The request query object.',
      type: 'ref',
      defaultsTo: {},
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'pageLinks',
      outputType: {
        currentPage: 'number',
        next: 'string',
        previous: 'string',
      }
    }
  },
  fn: function(inputs, exits) {
    const currentPage = inputs.query.page ? Number(inputs.query.page) : 1;
    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;

    const nextQuery = {
      ...inputs.query,
      page: nextPage,
    };

    const previousQuery = {
      ...inputs.query,
      page: previousPage,
    };

    const pageLinks = {
      currentPage,
      next: '/posts?' + querystring.stringify(nextQuery),
    };

    if (currentPage > 1) {
      pageLinks.previous = '/posts?page=' + querystring.stringify(previousQuery);
    }

    return exits.success(pageLinks);
  }
};
