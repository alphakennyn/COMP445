const BasicHTTP = require('./models/BasicHTTP');
const Client = require('./models/TCPClient'); //require('./services/HTTPRequests');
const helpDialog = require('./messages/help');


module.exports = class MainApplication {
  constructor(args) {
    this.MyArgs = new BasicHTTP(args);
  }

  /**
   * Go through all the things from Lab 1
   */
  myHttpResponse() {
    if (MyArgs.needsHelp) {
      console.log('=====================================');
      console.log(`============== HELP ${this.myArgs.requestType.toUpperCase()} =============`);
      console.log('=====================================');
      console.log(' ');
  
      switch (this.MyArgs.requestType) {
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
  
      console.log(' ');
      console.log('=======================================');
      console.log(' ');
  
    } else if (this.myArgs.requestType && this.myArgs.url.length > 0) {
      const urlArray = this.myArgs.url.split('/');
      const host = urlArray[2];
      const path = urlArray[3] ? `/${urlArray[3]}` : '/';
      const options = {
        host,
        path,
      }
      const client = new Client(this.myArgs.requestType, host, path);
  
      const postContent = {
        headers: this.myArgs.headers,
        body: this.myArgs.body,
      }
  
      client.httpRequest(postContent).then((data) => {
        console.log(' ')
        if (this.myArgs.isVerbose) {
          console.log(data.verbose)
        } else {
          console.log(JSON.stringify(data.basic, null, 2))
        }
        console.log(' ')
  
      }).catch((err) => {
        console.log('APP ERROR:', err)
      });
    }
  }

}