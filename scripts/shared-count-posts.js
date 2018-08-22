const postController = require('../api/controllers/PostController');

module.exports = {

  friendlyName: 'Get shared count for posts',

  description: 'Collects shares on LinkedIn, Facebook, and Pinterest',

  inputs: {
    hoursBack: { type: 'number', defaultsTo: 24 }
  },

  fn: async function (inputs, exits) {
    sails.log(`Getting "shared counts" for posts ${inputs.hoursBack} hours old`);

    try {
      const results = await postController.appendSharedCounts(inputs.hoursBack);

      return exits.success(`${results.length} posts updated.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

