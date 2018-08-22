const Feedbin = require('feedbin-nodejs');
const moment = require('moment');
const fetch = require('node-fetch');
const unfluff = require('unfluff');

/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  collect: async () => {
    let since = moment().subtract(24, 'hours').toISOString();

    // Get most post most recently created at
    const latestPost = await Post.find({sort: 'feedbinCreatedAt DESC', limit: 1});
    if (latestPost && latestPost.length > 0) {
      since = latestPost[0].feedbinCreatedAt;
    }

    // Get paginated list of posts published since from the feedbin API
    const feedbin = new Feedbin(sails.config.feedbin.username, sails.config.feedbin.password);
    const options = {
      since,
      page: 1,
      per_page: 100,
    };
    const feedbinPosts = await feedbin.entries.getAll({params: options});

    const convertEntryToPost = (entry) => {
      return {
        title: entry.title,
        url: entry.url,
        author: entry.author,
        summary: entry.summary,
        publishedAt: entry.published,
        feedbinCreatedAt: entry.created_at,
        feedbinFeedId: entry.feed_id,
        feedbinId: entry.id,
      }
    };

    const newPosts = feedbinPosts.map(convertEntryToPost)
      .map(async (post) => {
        try {
          return await Post.findOrCreate({feedbinId: post.feedbinId}, post);
        } catch (e) {
          console.error(e);
        }
      });

    await Promise.all(newPosts);

    return {found: newPosts.length};
  },

  appendUnfluffContent: async () => {

    // Get posts without unfluffedAt set
    const posts = await Post.find({
      where: { unfluffedAt: null },
      sort: 'feedbinCreatedAt DESC',
      limit: 100,
    });

    // Unfluff each
    const unfluffResults = posts.map(async (post) => {
      let updatedPost = { unfluffedAt: new Date() };

      try {
        updatedPost = await fetch(post.url).then(res => res.text()).then(html => {
          const unfluffed = unfluff(html);
          return {
            unfluffedAt: new Date(),
            text: unfluffed.text,
            imageUrl: unfluffed.image,
            metaTags: unfluffed.tags,
            embeddedLinks: unfluffed.links,
          };
        });
      } catch (e) {
        console.error(e);
      }

      // Save the results
      try {
        return await Post.update({id: post.id}, updatedPost);
      } catch (e) {
        console.error(e);
      }
    });

    return await Promise.all(unfluffResults);
  },

  appendSharedCounts: async (hoursBack) => {
    const posts = await Post.find({
      where: {
        and: [{
          or: [
              {social: null},
              {'social.hoursBack': {'!=': hoursBack}},
          ]},
          {publishedAt: {'>': moment().subtract(hoursBack, 'h').toISOString()}},
          {publishedAt: {'<': moment().subtract(hoursBack - 1, 'h').toISOString()}},
        ]
      },
    }).meta({enableExperimentalDeepTargets: true});

    // Get social counts for each
    const updatedPosts = posts.map(async (post) => {
      try {
        return await fetch(`https://api.sharedcount.com/v1.0/?url=${post.url}&apikey=${sails.config.sharedCount.apiKey}`)
          .then(res => res.json())
          .then(socialData => Post.update({id: post.id}, {
            social: {
              hoursBack,
              facebook: socialData.Facebook,
              pinterest: socialData.Pinterest,
              linkedin: socialData.LinkedIn,
            }
          }));
        } catch (e) {
          console.error(e);
        }
    });

    return await Promise.all(updatedPosts);
  },

};

