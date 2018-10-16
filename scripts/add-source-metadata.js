const addSourceMetadata = require('../api/controllers/cli-scripts/add-source-metadata');

module.exports = {

  description: 'Collects metadata (logo, image, description) for each source',

  inputs: {},


  fn: async function (inputs, exits) {
    sails.log('Starting "add-source-metadata" script');

    try {
      const results = await addSourceMetadata();

      return exits.success(`${results.length} sources updated.`);
    } catch (e) {
      return exits.error(e);
    }

  }


};

