module.exports = {

  description: 'Display the dashboard "Welcome" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/index',
      description: 'Display the welcome page for authenticated users.'
    },
  },

  fn: async function (inputs, exits) {
    const query = this.req.query;
    console.log(query);
    return exits.success({query});
  }
};
