module.exports = class Packet {
  constructor(packet_type, seq_num, peer_ip_addr, peer_port, payload){
    this.type = packet_type;
    this.sequenceNum = seq_num;
    this.peerIPAddr = peer_ip_addr;
    this.peerPort = peer_port;
    this.payload = payload;
  }

  /**
   * Convert data in object into a buffer array
   */
  get toBuffer() {
    const type = Buffer.alloc(1);
    type.writeInt8(this.type, 0);

    const sequenceNum = Buffer.alloc(4);
    sequenceNum.writeInt32BE(this.sequenceNum, 0);

    // Iterate through array and add to Uint8Array
    const ipArray = this.peerIPAddr.split('.').reduce((acc,value, index) => {
      acc[index] = parseInt(value);
      return acc;
    }, new Uint8Array(4));

    const peerPort = Buffer.alloc(2);
    peerPort.writeUInt16BE(this.peerPort, 0);

    const payload = Buffer.from(this.payload, 'utf-8');

    // Get total length
    const length = type.length + sequenceNum.length + ipArray.length + peerPort.length + payload.length;

    // return buffer array
    return Buffer.concat([type,sequenceNum, ipArray ,peerPort, payload],length);
    
  }
}