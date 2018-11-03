const moment = require('moment');
const postRepository = require('../../repositories/post-repository');

module.exports = {
  description: 'Get popular posts',
  inputs: {
    options: {
      description: 'The request query object.',
      type: 'ref',
      defaultsTo: {
        pageLinks: {currentPage: 1},
        maxHoursBack: 48,
        withSource: false,
        perPage: 20,
      },
    },
  },
  exits: {success: {outputType: 'ref'}},
  fn: async function (inputs, exits) {
    let posts;
    const where = { publishedAt: {
      '>': moment.utc().subtract(inputs.options.maxHoursBack, 'h').toDate(),
      '<': moment.utc().subtract(24, 'h').toDate(),
    }};
    const skip = inputs.options.pageLinks.currentPage > 1 ?
      ((inputs.options.pageLinks.currentPage - 1) * inputs.options.perPage) : 0;

    if (inputs.options.withSource) {
      posts = await postRepository.getPostsWithSources(
        where, 'social.total DESC', inputs.options.perPage, skip
      );
    } else {
      posts = await postRepository.getPosts(
        where, 'social.total DESC', inputs.options.perPage, skip
      );
    }

    return exits.success(posts);
  }
};
