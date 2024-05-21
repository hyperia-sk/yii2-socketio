const args = require('./args');
const https = require('https');
const stackTrace = require('stack-trace');
const http = require('http');
const fs = require('fs');
const ssl = JSON.parse(args.ssl);
const dotenv = require('dotenv').config();

// Všeobecná obsluha chýb
process.on('uncaughtException', (err, origin) => {
    console.log(
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}\n`
    );
});

process.on('unhandledRejection', (reason, promise) => {
    const trace = stackTrace.parse(reason);
    const file = trace[0].getFileName();
    const line = trace[0].getLineNumber();
    const column = trace[0].getColumnNumber();
    console.log('Unhandled Rejection at:' + JSON.stringify(promise) + 'reason:' + reason);
    console.log(`In file: ${file}, at line: ${line}, column: ${column}`);
});

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