const logger = require('./lib/logger');

require('./config').init()
  .then(() => {
    logger.info('starting server');

    try {

      const express = require('express');
      const bodyParser = require('body-parser');
      const i18n = require('i18n');
      const fileUpload = require('express-fileupload');
      const config = require('./config').get();
      const cors = require('cors');
      const https = require('https');
      const fs = require('fs');

      const app = express();

      logger.info('starting api');
      //app.set('creds', config);
      i18n.configure(Object.assign({}, {directory: __dirname + '/locales', updateFiles: false}, config.i18n));
      app.disable('x-powered-by');
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: false}));
      app.use(i18n.init);
      app.use(fileUpload());
      app.use(cors());

      app.use(express.static('public'));
      app.use('/info', require('./routers/info'));

      const mainRouter = express.Router();
      app.use(`/1.0`, mainRouter);

      mainRouter.use('/contest/:contestId/project/', require('./routers/contest/project'));
      mainRouter.use('/contest', require('./routers/contest/contest'));

      const port = process.env.PORT || 3000;
      app.listen(port, function() {
        logger.log(`server listening on ${port}`);
      })
    } catch (error) {
      logger.error('could not start the server:', error);
    }
  })
  .catch((error) => {
    logger.error("could not load configuration:", error);
  });

if (process.pid == 1) { // docker
  // allow ^C on a foreground instance to stop the container
  process.on('SIGINT', () => {
    logger.log("got SIGINT: exit");
    process.exit();
  });

  // promptly shutdown on docker stop */
  process.on('SIGTERM', () => {
    logger.log("got SIGTERM: exit");
    process.exit();
  });
}
