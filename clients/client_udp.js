'use strict';

const net = require('net');
const dgram = require('dgram');
const yargs = require('yargs');

const Packet = require('../models/UDPpacket');
const url = require('../config/ip.json');
const UDPservices = require('../models/UDPservices');

const argv = yargs.usage('node echoclient.js [--host host] [--port port]')
  .default('hostname', '127.0.0.1')
  .default('port', url.client.port)
  .help('help')
  .argv;

const options = {
  port: argv.port,
  address: argv.hostname,
};
console.log(options)

const router = `${url.router.address}:${url.router.port}`;

const client = dgram.createSocket('udp4');
let udp = null;

client.bind(options);

process.on('uncaughtException', function (err) {
  console.log('uncaughtException: ' + err.stack);
});

client.on('listening', () => {
  const address = client.address();
  console.log(`client listening to ${address.address}:${address.port}`);
  udp = new UDPservices('127.0.0.1', url.server.port, url.router.port);

  process.stdin.on('readable', () => {
    const input = process.stdin.read();
    if (input != null) {
      udp.setPacket(input);
      udp.sendTo(client, 'Client');
    }
  });

});


client.on('message', (msg, rinfo) => {
  console.log(`${rinfo.address}:${rinfo.port}`);
  console.log(msg.toString('utf8'));
});


client.on('error', err => {
  console.log('Could not complete socket setup\n', err.stack)
  console.log(JSON.stringify(err, null, 2));
  process.exit(-1);
});

client.on('close', err => {
  console.log('Good bye!');
  process.exit(-1);
});