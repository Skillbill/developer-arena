const fs = require('fs');
const url = require('url');
const configPath = 'static/configuration.js';

const panic = (str) => {
    console.error(str);
    process.exit(1);
}

fs.readFile(configPath, (err, data) => {
    if (err) {
	panic(`could not load configuration file ${configPath}: ${err}`);
    }
    let config = eval(data.toString()); // configuration = { ... }
    let be = url.parse(config.serverAddress);
    be.host = process.env['BE_HOST'] || be.host;
    be.port = process.env['BE_PORT'] || be.bePort || 3000;
    config.serverAddress = `${be.protocol}//${be.host}:${be.port}`;
    console.log(config);
    fs.writeFile(configPath, `configuration = ${JSON.stringify(config)}`, (err) => {
	if (err) {
	    panic(`could not write config file ${configPath}: ${err}`);
	}
    });
});
