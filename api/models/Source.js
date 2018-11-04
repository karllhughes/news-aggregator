const moment = require('moment');

/**
 * Source.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title: {
      type: 'string',
      required: true,
    },

    siteUrl: {
      type: 'string',
      required: true,
      isURL: true,
    },

    feedUrl: {
      type: 'string',
      required: true,
      isURL: true,
    },

    feedbinId: {
      type: 'number',
      required: true,
      unique: true,
    },

    feedbinFeedId: {
      type: 'number',
      required: true,
    },

    feedbinCreatedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false,
    },

    logo: {
      type: 'json',
      required: false,
    },

    image: {
      type: 'json',
      required: false,
    },

    description: {
      type: 'string',
      required: false,
      allowNull: true,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // posts: {
    //   collection: 'post',
    // },

  },

  joinToPosts: async (posts) => {
    const feedIds = posts.map(post => post.feedbinFeedId);

    const sources = await Source.find({ where: { feedbinFeedId: { 'in': feedIds } } });

    return posts.map(post => {
      post.source = sources.find(source => source.feedbinFeedId === post.feedbinFeedId);

      return post;
    });
  },

  getCounts: async (hoursBack) => {
    if (!hoursBack) {
      hoursBack = 48;
    }
    const minTimestamp = moment.utc().subtract(hoursBack, 'h').toDate();

    return {
      total: await Source.getDatastore().manager.collection('source').count(),
      active: (await Post.getDatastore().manager.collection('post').distinct('feedbinFeedId', {
        publishedAt: {$gt: minTimestamp}
      })).length
    };
  },

};

