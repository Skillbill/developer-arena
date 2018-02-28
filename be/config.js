let cache;

const defaults = {
  //loggingLevel: 'debug',
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en'
  }
};

module.exports = {
  init : () => {
    cache = defaults;
    return Promise.resolve(cache);
  },
  get : () => {
    if (!cache) {
      throw {'msg': 'config not initialized'};
    } else {
      return cache;
    }
  }
};
