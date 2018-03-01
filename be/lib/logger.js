const moment = require('moment');

(() => {
  ['log', 'trace', 'info', 'debug', 'warn', 'error'].forEach(kind => {
    module.exports[kind] = (...args) => {
      const now = moment(new Date()).format();
      args.unshift(`[${now}]`);
      console[kind](...args);
    };
  });
})()
