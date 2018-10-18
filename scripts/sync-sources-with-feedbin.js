const syncSourcesWithFeedbin = require('../api/controllers/cli-scripts/sync-sources-with-feedbin');

module.exports = {

  friendlyName: 'sync-sources-with-feedbin',

  description: 'Syncs source data with that stored in Feedbin',

  inputs: {},


  fn: async function (inputs, exits) {
    sails.log('Starting "sync-sources-with-feedbin" script');

    try {
      const results = await syncSourcesWithFeedbin();

      return exits.success(`${results.created} sources created, ${results.deleted} sources deleted.`);
    } catch (e) {
      return exits.error(e);
    }

  }


};

