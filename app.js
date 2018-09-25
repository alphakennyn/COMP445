const BasicHTTP = require('./models/BasicHTTP');
const yargs = require('yargs');

const HTTPRequests = require('./services/HTTPRequests');
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

if (MyArgs.needsHelp) {
  console.log('=====================================');
  console.log(`============== HELP ${MyArgs.requestType.toUpperCase()} ================`);
  console.log('=====================================');
  console.log(' ')

  switch (MyArgs.requestType) {
    case 'get':
      console.log('httpc help get');
      console.log('usage: httpc get [-v] [-h key:value] URL');
      console.log('Get executes a HTTP GET request for a given URL.');
      console.log('\t-v Prints the detail of the response such as protocol, status, and headers.');
      console.log("\t-h key:value Associates headers to HTTP Request with the format 'key:value'.");
      break;
    case 'post':
      console.log('usage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL');
      console.log('Post executes a HTTP POST request for a given URL with inline data or from file.');
      console.log('\t-v Prints the detail of the response such as protocol, status, and headers.');
      console.log("\t-h key:value Associates headers to HTTP Request with the format 'key:value'.");
      console.log('\t-d string Associates an inline data to the body HTTP POST request.');
      console.log('\t-f file Associates the content of a file to the body HTTP POST request.');
      console.log('Either [-d] or [-f] can be used but not both.');
      break;
    default:
      console.log('httpc help');
      console.log('httpc is a curl-like application but supports HTTP protocol only.');
      console.log('Usage: httpc command [arguments]');
      console.log('The commands are:');
      console.log('\tget executes a HTTP GET request and prints the response.');
      console.log('\tpost executes a HTTP POST request and prints the response.');
      console.log('\thelp prints this screen.');
      console.log('Use "httpc help [command]" for more information about a command.');
      break;
  }
  console.log(' ')
  console.log('=======================================');
  console.log(' ')
} else if (MyArgs.requestType && MyArgs.url !== '') {
  let myData;
  const urlArray = MyArgs.url.split('/');
  const host = `${urlArray[0]}/${urlArray[1]}/${urlArray[2]}`;
  const path = `/${urlArray[3]}`;

  switch(MyArgs.requestType) {
    case 'get':
      console.log(`getting from ${MyArgs.url}`)
      HTTPRequests.myRequest(MyArgs.requestType, host, path).then(res => {
        console.log(res);
      });
      break;
    case 'post':
      console.log(`posting to ${MyArgs.url}`)
      break;
    default:
      console.log('nothing should be here...')
      break;
  }
}

console.log(arguments)