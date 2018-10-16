const fetch = require('node-fetch');
const moment = require('moment');

module.exports = async (hoursBack) => {
  const socialObjectNull = {};
  socialObjectNull['social.' + hoursBack.toString()] = null;

  const posts = await Post.find({
    where: {
      and: [
        {or: [
            {social: null},
            socialObjectNull,
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
        .then(socialData => {
          const socialObjectToSave = {...post.social};
          socialObjectToSave[hoursBack.toString()] = {
            facebook: socialData.Facebook,
            pinterest: socialData.Pinterest,
            linkedin: socialData.LinkedIn,
          };
          return Post.update({id: post.id}, {social: socialObjectToSave});
        });
    } catch (e) {
      console.error(e);
    }
  });

  return await Promise.all(updatedPosts);
};
