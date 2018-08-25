const textCounter = require('letter-count');
const Natural = require('natural');
const tokenizer = new Natural.WordTokenizer();

const extractKeywords = (title, text) => {
  try {
    // Tokenize words
    // foreach:
    //   Make lowercase
    //   If not stop word (https://www.npmjs.com/package/stopwords-json):
    //     Record position in string (array key)
    //     Record word
    //     Record root word

    return [];
  } catch (e) {
    console.error(e);

    return null;
  }
};

module.exports = async () => {
  // TODO: Finish this

  // // Get posts with text but no keywords
  // const posts = await Post.find({
  //   where: {and: [
  //     {textProcessedAt: null},
  //     {text: {'!=': null}},
  //   ]},
  //   limit: 100,
  // });
  //
  // const results = posts.map(post => {
  //   try {
  //     if (post.text !== '') {
  //       const counts = textCounter.count(post.text);
  //       const textMeta = {
  //         characters: counts.chars,
  //         lines: counts.lines,
  //         words: counts.words,
  //         numbers: counts.numbers,
  //         letters: counts.letters,
  //         wordsigns: counts.wordsigns,
  //       };
  //
  //       const keywords = extractKeywords(post.title, post.text);
  //
  //       return Post.update({id: post.id}, {
  //         textProcessedAt: new Date(),
  //         textMeta,
  //         keywords,
  //       });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });
  //
  // return await Promise.all(results);
};
