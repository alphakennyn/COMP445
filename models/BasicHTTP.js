'use strict';

module.exports = class BasicHTTP {
  constructor(args) {
    this.args = this._formatArgs(args);

    this._namelessArgs = args._;

    this._needsHelp = this._namelessArgs.includes('help') ? true : false;
    this._request = this._getRequest(this._namelessArgs);
    this._headers = this.args.h ? this._formatData(this.args.h) : {} ;
    this._body = this.args.d ? this._formatData(this.args.d) : {} ;
    this._url = this._getURL(this._namelessArgs);
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
    return args
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
   * Format the params to an object to be used for request
   * To be used for header and body
   * @param {Array | String} data 
   * @returns {Object} 
   */
  _formatData(data) {
    const myData = [].concat(data);
    return [...myData].reduce((acc, value) => {
      const someData = value.split('=');
      
      if(someData.length === 2) {
        acc[someData[0]] = someData[1];
      } else {
        console.log(`${value} is not a valid format. Please use proper formating i.e. foo=bar`)
      }
      console.log(acc);
      return acc;
    }, {});
  }

  /**
   * Iterate over args array, and check if arg has substring http (Showing that it is a url).
   * Otherwise return empty string
   * @param {Array} args
   * @returns {String} url
   */
  _getURL(args) {
    return [...args].reduce((acc, arg) => {
      if (arg.includes('http')) {
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
}

//module.exports.BasicHTTP;