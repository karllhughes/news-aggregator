const moment = require('moment');
const postRepository = require('../../repositories/post-repository');
const qs = require('qs');

const postQueryParamsParser = {
  defaultPerPage: 20,
  defaultSort: 'publishedAt DESC',

  getPagination(query) {
    const currentPage = query.page ? Number(query.page) : 1;
    const nextPage = currentPage + 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : undefined;
    const perPage = query.perPage || this.defaultPerPage;
    const mutableQuery = {...query};
    delete(mutableQuery.page);
    const baseLink = '/posts?' + qs.stringify(mutableQuery) + '&';
    delete(mutableQuery.sort);
    const baseSortLink = '/posts?' + qs.stringify(mutableQuery) + '&';

    return {
      baseLink,
      baseSortLink,
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

  getSort(query) {
    return query.sort ? query.sort : this.defaultSort;
  },
};


async function getData(where, sort, pagination) {
  return await postRepository.getPostsWithSources(
    where,
    sort,
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
    const query = this.req.query;
    sails.log(query);

    // Get sort string
    const sort = postQueryParamsParser.getSort(query);

    // Create pagination object
    const pagination = postQueryParamsParser.getPagination(query);

    // Get where clause from query
    const where = postQueryParamsParser.getWhere(query);

    // Make the query
    let data = await getData(where, sort, pagination);

    // Return results
    const response = {
      data,
      pagination,
      query,
    };

    return exits.success(response);
  }
};
