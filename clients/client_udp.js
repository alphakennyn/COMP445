'use strict';

const net = require('net');
const dgram = require('dgram');
const yargs = require('yargs');

const Packet = require('../models/UDPpacket');
const url = require('../config/ip.json');
const { sendto } = require('../models/UDPservices');

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
client.bind(options);

process.on('uncaughtException', function (err) {
  console.log('uncaughtException: ' + err.stack);
});

client.on('listening', () => {
  const address = client.address();
  console.log(`client listening to ${address.address}:${address.port}`);

  process.stdin.on('readable', () => {
    const input = process.stdin.read();
    if (input != null) {

      //const buffString = new Buffer(input.toString(), 'ucs2');

      const packetData = new Packet(0,1,'127.0.0.1', url.server.port, input.toString())
      console.log('hello',packetData);
      // Allocate 15 bytes to bufToSend
      const bufToSend = packetData.toBuffer;
      
      //IGNORE THIS
      //const send = [0, 0,0,0,1,192,168,2,3,11,184,105,32,83]; 
      
      console.log('bye',bufToSend);
      client.send(bufToSend, url.router.port, (e) => {
        //console.log(e);
        console.log('Client sent: ',bufToSend);
      })
    }
  });

});


client.on('message', (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
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
