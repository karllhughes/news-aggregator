const moment = require('moment');
const postRepository = require('../../repositories/post-repository');

const postQueryParamsParser = {
  defaultPerPage: 20,

  getPagination(query, baseLink) {
    const currentPage = query.page ? Number(query.page) : 1;
    const nextPage = currentPage + 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : undefined;
    const perPage = query.perPage || this.defaultPerPage;

    return {
      baseLink,
      currentPage,
      nextPage,
      perPage,
      previousPage,
    };
  },

  getWhere(query) {
    let where = {and: []};

    if (query.author) {
      where.and.push({ author: {'contains': query.author }});
    }

    if (query.feedbinFeedId) {
      where.and.push({ feedbinFeedId: query.feedbinFeedId });
    }

    if (query.startDate || query.endDate) {
      const publishedAt = {};

      if (query.startDate) {
        publishedAt['>'] = moment(query.startDate, 'M/D/YY').toDate();
      }
      if (query.endDate) {
        publishedAt['<'] = moment(query.endDate, 'M/D/YY').toDate();
      }

      where.and.push({publishedAt});
    }

    if (query.social) {
      // Loop through each social and push new restrictions
      Object.entries(query.social).map(([key, value]) => {
        if (value) {
          where.and.push({[`social.${key}`]: {'>=': Number(value)}});
        }
      });
    }

    return where;
  },
};


async function getData(where, pagination) {
  return await postRepository.getPostsWithSources(
    where,
    'publishedAt DESC',
    pagination.perPage,
    (pagination.currentPage - 1) * pagination.perPage
  );
}

module.exports = {

  description: 'Display the Posts list page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/posts/index',
    },
  },

  fn: async function (inputs, exits) {
    // Parse inputs
    const query = this.req.query;

    // Create pagination object
    const pagination = postQueryParamsParser.getPagination(query, '/posts?');

    // Get where clause from query
    const where = postQueryParamsParser.getWhere(query);

    // Make the query
    let data = await getData(where, pagination);

    // Return results
    const response = {
      data,
      pagination,
      query,
    };

    return exits.success(response);
  }
};
