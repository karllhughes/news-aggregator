/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'posts/json-popular': true,
  'posts/rss-popular': true,

  // TODO: Remove this
  'dashboard/*': true,

  // Allow Post API
  'PostController': {
    find: true,
    findOne: true,
  },
};
