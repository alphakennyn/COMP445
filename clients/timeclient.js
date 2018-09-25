'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node timeclient.js [--host host] [--port port]')
    .default('host', 'localhost')
    .default('port', 8037)
    .help('help')
    .argv;

const client = net.createConnection({host: argv.host, port: argv.port});

client.on('data', buffer => {
  // Number of seconds elapsed from 1900 to 1970
  const time1970 = 2208988800;
  const rtime = buffer.readUInt32BE(0) - time1970;
  const date = new Date(rtime*1000);
  console.log("Server date is %j", date);
  client.destroy();
});

client.on('error', err => {
  console.log('socket error %j', err);
  process.exit(-1);
});
