'use strict';

const net   = require('net');
const yargs = require('yargs');
const app = require('../app.js');
const Main = require('../mainApplication.js');

const argv = yargs.usage('node echoserver.js [--port port]')
    .default('port', 8007)
    .default('v', false)
    .help('help')
    .argv;

const isVerbose = argv.v ? true : false;

const server = net.createServer(handleClient)
    .on('error', err => {throw err; });

server.listen({port: argv.port}, () => {
  console.log('Echo server is listening at %j', server.address());
});

/**
 * handler when a client connects to the server. 
 * @param {Object} socket 
 */
function handleClient(socket) {
  console.log('New client from %j', socket.address());
  socket
      .on('data', buf => {
        const clientInput =  buf.toString('utf8').replace("\n", "");
        const clientArgs = yargs(clientInput.split(' ')).argv;

        console.log('CLIENT::Input:',clientInput)
        console.log('CLIENT::request:',clientArgs)
        const verboseString = `CLIENT::Input: ${clientInput}\n CLIENT::request: ${JSON.stringify(clientArgs)}\n`


        const mainApp = new Main(clientArgs);
        
        let response;

        if(isVerbose ) {
          socket.write(verboseString);
        }
        
        if(mainApp.isHTTP) {
          response = mainApp.myHttpResponse() || 'no http req';
          socket.write(response);
        } else {
          mainApp.myFilesResponse().then((data) => {    
            
            if (isVerbose) {
              console.log('SERVER:: data received is:', data);
              console.log('SERVER:: data type received is:',typeof data);
            }
            let dataToWrite;

            if (typeof data === 'string') {
              dataToWrite = Buffer.from(data);
            } else {
              dataToWrite = Buffer.from(JSON.stringify(data))
            }

            socket.write(dataToWrite);
          }).catch((err) => {
            console.log(err);
          });
        }
      })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      })
      .on('end', () => {
        socket.destroy();
      });
}
