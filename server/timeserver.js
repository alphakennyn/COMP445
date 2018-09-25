'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node timeserver.js [--port port]')
    .default('port', 8037)
    .help('help')
    .argv;

const server = net.createServer(handleClient)
    .on('error', err => {
      throw err
    });

server.listen({port: argv.port}, () => {
  console.log('Time server is listening at %j', server.address());
});

function handleClient(socket) {
  console.log('New client from %j', socket.address());
  // Number of seconds elapsed from 1900 to 1970
  const time1970 = 2208988800;
  const now = new Date().getTime()/1000 + time1970;
  const buffer = new Buffer(4);
  buffer.writeUInt32BE(now, 0);
  socket.write(buffer);
  socket.destroy();
}