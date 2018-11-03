const fetch = require('node-fetch');
const unfluff = require('unfluff');
const lc = require('letter-count');
const postRepository = require('../../repositories/post-repository');
const validUrl = require('valid-url');

module.exports = async () => {

  // Get posts without unfluffedAt set
  const posts = await postRepository.getPosts(
    { unfluffedAt: null },
    'feedbinCreatedAt DESC',
    100
  );

  const unfluffResults = posts.map(async (post) => {
    let updatedPost = { unfluffedAt: new Date() };

    try {
      updatedPost = await fetch(post.url).then(res => res.text()).then(html => {
        const unfluffed = unfluff(html);
        const counts = lc.count(unfluffed.text);

        const updatedPost = {
          unfluffedAt: new Date(),
          text: unfluffed.text,
          metaTags: unfluffed.tags,
          embeddedLinks: unfluffed.links,
          characterCount: counts.chars,
          wordCount: counts.words,
        };

        if (unfluffed.image && unfluffed.image.length && validUrl.isUri(unfluffed.image)) {
          updatedPost.imageUrl = unfluffed.image;
        }

        return updatedPost;
      });
    } catch (e) {
      sails.log.error(e);
    }

    // Save the results
    try {
      return await postRepository.updatePost(post.id, updatedPost);
    } catch (e) {
      sails.log.error(e);
    }
  });

  return await Promise.all(unfluffResults);
};
