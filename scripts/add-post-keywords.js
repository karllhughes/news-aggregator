const addPostKeywords = require('../api/controllers/cli-scripts/add-post-keywords');

module.exports = {

  description: 'Use the text of the post to extract keywords.',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "add-post-keywords" script');

    try {
      const results = await addPostKeywords();

      return exits.success(`Processed ${results.length} posts.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

