'use strict';

const net = require('net');

const PORT = 80;

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
    client.socket.connect(PORT, client.host, () => {
      console.log('connected! to socket')
    });

    client.socket.on('close', () => {
      console.log('Client closed');
    });
  }

  httpRequest(reqBody) {
    const client = this;
    const body = reqBody || '';

    return new Promise((resolve, reject) => {

      const command = (body === '') ? `${client.req} ${client.path} HTTP/1.0\r\nHost: ${client.host}\r\n\r\n ` : `${client.req} ${client.path} HTTP/1.0\r\nHost: ${client.host}\r\n${body}\r\n `;
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
        reject(err);
      });
    });
  }
}
