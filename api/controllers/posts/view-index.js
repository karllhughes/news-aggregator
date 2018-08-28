const moment = require('moment');

const PER_PAGE = 25;

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
    let posts = [];

    if (this.req && this.req.query && this.req.query.order_by === 'popular') {
      posts = await Post
        .find({
          where: {
            and: [
              {social: {'!=': null}},
              {publishedAt: {'>': moment().subtract(24, 'h').toISOString()}},
              {publishedAt: {'<': moment().subtract(24 - 1, 'h').toISOString()}},
            ]
          },
          sort: 'social.24.facebook.total_count DESC'
        })
        .meta({enableExperimentalDeepTargets: true})
        .paginate(1, PER_PAGE);
    } else {
      posts = await Post
        .find({
          sort: 'publishedAt DESC'
        })
        .paginate(1, PER_PAGE);
    }


    return exits.success({posts});

  }


};
