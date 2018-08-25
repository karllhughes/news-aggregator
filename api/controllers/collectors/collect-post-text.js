const fetch = require('node-fetch');
const unfluff = require('unfluff');

module.exports = async () => {

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
};
