const fs = require("fs");

const logStream = fs.createWriteStream('/tmp/socketio-node-js-server.output.log', { flags: 'a' });
const errorStream = fs.createWriteStream('/tmp/socketio-node-js-server.error.log', { flags: 'a' });

console.log = (message) => {
    logStream.write(`${new Date().toISOString()} - INFO - ${message}\n`);
};

console.error = (message) => {
    errorStream.write(`${new Date().toISOString()} - ERROR - ${message}\n`);
};

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

if (isClientOpen(publisher)) {
    console.log('Redis publisher WORKING');
} else {
    console.error('Redis publisher client is closed.');
    console.log('pub' + JSON.stringify(publisher));
    publisher.connect();
}
// Príklad použitia:
if (isClientOpen(subscriber)) {
    console.log('Redis subscriber WORKING');
} else {
    console.error('Redis subscriber client is closed.');
    console.log('sub' + JSON.stringify(subscriber));
    subscriber.connect();
}

server.listen(args.server.split(':')[1], args.server.split(':')[0]);

