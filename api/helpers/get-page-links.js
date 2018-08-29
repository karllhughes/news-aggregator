const querystring = require('querystring');

module.exports = {

  friendlyName: 'Get page links',

  description: 'Get pagination links (next, previous) from the request object\'s query object',

  sync: true,

  inputs: {
    query: {
      description: 'The request query object.',
      example: {page: 1, order_by: 'popular'},
      type: {},
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
