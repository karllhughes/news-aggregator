// Count all posts
db.getCollection('post').find().count();

// Newest posts
db.getCollection('post').find().sort({publishedAt: -1});

// Newest posts with social data
db.getCollection('post').find(
  {social: {$ne: null}},
  {title: 1, url: 1, social: 1, publishedAt: 1}
);

// Most popular posts in past 48 hours
db.post.aggregate([
  {
    $match: {
      $and: [
        {social: {$ne: null}},
        {publishedAt: {$gt: (new Date(new Date().getTime() - (48 * 60 * 60 * 1000))).toISOString()}},
      ]
    }
  },
  {
    $project: {
      title: 1,
      summary: 1,
      url: 1,
      publishedAt: 1,
      totalSocial: {
        $add: ["$social.24.facebook.total_count", "$social.24.pinterest"],
      }
    }
  },
  {$sort: {totalSocial: -1}}
]);
