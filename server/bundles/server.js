const args = require('./args');
const https = require('https');
const http = require('http');
const fs = require('fs');
const ssl = JSON.parse(args.ssl);
const dotenv = require('dotenv').config();

const options = {
    key: fs.readFileSync(ssl.key),
    cert: fs.readFileSync(ssl.cert)
};

const server = args.ssl ? https.createServer(options, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', args.allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', args.allowedMethods);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': args.allowedOrigin,
            'Access-Control-Allow-Methods': args.allowedMethods,
            'Access-Control-Max-Age': 86400
        });
        res.end();
    }
}) : http.createServer();

module.exports = server;