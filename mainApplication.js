const path = require('path');

const BasicHTTP = require('./models/BasicHTTP');
const helpDialog = require('./messages/help');
const Client = require('./models/TCPClient');
const FileClient = require('./models/FileClient');


module.exports = class MainApplication {
  constructor(args) {
    this.MyArgs = new BasicHTTP(args);
    this.MyResponse = '';
  }

  /**
   * Go through all the things from Lab 1
   */
  myHttpResponse() {
    if (this.MyArgs.needsHelp) {
      this.MyResponse += '=====================================\n';
      this.MyResponse += `============== HELP ${this.MyArgs.requestType.toUpperCase()} =============\n`;
      this.MyResponse += '=====================================\n\n';

      switch (this.MyArgs.requestType) {
        case 'get':
          this.MyResponse += helpDialog.get;
          break;
        case 'post':
          this.MyResponse += helpDialog.post;
          break;
        default:
          this.MyResponse += helpDialog.default;
          break;
      }

      this.MyResponse += '\n=======================================\n';

    } else if (this.MyArgs.isHTTP && this.MyArgs.requestType && this.MyArgs.url.length > 0) {
      this.MyResponse += 'doing http stuff';
      const urlArray = this.MyArgs.url.split('/');
      const host = urlArray[2];
      const path = urlArray[3] ? `/${urlArray[3]}` : '/';
      const options = {
        host,
        path,
      }
      const client = new Client(this.MyArgs.requestType, host, path);

      const postContent = {
        headers: this.MyArgs.headers,
        body: this.MyArgs.body,
      }

      client.httpRequest(postContent).then((data) => {
        this.MyResponse += '\n';
        if (this.MyArgs.isVerbose) {
          this.MyResponse += data.verbose;
        } else {
          this.MyResponse += JSON.stringify(data.basic, null, 2);
        }
        this.MyResponse += '\n';

      }).catch((err) => {
        console.log('APP ERROR:', err)
      });
    }

    return this.MyResponse;
  }

  /**
   * Go through files search
   * @async
   */
  async myFilesResponse() {
    const filePath = path.join(__dirname, 'storage', this.MyArgs.url);
    const fileClient = new FileClient(filePath);

    console.log(this.MyArgs.url)
    console.log(this.MyArgs.url.includes('/'))

    if (this.MyArgs.url === '/' && this.MyArgs.requestType === 'get') {
      return fileClient.getFile();
    } else if (this.MyArgs.url === '') {
      return new Promise((res) => {
        res('Cannot have empty path.... try again :)');
      })
    } else if(!this.MyArgs.url.includes('.')) {
      return new Promise(res => {
        res('Must specify the file type.')
      })
    }

    if (this.MyArgs.requestType === 'get') {
      return fileClient.getFile();
    } else if (this.MyArgs.requestType === 'post') {
      return fileClient.postFile(this.MyArgs.body, this.MyArgs.override);
    }
  }

  get isHTTP() {
    return this.MyArgs.isHTTP;
  }
}