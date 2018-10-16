const getNewPostsFromFeedbin = require('../api/controllers/cli-scripts/get-new-posts-from-feedbin');

module.exports = {

  description: 'Gets posts from Feedbin, stores new ones in the database',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "get-new-posts-from-feedbin" script');

    try {
      const results = await getNewPostsFromFeedbin();

      return exits.success(`${results.found} posts found.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

