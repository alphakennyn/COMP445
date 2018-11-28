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
   * @param {Buffer} data 
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
      console.log(`${sender} just sent data`);
      this.sendData = null;
    });
  }

  recvfrom(recvData) {
    const payloadLength = recvData.length - 1;

    const senderAddress = Buffer.alloc(4);//new Uint8Array(recvData.copy(5,9));
    const senderPort = Buffer.alloc(2);//recvData.copy(9,11).readInt16BE(0);
    console.log('1st time', recvData)
    recvData.copy(senderAddress, 0, 5, 9);
    console.log('2nd time', recvData)
    recvData.copy(senderPort, 0, 9, 11);

    setTimeout(() => {
      console.log('waited 1s time')
      console.log(recvData)

    }, 50);

    const data = recvData.toString('utf-8', 11, payloadLength);

    console.log('sender address: ', new Uint8Array(senderAddress))
    console.log('sender port: ', senderPort)
    return {
      senderAddress,
      senderPort,
      data,
    } 
    // Todo return sender address:port
  }
}