const addPostText = require('../api/controllers/cli-scripts/add-post-text');

module.exports = {

  friendlyName: 'add-post-text',

  description: 'Collects post text, image, tags, and embedded links using unfluff. Also adds text length metadata.',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "add-post-text" script');

    try {
      const results = await addPostText();

      return exits.success(`Processed ${results.length} posts.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

