'use strict';
const util = require('util');

const yargs = require('yargs');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const asyncAppend = util.promisify(fs.appendFile);
const asyncWrite = util.promisify(fs.writeFile);
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
  async getFile() {
    let responseData = 'nothing happend';
    try {
      const fileData = await readFile(this.path);
      responseData = fileData.toString('utf8');
    } catch (e) {
      try {
        const dirData = await readdir(this.path);
        responseData = dirData;
      } catch (err) {
        responseData = `no such file found in ${this.path}`;
      }
    } finally {
      return responseData;
    }
  }

  async postFile(data, override) {
    let writeData;

    if (data === null) {
      return 'Please enter data :)';
    }

    try {
      await readdir(this.path)
    } catch (err) {
      try {
        if (override) {
          console.log('writting...')
          writeData = 'Override is true, replacing file..';
          await asyncWrite(this.path, data);
        } else {
          console.log('appending...')
          writeData = 'Adding new content to file'
          await asyncAppend(this.path, data);
        }
      } catch (e) {
        // console.log(e)
        // if (e.errno === -2) {
        //   writeData = 'File does not exist, creating'
        //   await asyncWrite(this.path, data);
        // } else if (e.errno === -20) {
        //   writeData = 'Adding new content to file'
        //   await asyncAppend(this.path, data);
        // }
        return ('Something went wrong with the storage space', e)
      }
    } finally {
      console.log(writeData);
      return writeData;
    }
  }

  get fileResponse() {
    return this.fileContent;
  }
}
