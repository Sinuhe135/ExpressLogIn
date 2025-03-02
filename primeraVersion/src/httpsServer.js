const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./src/ssl/private.key.pem'),
    cert: fs.readFileSync('./src/ssl/domain.cert.pem'),
};

module.exports = (app) => {
    return https.createServer(options,app);
};

