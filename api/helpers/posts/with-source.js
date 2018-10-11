module.exports = {
  description: 'Determine whether or not to attach sources based on the query string option',
  sync: true,
  inputs: {
    query: {
      description: 'The request query object.',
      type: 'ref',
      defaultsTo: {},
    },
  },
  exits: {success: {outputType: 'boolean'}},
  fn: function (inputs, exits)  {
    return exits.success(inputs.query && inputs.query.with && inputs.query.with.source);
  }
};
