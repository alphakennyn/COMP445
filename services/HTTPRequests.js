const http = require('http');
const querystring = require('querystring');


exports.myGet = async function (isVerbose, ...argsArray) {
  try {
    const args = argsArray[0];
    const options = {
      host: args.host,
      path: args.path !== undefined ? args.path : '/',
      method: args.requestType.toUpperCase(),
    }
    const url = `${options.host + options.path}`
    console.log(url)
    http.request( options, res => {
      const { statusCode } = res;

      if(statusCode === 200) {
        const myData = {};

        let rawData = '';

        if(isVerbose) {
          myData.headers = res.headers;
        }


        res.on('data', (chunk) => {
          rawData += chunk; 
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            myData.data = parsedData;
          } catch (e) {
            console.error(e.message);
          }
        });

        return myData;
      }
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });;
    // .catch((err) => {
    //   throw new Error('Seomthing went wrong with get..')
    // });

    
    // if(response.statusCode >= 300) {
    //   throw new Error('Somethin when wrong in myRequest')
    // }


    // return response;
  } catch (err) {
    console.log(err);
    return err
  }

}


exports.myPost = async function (requestType, ...argsArray) {
  try {
    const args = argsArray[0];
    if (args.body) {
      const myBody = querystring.stringify(args.body);
      header['Content-length'] = Buffer.byteLength(myBody);
    }
    const options = {
      host: args.host,
      path: args.path !== undefined ? args.path : '/',
      method: requestType.toUpperCase(),
    }

    // const response = http.request(options, res => {
    //   console.log(`STATUS: ${res.statusCode}`);
    //   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //   res.setEncoding('utf8');
    //   res.on('data', (chunk) => {
    //     console.log(`BODY: ${chunk}`);
    //   });
    //   res.on('end', () => {
    //     console.log('No more data in response.');
    //   });
    // });
    http.get(`${options.host + options.path}`, res => {
      const { statusCode } = res;
      console.log(JSON.stringify(res.headers, null, 2))
      Object.keys(res).forEach((value, index) => {
        console.log(index, value)
      })
      if(statusCode === 200) {
        let rawData = '';
        res.on('data', (chunk) => {
          console.log(JSON.parse(chunk))
          rawData += chunk; 
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(JSON.stringify(parsedData, null, 2));
          } catch (e) {
            console.error(e.message);
          }
        });
      }
    })
    // response.on('data', (data) => {
    //   console.log('nice!',data)
    // })
    
    // if(response.statusCode >= 300) {
    //   throw new Error('Somethin when wrong in myRequest')
    // }


    // return response;
  } catch (err) {
    console.log(err);
    return err
  }

}

