const collectPostText = require('../api/controllers/collectors/collect-post-text');

module.exports = {

  friendlyName: 'Unfulff posts',

  description: 'Collects post text, image, tags, and embedded links using unfluff',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "unfulff posts" script');

    try {
      const results = await collectPostText();

      return exits.success(`${results.length} posts unfluffed.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

