const addPostSocial = require('../api/controllers/cli-scripts/add-post-social');

module.exports = {

  friendlyName: 'Get shared count for posts',

  description: 'Collects shares on LinkedIn, Facebook, and Pinterest',

  inputs: {
    hoursBack: { type: 'number', defaultsTo: 24 }
  },

  fn: async function (inputs, exits) {
    sails.log(`Getting "add-post-social" for posts ${inputs.hoursBack} hours old`);

    try {
      const results = await addPostSocial(inputs.hoursBack);

      return exits.success(`Processed ${results.length} posts.`);
    } catch (e) {
      return exits.error(e);
    }

  }

};

