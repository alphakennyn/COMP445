'use strict';
const querystring = require('querystring');

module.exports = class BasicHTTP {
  constructor(args) {
    this.args = this._formatArgs(args);

    this._namelessArgs = args._;

    this._needsHelp = this._namelessArgs.includes('help') ? true : false;
    this._request = this._getRequest(this._namelessArgs);
    this._headers = this.args.h ? this._formatHeader(this.args.h) : {} ;
    this._body = this.args.d ? this._formatData(this.args.d) : {} ;
    this._url = this._getURL(this._namelessArgs);
    this._isHTTP = this._url.includes('http');
    this._verbose = this.args.v ? true : false;
  }

  /**
   * Format the args for any smaller details
   * Known issue:
   * - The optoin -v is suppose to be called on it's own, however if -v is followed by anything non-header object, yargs will assume -v is the label for that said object.
   *    Solution: Sepereate -v from object
   * 
   * @param {Object} args 
   */
  _formatArgs(args) {
    if (!!args.v) {
      if (typeof args.v !== 'boolean') {
        args._.push(args.v)
        args.v = true;
      }
    }
    return args;
  }

  /**
   * Get the request type given the array of arguments.
   * Since there can only be one request, the first request of (get,post) will be used.
   * @param {Array} args 
   * @returns {String} request type
   */
  _getRequest(args) {
    return [...args].reduce((acc, arg) => {
      const argToCompare = arg.toLowerCase();
      if (acc === '') {
        if (argToCompare === 'get' || argToCompare === 'post') {
          acc = arg;
        }
      }
      return acc;
    }, '');
  }

  /**
   * Format stirng to object
   * @param {String} header 
   * @returns {Obect}
   */
  _formatHeader(header) {
    const headerObj = {}
    if (typeof header === 'string') {
      const headerArr = header.split(':');
      return header;
      headerObj[headerArr[0]] = headerArr[1]
    } else { // Is array
      return header.reduce((acc,arg) => {
        let currentHead = `${acc}\r\n${arg}`;
        if (acc === '') {
          currentHead = arg;
        }
        return currentHead;
      }, '');
    
      console.log(`Header: ${header} is not a valid format. Please use proper formating i.e. -h Heaader-Field: Header-data`)
    }

    return headerObj;
  }

  /**
   * Format the params to an object to be used for request
   * To be used for body
   * @param {Array | String |Object} data 
   * @returns {Object} 
   */
  _formatData(data) {

    if (typeof data === 'string') {
      return data;
    }
    // return data
    const myData = [].concat(data);
    //return
    // const cleanedData =
    return [...myData].reduce((acc, value) => {
      const parseVal = value.replace(/[{}]/g,'');
      const someData = parseVal.split(':');
      if(someData.length === 2) {
        acc[someData[0]] = someData[1];
      } else {
        console.log(`${value} is not a valid format. Please use proper formating i.e. foo=bar`)
      }
      return acc;
    }, {});

    //return querystring.stringify(cleanedData);
  }

  /**
   * Iterate over args array, and check if arg has substring http (Showing that it is a url).
   * Otherwise return empty string
   * @param {Array} args
   * @returns {String} url
   */
  _getURL(args) {
    return [...args].reduce((acc, arg) => {
      if (arg.includes('/')) {
        acc = arg;
      }

      return acc;
    }, '');
  }

  get needsHelp() {
    return this._needsHelp;
  }

  get requestType() {
    return this._request;
  }

  get headers() {
    return this._headers;
  }

  get body() {
    return this._body;
  }

  get url() {
    return this._url;
  }

  get isVerbose() {
    return this._verbose;
  }

  get isHTTP() {
    return this._isHTTP;
  }
}

//module.exports.BasicHTTP;