const BasicHTTP = require('./models/BasicHTTP');
const yargs = require('yargs');

const Client = require('./models/TCPClient'); //require('./services/HTTPRequests');
const helpDialog = require('./messages/help');
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
  console.log(`============== HELP ${MyArgs.requestType.toUpperCase()} =============`);
  console.log('=====================================');
  console.log(' ')

  switch (MyArgs.requestType) {
    case 'get':
      console.log(helpDialog.get);
      break;
    case 'post':
      console.log(helpDialog.post);
      break;
    default:
      console.log(helpDialog.default)
      break; 
  }

  console.log(' ')
  console.log('=======================================');
  console.log(' ')

} else if (MyArgs.requestType && MyArgs.url.length > 0) {
  const urlArray = MyArgs.url.split('/');
  const host = urlArray[2];
  const path = urlArray[3] ? `/${urlArray[3]}` : '/';
  const options = {
    host,
    path,
  }

  const client = new Client(MyArgs.requestType, host, path);
  
  client.httpRequest().then((data) => {
    console.log(' ')
    if( MyArgs.isVerbose ){
      console.log(data.verbose)
    } else {
      console.log(JSON.stringify(data.basic, null ,2))
    }
    console.log(' ')

  }).catch((err) => {
    console.log('APP ERROR:' ,err)
  })
}
