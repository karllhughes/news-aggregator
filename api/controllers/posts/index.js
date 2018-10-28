module.exports = {

  description: 'Display the Posts list page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/posts/index',
    },

  },

  fn: async function (inputs, exits) {
    return exits.success();
  }
};
