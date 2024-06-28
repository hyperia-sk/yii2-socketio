const fs = require("fs");

const logStream = fs.createWriteStream('/tmp/output.log', { flags: 'a' });
const errorStream = fs.createWriteStream('/tmp/error.log', { flags: 'a' });

console.log = (message) => {
    logStream.write(`${new Date().toISOString()} - INFO - ${message}\n`);
};

console.error = (message) => {
    errorStream.write(`${new Date().toISOString()} - ERROR - ${message}\n`);
};

process.on('uncaughtException', (err, origin) => {
    console.error(
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}\n`
    );
});

process.on('unhandledRejection', (reason, promise) => {
    const trace = stackTrace.parse(reason);
    const file = trace[0].getFileName();
    const line = trace[0].getLineNumber();
    const column = trace[0].getColumnNumber();
    console.error('Unhandled Rejection at:' + JSON.stringify(promise) + 'reason:' + reason);
    console.error(`In file: ${file}, at line: ${line}, column: ${column}`);
});

const args = require('./bundles/args');
const server = require('./bundles/server');
const io = require('socket.io')(server,{origins: args.allowedOrigins});
const redis = require("redis");

const subscriber = redis.createClient(JSON.parse(args.sub));
const publisher = redis.createClient(JSON.parse(args.pub));

const RedisIO = require('./bundles/redis-io');

(new RedisIO(args.nsp, io, subscriber, publisher, args.channels.split(',')))
    .listen();

function isClientOpen(client) {
    return client && client.connected;
}

if (!isClientOpen(publisher)) {
    publisher.on('connect', () => {
        console.log('Redis publisher client connected.');
    });
    publisher.on('error', (err) => {
        console.error('Redis connection error:', err);
    });
}
if (!isClientOpen(subscriber)) {
    subscriber.on('connect', () => {
        console.log('Redis subscriber client connected.');
    });
    subscriber.on('error', (err) => {
        console.error('Redis subscriber connection error:', err);
    });

}

server.listen(args.server.split(':')[1], args.server.split(':')[0]);