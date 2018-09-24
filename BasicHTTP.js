'use strict';

module.exports = class BasicHTTP {
  constructor(args) {
    this.args = args;

    this._namelessArgs = args._; 

    this._needsHelp = this._namelessArgs.includes('help') ? true : false;
    this._request = this._getRequest(this._namelessArgs);

    this._verbose = this.args.v ? true : false;
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
  
  get needsHelp() {
    return this._needsHelp;
  }

  get requestType() {
    return this._request;
  }

  get isVerbose() {
    return this._verbose;
  }
}

//module.exports.BasicHTTP;