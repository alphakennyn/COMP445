`use strict`
const Packet = require('./UDPpacket');
const Main = require('../mainApplication.js');

module.exports = class UDPservice {

  constructor(destinationAddress , destinationPort, routerPort) {
    this.packet = {};
    this.routerPort = routerPort;
    this.destination = { 
      address: destinationAddress,
      port: destinationPort
    };
    this.sendData = null;
    this.rcvData = null;

    // Data to send as array
    this._dataToSend = [];
    this._dataToRcv = [];

    this._serverStatus = '';
  }


  get dataToRcv() {
    return this._dataToSend;
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
    this._dataToRcv.push(data);
  }
  
  set dataToSend(data) {
    //loop to avoid adding '/n'
    data.toString().split('').forEach((value) => {
      if(value != '\n') {
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
    this.packet = new Packet(0,1,this.destination.address, this.destination.port, dataString);
    this.sendData = this.packet.toBuffer;
  }



  /**
   * @function sendto send data to address
   * @param {Library} socket 
   * @param {String} sender name of sender
   */
  sendTo(socket){
    socket.send(this.sendData , this.routerPort, () => {
      this.sendData = null;
    });
  }

  getRcvData(recvData) {

    this._dataToSend.shift()
    const payloadLength = recvData.length - 1;
    const data = recvData.toString('utf-8', 11, recvData.length);
    if(data !== 'ACK' && data !== 'NACK') {
      this._dataToRcv += data;
      console.log('current recvData is ', this._dataToRcv);
      
    }
  }

  recvfrom(recvData) {
    const payloadLength = recvData.length - 1;

    const senderAddress = new Int8Array(recvData.slice(5,9)); // Buffer.alloc(4);//
    const senderPort = recvData.slice(9,11).readUInt16BE(0); // Buffer.alloc(2);//

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