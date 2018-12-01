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
let triggerRCV = true;

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

      // Set data to send
      udp.dataToSend = input;

      // send first bit of input and start chain reaction
      udp.setPacket(udp.dataToSend[0]);
      udp.sendTo(client);

      // const inputStringArr = input.toString().split('');
      // inputStringArr.forEach(element => {
      // });
    }
  });

});


client.on('message', (msg, rinfo) => {
  // console.log(`${rinfo.address}:${rinfo.port}`);
  // udp.serverStatus = 'ACK';
  const rcvIndex = udp.getRcvData(msg);

  let packetToSend = null;

  if (!!rcvIndex.data && rcvIndex.data === 'ACK' && udp.dataToSend.length === 0) {
    packetToSend = 'DONE';
  } else {
    packetToSend = udp.dataToSend[0];
  }

  udp.setPacket(packetToSend);
  udp.sendTo(client);

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
