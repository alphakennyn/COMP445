'use strict';

const net = require('net');
const dgram = require('dgram');

const yargs = require('yargs');

const argv = yargs.usage('node echoclient.js [--host host] [--port port]')
  .default('hostname', '192.168.2.125')
  .default('port', 41830)
  .help('help')
  .argv;

const options = {
  host: argv.hostname,
  port: argv.port,
  name: 'Client guy'
};

console.log(options)

/**
 * 
 */
//const client = net.createConnection(options);
const client = dgram.createSocket('udp4');
//set config
client.bind(options.post, () => {
  conosle.log()
  //client.addMembership(options.host);
  console.log(`listening on a ${options.host}:${options.port}`);
});
const requests = [];


process.on('uncaughtException', function(err) {
  console.log('uncaughtException: ' + err.stack);
});
/**
 * Request
 */
// client.on('connect', () => {
//   console.log('Type any thing then ENTER. Press Ctrl+C to terminate');
//   const params = {
//     assignment: 1,
//     course: 'networking'
//   };
//   // client.write(command);


// });

client.on('listening', () => {
  const address = client.address();
  console.log(`server listening ${address.address}:${address.port}`);

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk != null) {
      console.log('this is chunk',chunk)
      requests.push({
        sendLength: chunk.byteLength,
        response: new Buffer(0)
      });
      console.log();
      client.write(chunk);
    }
  });

});
/**
 * Response
 */
// client.on('data', buf => {
//   if (requests.length == 0) {
//     client.end();
//     process.exit(-1);
//   }

//   console.log('Server replied: ', buf.toString("utf-8"))
//   // const r = requests[0];
//   // r.response = Buffer.concat([r.response, buf]);
//   // if(r.response.byteLength >= r.sendLength){
//   //   requests.shift();
//   //   console.log("Server replied:\n\n" + r.response.toString("utf-8") + '\n')
//   // }
// });

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
