const processPostText = require('../api/controllers/processors/process-post-text');

module.exports = {

  friendlyName: 'Process post text content',

  description: 'Calculates text length and generates array of keywords',

  inputs: {},

  fn: async function (inputs, exits) {
    sails.log('Starting "Process post text content" script');

    try {
      const results = await processPostText();

      return exits.success(`${results.length} posts processed.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

