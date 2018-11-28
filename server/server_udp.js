'use strict';

const net = require('net');
const dgram = require('dgram');
const yargs = require('yargs');

const app = require('../app.js');
const Main = require('../mainApplication.js');
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
console.log(options);

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
  const view = new Uint8Array(clientInput);
  console.log(`Recieved data from ${rinfo.address}:${rinfo.port}`);

  // const header = clientInput.slice(0, 10);
  const clientMessage = udp.recvfrom(clientInput);

  const senderAddress = clientMessage.senderAddress.join('.');
  const { senderPort, data } = { ...clientMessage };
  console.log(senderAddress)
  console.log(senderPort)
  console.log(data);

  const clientArgs = yargs(data.split(' ')).argv;


  // lab2 stuff
  let response;

  if (isVerbose) {
    const verboseString = `CLIENT::Input: ${data}\nCLIENT::request: ${JSON.stringify(clientArgs)}\n`
    //const verboseData = new Packet(0,1,'127.0.0.1', url.server.port, input.toString())
    udp.setPacket(verboseString);
    udp.sendTo(server, 'Server');
  }

  const mainApp = new Main(clientArgs);

  if (mainApp.isHTTP) {
    response = mainApp.myHttpResponse() || 'no http req';
    udp.setPacket(response);
    udp.sendTo(server, 'Server');
  } else {
    mainApp.myFilesResponse().then((data) => {
      let dataToWrite;

      if (typeof data === 'string') {
        dataToWrite = Buffer.from(data);
      } else {
        dataToWrite = Buffer.from(JSON.stringify(data))
      }
      console.log(dataToWrite)
      // socket.write(dataToWrite);
      udp.setPacket(dataToWrite);
      udp.sendTo(server, 'Server');

    }).catch((err) => {
      console.log(err);
    });

  }
});

/**
 * handler when a client connects to the server. 
 * @param {Object} socket 
 */
// function handleClient(socket) {
//   console.log('New client from %j', socket.address());
//   socket
//     .on('data', buf => {
//       const clientInput = buf.toString('utf8').replace("\n", "");
//       const clientArgs = yargs(clientInput.split(' ')).argv;

//       console.log('CLIENT::Input:', clientInput)
//       console.log('CLIENT::request:', clientArgs)

//       const mainApp = new Main(clientArgs);

//       let response;

//       if (isVerbose) {
//         socket.write(verboseString);
//       }

//       if (mainApp.isHTTP) {
//         response = mainApp.myHttpResponse() || 'no http req';
//         socket.write(response);
//       } else {
//         mainApp.myFilesResponse().then((data) => {

//           if (isVerbose) {
//             console.log('SERVER:: data received is:', data);
//             console.log('SERVER:: data type received is:', typeof data);
//           }
//           let dataToWrite;

//           if (typeof data === 'string') {
//             dataToWrite = Buffer.from(data);
//           } else {
//             dataToWrite = Buffer.from(JSON.stringify(data))
//           }

//           socket.write(dataToWrite);
//         }).catch((err) => {
//           console.log(err);
//         });
//       }
//     })
//     .on('error', err => {
//       console.log('socket error %j', err);
//       socket.destroy();
//     })
//     .on('end', () => {
//       socket.destroy();
//     });
// }
