'use strict';
/* eslint-disable no-console */

const querystring = require('querystring');

function post(protocol, host, path, postObj) {
  const
    q = Promise.defer(),
    http     = require(protocol),
    postData = querystring.stringify(postObj),
    requestParams = {
      host,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      }
    },
    request = http.request(requestParams, (res) => {
      console.log('request completed!');
      let body = '';
      res.setEncoding('utf8');
      res.on('data',  (chunk) => body += chunk);
      res.on('error', (error) => console.error(error));
      res.on('end', () => q.resolve({response: body, postObj}));
    });
  
  request.on('error', (err) => console.error('POST ERROR', err, err.stack));
  request.write(postData);
  request.end();

  return q.promise;
}

exports.post = post;
