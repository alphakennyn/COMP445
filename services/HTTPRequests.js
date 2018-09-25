const http = require('http');
const querystring = require('querystring');


exports.myRequest = async function (requestType, ...args) {
  const headers = args.headers;

  if (args.body) {
    const myBody = querystring.stringify(args.body);
    header['Content-length'] = Buffer.byteLength(myBody);
  }

  const options = {
    host: args.host,
    path: args.path,
    method: requestType.toUpperCase(),
    headers,
  }
  const response = await http.request(options)

  console.log(response)
}

