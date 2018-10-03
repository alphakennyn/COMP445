'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node echoclient.js [--host host] [--port port]')
    .default('host', 'localhost')
    .default('port', 8007)
    .help('help')
    .argv;

const options = {
  host: argv.host,
  port: argv.port,
  // path: 'get?'
};

console.log(options)

const client = net.createConnection(options);
const requests = [];

/**
 * Request
 */
client.on('connect', () => {
  console.log('Type any thing then ENTER. Press Ctrl+C to terminate');
  const params = {
    assignment: 1,
    course: 'networking'
  };
  const command = `GET /get?course=networking&assignment=1 HTTP/1.1 \r\nHost: ${options.host}`;

  client.write(command);
  
  // process.stdin.on('readable', () => {
  //   const chunk =  process.stdin.read();
  //   console.log('chunk',chunk)
  //   if (chunk != null) {
  //     requests.push({
  //       sendLength: chunk.byteLength,
  //       response: new Buffer(0)
  //     });
  //     client.write(chunk);
  //   }
  // });
});

/**
 * Response
 */
client.on('data', buf => {
  console.log('GOT DATA')

  if (requests.length == 0) {
    client.end();
    process.exit(-1);
  }

  const r = requests[0];
  r.response = Buffer.concat([r.response, buf]);
  console.log(r)
  if(r.response.byteLength >= r.sendLength){
    requests.shift();
    /**
     * Do what you need here...
     */
    console.log("Replied: " + r.response.toString("utf-8"))
  }
});

client.on('error', err => {
  console.log('socket setup error')
  console.log(JSON.stringify(err, null, 2));
  process.exit(-1);
});
client.on('close', err => {
  console.log('Good bye!');
  process.exit(-1);
});
