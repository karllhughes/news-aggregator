const Feedbin = require('feedbin-nodejs');

/**
 * SourceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  collect: async function () {
    // Get subscriptions from the feedbin API
    const feedbin = new Feedbin(sails.config.feedbin.username, sails.config.feedbin.password);
    const feedbinSubscriptions = await feedbin.subscriptions.getAll();

    // Get existing records
    const existingSources = await Source.find({});

    const convertSubscriptionToSource = (subscription) => {
      return {
        title: subscription.title,
        siteUrl: subscription.site_url,
        feedUrl: subscription.feed_url,
        feedbinCreatedAt: subscription.created_at,
        feedbinFeedId: subscription.feed_id,
        feedbinId: subscription.id,
      }
    };

    const newSources = feedbinSubscriptions
      .filter(sub => existingSources
        .find(source => source.feedbinId === sub.id) === undefined)
      .map(convertSubscriptionToSource);

    const deletedSourceIds = existingSources
      .filter(source => feedbinSubscriptions
        .find(sub => source.feedbinId === sub.id) === undefined)
      .map(record => record.feedbinId);

    await Source.createEach(newSources);

    await Source.destroy({feedbinId: {in: deletedSourceIds}});

    return {
      created: newSources.length,
      deleted: deletedSourceIds.length,
    };
  }
};

