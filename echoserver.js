'use strict';

const net   = require('net');
const yargs = require('yargs');

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
        // just echo what received
        socket.write(buf);
      })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      })
      .on('end', () => {
        socket.destroy();
      });
}
