'use strict';

const yargs = require('yargs');
const fs = require('fs');
/**
 * File Client class
 */
module.exports = class Client {
  constructor(path) {
    this.path = path;
  }

  /**
   * Funciton that intializes socket client
   */
  init() {
    console.log('path is:',this.path);
    //const files = yargs.commandDir(this.path).argv;
    let fileData = 'no files';
    try {
      fs.readFile(this.path, 'utf8', (err, data) => {
        
        if(!err) {
          console.log('darta',data)
          fileData = data;
          return data;
        } else {
          console.log(err)
        }
      });
      console.log(fileData);

    } catch (e) {

    } finally {
      
      return fileData;
    }

  }

}
