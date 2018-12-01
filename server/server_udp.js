'use strict';

const net = require('net');
const dgram = require('dgram');
const yargs = require('yargs');

const app = require('../app.js');
const ip = require('../config/ip.json');
const UDPservices = require('../models/UDPservices');

const argv = yargs.usage('node echoserver.js [--port port]')
  .default('address', 'localhost')
  .default('port', ip.server.port)
  .default('v', false)
  .help('help')
  .argv;

const options = {
  address: argv.address,
  port: argv.port,
};

const isVerbose = argv.v ? true : false;

let udp = null;

const router = `${ip.router.address}:${ip.router.port}`;
const serverURL = `${options.host}:${options.port}`;

const server = dgram.createSocket('udp4');

server.bind(options);

/**
 * Server has to be on 
 * @param host 192.168.2.3
 * @param port 8007
 */
server.on('listening', () => {
  const address = server.address();
  udp = new UDPservices('127.0.0.1', ip.client.port, ip.router.port);

  console.log('Echo server is listening at %j', `${address.address}:${address.port}`);
});

server.on('message', (clientInput, rinfo) => {
  //console.log(`Recieved data from ${rinfo.address}:${rinfo.port}`);

  // console.log(`${rinfo.address}:${rinfo.port}`);
  const sequenceIndex = udp.getRcvData(clientInput);

  if (typeof sequenceIndex === 'string') {
    console.log('time for lab2 stuff')
    console.log('server is ready with: ', udp.dataToRcv)


  } else {
    udp.setPacket(sequenceIndex);
    udp.sendTo(server);
  }

});


server.on('error', err => {
  console.log('Could not complete socket setup\n', err.stack)
  console.log(JSON.stringify(err, null, 2));
  process.exit(-1);
});

server.on('close', err => {
  console.log('Good bye!');
  process.exit(-1);
});


