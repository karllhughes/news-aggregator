const sourceController = require('../api/controllers/SourceController');

module.exports = {

  friendlyName: 'Collect metadata for sources',

  description: 'Collects logo and image for each source',

  inputs: {},


  fn: async function (inputs, exits) {
    sails.log('Starting "collect metadata for sources" script');

    try {
      const results = await sourceController.collectMetadata();

      return exits.success(`${results.length} sources updated.`);
    } catch (e) {
      return exits.error(e);
    }

  }


};

