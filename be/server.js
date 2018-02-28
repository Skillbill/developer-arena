require('./config').init()
  .then(() => {
    console.log('starting');

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

      console.log('[I] APP starting');
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
      mainRouter.use('/contest', require('./routers/contest/contest'));

      const port = process.env.PORT || 3000;

      app.listen(port, function() {
        console.log(`app running on port ${port}`);
      })


    } catch (error) {
      console.log('can\'t start app !!!!', error);

    }

  })
  .catch((error) => {
    console.log("PANIC. Can't load configuration", error);
  });

//for DOCKER
process.on('SIGINT', function() {
  process.exit();
});
