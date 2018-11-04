const moment = require('moment');

/**
 * Post.js
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

    url: {
      type: 'string',
      required: true,
      isURL: true,
    },

    author: {
      type: 'string',
      required: false,
      allowNull: true,
    },

    summary: {
      type: 'string',
      required: false,
      allowNull: true,
    },

    publishedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false,
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

    unfluffedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false,
    },

    text: {
      type: 'string',
      required: false,
      allowNull: true,
    },

    imageUrl: {
      type: 'string',
      required: false,
      isURL: true,
      allowNull: true,
    },

    metaTags: {
      type: 'json',
      required: false,
    },

    embeddedLinks: {
      type: 'json',
      required: false,
    },

    social: {
      type: 'json',
      required: false,
    },

    socialUpdatedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false,
    },

    characterCount: {
      type: 'number',
      required: false,
    },

    wordCount: {
      type: 'number',
      required: false,
    },

    keywordsAddedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false,
    },

    keywords: {
      type: 'json',
      required: false,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // source: {
    //   model: 'source',
    // },
  },

  getCounts: async (hoursBack) => {
    if (!hoursBack) {
      hoursBack = 48;
    }
    const minTimestamp = moment.utc().subtract(hoursBack, 'h').toDate();

    const counts = await Post.getCollection().aggregate([
      { "$facet": {
          "total": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { "$count": "total" },
          ],
          "unfluffed": [
            { "$match" : {"$and":[
              {publishedAt: {$gt: minTimestamp}},
              {"unfluffedAt":{"$ne":null}}
            ]}},
            { "$count": "total" }
          ],
          "keywordsAdded": [
            { "$match" : {"$and":[
              {publishedAt: {$gt: minTimestamp}},
              {"keywordsAddedAt":{"$ne":null}}
            ]}},
            { "$count": "total" }
          ],
          "socialAdded": [
            { "$match" : {"$and":[
              {publishedAt: {$gt: minTimestamp}},
              {"socialUpdatedAt":{"$ne":null}}
            ]}},
            { "$count": "total" }
          ],
          "averageWordLength": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, average: {$avg: "$wordCount"}}}
          ],
        }},
      {"$project": {
        "total": { "$arrayElemAt": ["$total.total", 0] },
        "unfluffed": { "$arrayElemAt": ["$unfluffed.total", 0] },
        "keywordsAdded": { "$arrayElemAt": ["$keywordsAdded.total", 0] },
        "socialAdded": { "$arrayElemAt": ["$socialAdded.total", 0] },
        "averageWordLength": { "$arrayElemAt": ["$averageWordLength.average", 0] },
      }},
    ]).toArray();

    return counts[0];
  },

  getSocialCounts: async (hoursBack) => {
    if (!hoursBack) {
      hoursBack = 48;
    }
    const minTimestamp = moment.utc().subtract(hoursBack, 'h').toDate();

    const counts = (await Post.getCollection().aggregate([
      { "$facet": {
          "total": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, total: {$sum: '$social.total'}}},
          ],
          "facebook": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, total: {$sum: '$social.facebook'}}},
          ],
          "twitter": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, total: {$sum: '$social.twitter'}}},
          ],
          "pinterest": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, total: {$sum: '$social.pinterest'}}},
          ],
          "reddit": [
            { "$match" : {publishedAt: {$gt: minTimestamp}}},
            { $group: {_id: null, total: {$sum: '$social.reddit'}}},
          ],
        }},
      { "$project": {
          "total": {"$arrayElemAt": ["$total", 0] },
          "facebook": {"$arrayElemAt": ["$facebook", 0] },
          "twitter": {"$arrayElemAt": ["$twitter", 0] },
          "pinterest": {"$arrayElemAt": ["$pinterest", 0] },
          "reddit": {"$arrayElemAt": ["$reddit", 0] },
        }},
    ]).toArray()).map(results => ({
      total: results.total.total,
      facebook: results.facebook.total,
      twitter: results.twitter.total,
      pinterest: results.pinterest.total,
      reddit: results.reddit.total,
    }));

    return counts[0];
  },

  getCollection: () => {
    return Post.getDatastore().manager.collection('post');
  }

};

