const https = require('https');
const fs = require('fs');

let options = {};

if(process.env.NODE_ENV === 'vps')
{
    options = {
        key: fs.readFileSync('./src/ssl/private.key.pem'),
        cert: fs.readFileSync('./src/ssl/domain.cert.pem'),
    };
}

module.exports = (app) => {
    return https.createServer(options,app);
};

