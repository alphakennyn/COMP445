'use strict';

const net = require('net');
const Helper = require('../helper');
const PORT = 80;
const qs = require('querystring');
/**
 * TCP Client class
 */
module.exports = class Client {
  constructor(myRequest, host, path) {
    this.socket = new net.Socket();
    this.host = host;
    this.path = path;
    this.req = myRequest.toUpperCase();
    this.init();

  }

  /**
   * Funciton that intializes socket client
   */
  init() {
    const client = this;

    /**
     * Connect
     */
    client.socket.connect(PORT, client.host);

    client.socket.on('close', () => {
      console.log('closing..')
    })
  }

  httpRequest(content) {
    const client = this;
    let body = '';

    if (Helper.isEmptyObject(content.body) && Helper.isEmptyObject(content.headers)) {
      //body = (JSON.stringify(content.body));
      //body = content.body;
      body = qs.stringify(content.body);
    }

    return new Promise((resolve, reject) => {
      const command = (body === '') ? `${client.req} ${client.path} HTTP/1.0\r\nHost: ${client.host}\r\n\r\n ` : `${client.req} ${client.path} HTTP/1.0\r\nHost: ${client.host}\r\n${content.headers}\r\n\r\n${body}\r\n`;
      console.log('COMMAND\n');
      console.log(command);
      client.socket.write(command);
      
      /**
       * Define socket instructions
       */
      client.socket.on('data', (buffer) => {
        const bufferString = (buffer.toString());
        const arr = bufferString.split('\r\n')
        const seperateIndex = arr.indexOf('');
        /**
         * Format data
         */
        const data = JSON.parse(arr[seperateIndex + 1]);

        const response = {
          verbose : bufferString,
          basic: data,
        }

        client.socket.write('exit');
        resolve(response);
      });

      client.socket.on('error', (err) => {
        console.log('Error')
        reject(err);
      });
    });
  }
}
