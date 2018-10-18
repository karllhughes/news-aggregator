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

};

