const BasicHTTP = require('./BasicHTTP');

const http = require('http');
const yargs = require('yargs');

/**
 * Get curl arguments as object.
 * 
 * NOTE
 * This will always return an object with fields:
 * 
 * @property _ : array that contains any arguments without name
 * @property $0 : file which it came from
 * 
 */
const arguments = yargs.argv;

/**
 * Call our basicHttp module that contains all our filter functions.
 */
const MyArgs = new BasicHTTP(arguments);


console.log(arguments)