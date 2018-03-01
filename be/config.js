let cache;

const defaults = {
  //loggingLevel: 'debug',
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en'
  },
  db: {
    host: 'localhost',
    port: 5432,
    database: 'sda-contest',
    user: 'postgres',
    password: '1234'
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
