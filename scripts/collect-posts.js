const postController = require('../api/controllers/PostController');

module.exports = {

  friendlyName: 'Collect posts',

  description: 'Collects post data stored in Feedbin',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "collect posts" script');

    try {
      const results = await postController.collect();

      return exits.success(`${results.found} posts found.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

