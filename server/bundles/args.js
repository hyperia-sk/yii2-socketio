// Const
const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
    add_help: true,
    description: 'Nodejs proxy'
});

parser.add_argument(
    '-nsp', '--nsp',
    {
        default_value: '',
        help: 'Redis nsp. This value should be the same with "BroadcastEvents" nsp'
    }
);

parser.add_argument(
    '-server', '--server',
    {
        default_value: 'localhost:1337',
        help: 'Http server: [hostname:port]'
    }
);
parser.add_argument(
    '-channels', '--channels',
    {
        default_value: 'socket.io',
        help: 'Redis channels. Example: --channels=\'c1,c2,c3\''
    }
);
parser.add_argument(
    '-allowedOrigins', '--allowedOrigins',
    {
        default_value: '*:*',
        help: 'Access-Control-Allow-Origin'
    }
);
parser.add_argument(
    ['-allowedMethods', '--allowedMethods'],
    {
        default_value: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        help: 'Access-Control-Allow-Methods'
    }
);
parser.add_argument(
    ['-sub', '--sub'],
    {
        default_value: '{url: redis://redis:6379}',
        help: 'Redis subscriber server credential: [{url: redis://localhost:6379}]'
    }
);
parser.add_argument(
    ['-pub', '--pub'],
    {
        default_value: '{url: redis://redis:6379}',
        help: 'Redis publisher server credential: [{url: redis://localhost:6379}]'
    }
);
parser.add_argument(
    '-runtime', '--runtime',
    {
        default_value: __dirname,
        help: 'Runtime path in the app'
    }
);
parser.add_argument(
    '-ssl', '--ssl',
    {
        default_value: null,
        help: 'SSL configs'
    }
);
const args = parser.parse_args();

module.exports = args;
