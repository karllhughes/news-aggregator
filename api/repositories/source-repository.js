
const postRepository = {
  defaultSort: 'title ASC',
  defaultLimit: 20,

  getSources: async (where, sort, limit) => {
    where = where || {};
    sort = sort || this.defaultSort;
    limit = limit || this.defaultLimit;

    return await Source.find()
      .where(where)
      .sort(sort)
      .limit(limit);
  },

  getSourcesWithPosts: async (where, sort, limit) => {
    // Coming soon
  }
};

module.exports = postRepository;
