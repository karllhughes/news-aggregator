const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopWords = require('../../../extras/stop-words');


function getKeywordsFromText(text) {
  let wordsArray = tokenizer.tokenize(text)
    .map(word => word.toLowerCase())
    .filter(word => !stopWords.includes(word))
    .filter(word => word.length >= 3)
    .sort();

  // Get the counts for each word
  let wordsObject = {};
  wordsArray.forEach(x => { wordsObject[x] = (wordsObject[x] || 0) + 1; });

  // Gets unique words using a set
  wordsArray = [...new Set(wordsArray)];

  // Converts the words array into an array of objects with count and stem
  return wordsArray.map(word => ({
    word,
    count: wordsObject[word],
    stem: natural.PorterStemmer.stem(word),
  }));
}

module.exports = async () => {
  // Get posts where unfluffedAt is not null
  const posts = await Post.find({
    where: { text: {'!=': null} },
    sort: 'feedbinCreatedAt DESC',
    limit: 100,
  });

  // Loop through posts
  const updatedPosts = posts.map(async (post) => {
    const updatedPost = {keywordsAddedAt: new Date()};

    try {
      updatedPost.keywords = getKeywordsFromText(post.text);
    } catch (e) {
      sails.log.error(e);
    }

    // Save the results
    try {
      return await Post.update({id: post.id}, updatedPost);
    } catch (e) {
      sails.log.error(e);
    }
  });

  return await Promise.all(updatedPosts);
};
