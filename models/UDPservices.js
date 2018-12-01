`use strict`
const Packet = require('./UDPpacket');
const Main = require('../mainApplication.js');

module.exports = class UDPservice {

  constructor(destinationAddress, destinationPort, routerPort) {
    this.packet = {};
    this.routerPort = routerPort;
    this.destination = {
      address: destinationAddress,
      port: destinationPort
    };
    this.sendData = null;
    this.rcvData = null;

    /**
     * Data to send as array (used by client)
     * I will iterate through the array and send one bit at a time ONLY if we get the ACK from server
     */
    this._dataToSend = [];
    this.sendIndex = 0;

    /**
     * Data to receive as array (used by server)
     * The server will append every payload bit it receives untill it gets a 'ACK' call
     */
    this._dataToRcv = '';
    this.rcvIndex = 0;

    this._trigger = true;
  }
  get trigger() {
    return this._trigger;
  }

  get dataToRcv() {
    return this._dataToRcv;
  }

  get dataToSend() {
    return this._dataToSend;
  }

  get serverStatus() {
    return this._serverStatus;
  }
  

  set serverStatus(data) {
    this._serverStatus = data;
  }
  set dataToRcv(data) {
    this._dataToRcv = data;
  }

  set dataToSend(data) {
    //loop to avoid adding '/n'
    data.toString().split('').forEach((value) => {
      if (value != '\n') {
        this._dataToSend.push(value);
      }
    })
  }

  /**
   * @function Create a new packet with the passed value as payload
   * @param {Buffer} data data to send
   */
  setPacket(data) {
    const dataString = data.toString();
    const payload = {
      index: this.sendIndex,
      data: dataString,
    };
    this.sendIndex += 1;
    this.packet = new Packet(0, 1, this.destination.address, this.destination.port, JSON.stringify(payload));
    this.sendData = this.packet.toBuffer;
  }

  /**
   * @function sendto send data to address
   * @param {Library} socket 
   * @param {String} sender name of sender
   */
  sendTo(socket) {
    socket.send(this.sendData, this.routerPort, () => {
      this.sendData = null;
    });
  }

  /**
   * Get value of payload
   * @param {Bugger} recvData 
   */
  getRcvText(recvData) {
    return JSON.parse(recvData.toString('utf-8', 11, recvData.length));
  }

  /**
   * Check if sequence is in order and append payload to the rcvData string and increment sequence index.
   * @returns 3 options 
   *    - If done, return 'DONE'
   *    - If indexes match, append data and return index
   *    - If not matches (out of order), return 'NACK'
   * @param {Buffer} recvData 
   */
  getRcvData(recvData) {

    const data = JSON.parse(recvData.toString('utf-8', 11, recvData.length));

    if (data.data === 'DONE') {
      return this._dataToRcv;
    } else {
      // Check expected sequence match
      if (data.index === this.rcvIndex) {
        // For sender only, remove first index out of array.
        this._dataToSend.shift()

        this._dataToRcv += data.data;
        this.rcvIndex += 1;
        
        return {
          index: this.rcvIndex,
          data: 'ACK',
        };
      } else {
        return {
          index: this.rcvIndex,
          data: 'NACK',
        };
      }
    }

  }

  recvfrom(recvData) {
    const payloadLength = recvData.length - 1;

    const senderAddress = new Int8Array(recvData.slice(5, 9)); // Buffer.alloc(4);//
    const senderPort = recvData.slice(9, 11).readUInt16BE(0); // Buffer.alloc(2);//

    const data = recvData.toString('utf-8', 11, payloadLength);

    return {
      senderAddress,
      senderPort,
      data,
    }
  }


  lab2Stuff(clientMessage) {
    const { senderPort, data } = { ...clientMessage };

    const clientArgs = yargs(data.split(' ')).argv;

    // lab2 stuff
    let response;

    if (isVerbose) {
      const verboseString = `CLIENT::Input: ${data}\nCLIENT::request: ${JSON.stringify(clientArgs)}\n`
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
        console.log(dataToWrite.toString());

        // socket.write(dataToWrite);
        udp.setPacket(dataToWrite);
        udp.sendTo(server, 'Server');

      }).catch((err) => {
        console.log(err);
      });

    }
  }

}