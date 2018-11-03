const moment = require('moment');

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
    let posts = await Post.getCollection().find({
      $and: [
        {social: {$ne: null}},
        {
          publishedAt: {
            $gt: moment.utc().subtract(inputs.options.maxHoursBack, 'h').toISOString(),
            $lte: moment.utc().subtract(24, 'h').toISOString(),
          },
        },
      ]
    })
    .sort({'social.total': -1})
    .skip(
      inputs.options.pageLinks.currentPage > 1 ?
      ((inputs.options.pageLinks.currentPage - 1) * inputs.options.perPage) :
      0
    )
    .limit(inputs.options.perPage)
    .toArray();

    if (inputs.options.withSource) {
      posts = await Source.joinToPosts(posts);
    }

    return exits.success(posts);
  }
};
