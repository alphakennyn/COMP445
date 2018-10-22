'use strict';

const net   = require('net');
const yargs = require('yargs');
const app = require('../app.js');
const Main = require('../mainApplication.js');

const argv = yargs.usage('node echoserver.js [--port port]')
    .default('port', 8007)
    .help('help')
    .argv;

const server = net.createServer(handleClient)
    .on('error', err => {throw err; });

server.listen({port: argv.port}, () => {
  console.log('Echo server is listening at %j', server.address());
});

function handleClient(socket) {
  console.log('New client from %j', socket.address());
  socket
      .on('data', buf => {
        const clientInput =  buf.toString('utf8')
        const clientArgs = yargs.argv;
        const mainApp = new Main(clientArgs);
        console.log('Client request:',clientInput)
        
        // socket.write(buf);
      })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      })
      .on('end', () => {
        socket.destroy();
      });
}
