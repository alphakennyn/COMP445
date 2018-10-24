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
    try {
      if (override) {
        writeData = await asyncWrite(this.path, data)
      }
      writeData = await asyncAppend(this.path, data)
    } catch (err) {
      console.log('postFile::Error writing file', err);
    } finally {
      console.log(writeData);
      return writeData;
    }
  }

  get fileResponse() {
    return this.fileContent;
  }
}
