const postController = require('../api/controllers/PostController');

module.exports = {

  friendlyName: 'Unfulff posts',

  description: 'Collects post text, image, tags, and embedded links using unfluff',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "unfulff posts" script');

    try {
      const results = await postController.appendUnfluffContent();

      return exits.success(`${results.length} posts unfluffed.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

