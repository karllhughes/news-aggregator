
const postRepository = {
  defaultSort: 'publishedAt DESC',
  defaultLimit: 20,

  getPosts: async (where, sort, limit) => {
    where = where || {};
    sort = sort || this.defaultSort;
    limit = limit || this.defaultLimit;

    return await Post.find()
      .where(where)
      .sort(sort)
      .limit(limit);
  },

  getPostsWithSources: async (where, sort, limit) => {
    return Source.joinToPosts(
      await this.getPosts(where, sort, limit)
    );
  },

  updatePost: async (id, post) => {
    return await Post.update({id}, post);
  },
};

module.exports = postRepository;
