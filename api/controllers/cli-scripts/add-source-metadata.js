const fetch = require('node-fetch');

module.exports = async () => {
  // Get posts without logo
  const sources = await Source.find({
    where: {and: [{ description: null }, { logo: null }, { image: null }]},
    limit: 30,
  });

  const updatedSources = sources.map(async (source) => {
    try {
      return await fetch('https://api.microlink.io?url=' + source.siteUrl)
        .then(res => res.json())
        .then(meta => Source.update({id: source.id}, {
          description: meta.data.description,
          logo: (typeof meta.data.logo === 'string' || meta.data.logo instanceof String) ?
          {url: meta.data.logo} : meta.data.logo,
          image: (typeof meta.data.image === 'string' || meta.data.image instanceof String) ?
          {url: meta.data.image} : meta.data.image,
        }));
    } catch (e) {
      sails.log.error(e);
    }
  });

  return await Promise.all(updatedSources);
};
