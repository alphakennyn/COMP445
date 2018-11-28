`use strict`
const Packet = require('./UDPpacket');

module.exports = class UDPservice {

  constructor(destinationAddress , destinationPort, routerPort) {
    this.packet = {};
    this.routerPort = routerPort;
    this.destination = { 
      address: destinationAddress,
      port: destinationPort
    };
    this.sendData = null;
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
  sendTo(socket, sender){
    socket.send(this.sendData , this.routerPort, () => {
      this.sendData = null;
    });
  }

  recvfrom(recvData) {
    const payloadLength = recvData.length - 1;

    const senderAddress = new Int8Array(recvData.slice(5,9)); // Buffer.alloc(4);//
    const senderPort = recvData.slice(9,11).readUInt16BE(0); // Buffer.alloc(2);//
    // console.log(recvData)
    
    // recvData.copy(senderAddress, 0, 5, 9);
    // recvData.copy(senderPort, 0, 9, 11);

    const data = recvData.toString('utf-8', 11, payloadLength);

    // console.log('sender address: ', new Uint8Array(senderAddress))
    // console.log('Length: ', senderPort.length)
    // console.log('Int8: ', senderPort.readUInt8(0))
    // console.log('readUInt16BE: ', senderPort.readUInt16BE(0))
    // console.log('readUInt16LE: ', senderPort.readUInt16LE(0))
    // console.log('readUIntBE: ', senderPort.readUIntBE(0, senderPort.length))
    // console.log('readUIntLE: ', senderPort.readUIntLE(0, senderPort.length))

    return {
      senderAddress,
      senderPort,
      data,
    } 
  }
}