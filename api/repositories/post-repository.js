
const postRepository = {
  defaultSort: 'publishedAt DESC',
  defaultLimit: 20,

  async getPosts(where, sort, limit, skip) {
    where = where || {};
    sort = sort || this.defaultSort;
    limit = limit || this.defaultLimit;
    skip = skip || 0;

    return await Post.find()
      .where(where)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .meta({enableExperimentalDeepTargets:true});
  },

  async getPostsWithSources(where, sort, limit, skip) {
    return Source.joinToPosts(
      await this.getPosts(where, sort, limit, skip)
    );
  },

  async updatePost(id, post) {
    return await Post.update({id}, post);
  },
};

module.exports = postRepository;
