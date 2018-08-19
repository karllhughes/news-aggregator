const sourceController = require('../api/controllers/SourceController');

module.exports = {

  friendlyName: 'Collect sources',

  description: 'Collects source data stored in Feedbin',

  inputs: {},


  fn: async function (inputs, exits) {
    sails.log('Starting "collect sources" script');

    try {
      const results = await sourceController.collect();

      return exits.success(`${results.created} sources created, ${results.deleted} sources deleted.`);
    } catch (e) {
      return exits.error(e);
    }


  }


};

