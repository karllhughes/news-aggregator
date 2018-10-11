module.exports = {
  description: 'Get the number of days back for posts based on the query string option',
  sync: true,
  inputs: {
    query: {
      description: 'The request query object.',
      type: 'ref',
      defaultsTo: {},
    },
  },
  exits: {success: {outputType: 'number'}},
  fn: function (inputs, exits)  {
    return exits.success((
      inputs.query &&
      inputs.query.days_back &&
      Number(inputs.query.days_back) > 2
    ) ? Number(inputs.query.days_back) : 2);
  }
};
